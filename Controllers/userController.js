// const User =require("../Models/userModel")
// const bcrypt = require('bcrypt');
// const JWT=require("jsonwebtoken");

// const generateToken = (id) => {
//   return JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };



// module.exports.registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     user = await User.create({ name, email, password, role });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// module.exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// module.exports.Resetpassword=async (req,res)=>{
//   const{email}=req.body;
  
//   const user=await User.findOne({email});
//   if(!user) return res.status(400).json({message:"invalid User"});

//   }





// module.exports.getProfile = async (req, res) => {
//   const user = await User.findById(req.user.id); // req.user is set by protect middleware
//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   });
// };

import handleAsyncError from "../Models/handleAsyncError.js";
import User from "../Models/userModel.js";
import handleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import {sendEmail}  from "../utils/sendEmail.js";
import { webcrypto } from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();



export const registerUser = handleAsyncError(async (req, res, next) => {
  try {
    const { name, email, password} = req.body;
   
    const user = await User.create({
      name,
      email,
      password
    })

    sendToken(user, 201, res)
  } catch (error) {
    return next(error)

  }


})


// login user

export const loginUser = handleAsyncError(async (req, res, next) => {
  try {

    const { email, password } = req.body;
    console.log(email, password, req.body)
    if (!email || !password) {
      console.log('Email or password is empty');
      return next(new handleError("email or password can`t be empty", 400));
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      console.log('User not found');
      return next(new handleError("invalid email or password", 401))
    }
    console.log("user:", user)
    const isPasswordValid = await user.verifyPassword(password)
    if (!isPasswordValid) {
      console.log('Invalid password');
      return next(new handleError("invalid email or password", 401))
    }
    // console.log('Login successful:',email);
    sendToken(user, 200, res)

  } catch (error) {
    // console.error('Login error:', error);
    return next(error)

  }

})



// logout 
export const logoutUser = handleAsyncError(async (req, res, next) => {
  try {
    res.cookie('token', null, {
      expire: new Date(Date.now()),
      httpOnly: true
    })
    res.status(200).json({
      success: true,
      message: "successfully logged out"
    })
  } catch (error) {
    return next(error)

  }
})


export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
  // const { email } = req.body;
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new handleError(`user doesn't exist`, 400))
  }
  let resetToken;
  try {
    resetToken = user.generatePasswordResetToken()
    await user.save({ validateBeforeSave: false })
    console.log(resetToken)
  } catch (err) {
    console.log(err)
    return next(new handleError(`could not save token , please try again later`, 500))

  }
  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`
  const message = `use the following link to reset your password :\\n\n${resetPasswordUrl}. \n\n  This link will expire in 30 minutes.\n\n  If you didn't request a pasword reset, please ignore this message.`
  try {
    await sendEmail({
      email:` ${user.email}`,
      subject: 'password reset request',
      message: message

    })
    res.status(200).json({
      success: true,
      message: `Email is sent to ${user.email} successfully`
    })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false })
    return next(new handleError(`email couldn't be send , please try again later`, 500))

  }
})
// reset password
export const resetPassword = handleAsyncError(async (req, res, next) => {
  const buffer = Buffer.from(req.params.token, 'utf-8');

  const hashBuffer = await webcrypto.subtle.digest('SHA-256', buffer);
  const resetPasswordToken = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new handleError('Reset password token is invalid or has expired', 400));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new handleError('Passwords do not match', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
})


// get user detail
export const getUserDetails = handleAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user
  }) 
  } catch (error) {
    console.log(error)
  }
 
})
// update password
export const updatePassword = handleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = res.body
  const user = await User.findById(req.user.id).select("+password")
  const checkPassword = await user.verifyPassword(oldPassword)
  if (!checkPassword) {
    return next(new handleError('old password is incoorect', 400))
  }
  if (newPassword !== confirmPassword) {
    return next(new handleError('password doesn"t match', 400))

  }
  user.password = newPassword
  await user.save()
  sendToken(user, 200, res)
})

// update profile
export const updateProfile = handleAsyncError(async (req, res, next) => {
  const { email, name, avatar } = res.body
  const updateUserDetails = {
    name,
    email
  }
  if (avatar !== '') {
    const user = await User.findById(req.user.id)
    const imageId = user.avatar.public_id
    await cloudinary.uploader.destroy(imageId)
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale'
    })
    updateUserDetails.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
    new: true,
    runValidators: true,

  })
  res.status(200).json({
    success: true,
    message: "profile updated successfully",
    user
  })
})

// admin getting user info
export const getUserList = handleAsyncError(async (req, res, next) => {
  const users = await User.find();
  console.log(users)
  res.status(200).json({
    success: true,
    users
  })
})

//admin getting single user

export const getSingleUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new handleError(`user doesn't exists with this id ${req.params.id}`, 400))

  }
  res.status(200).json({
    success: true,
    user
  })
})
// admin chaning user roles
export const updateUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const newUserData = {
    role
  }
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true
  })
  if (!user) {
    return next(new handleError(`user doesn't exists`, 400))
  }
  res.status(200).json({
    success: true,
    user
  })
})
// deleting profile
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new handleError(`user doesn't exists`, 400))
  }
  const imageId = user.avatar.public_id
  await cloudinary.uploader.destroy(imageId)
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    user
  })
})