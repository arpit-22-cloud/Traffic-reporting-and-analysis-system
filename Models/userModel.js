// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const { Schema } = require('mongoose');
// const crypto = require("crypto");


// const UserSchema =Schema({
//     name:{
//         type:String,
//         require:true,
//         trim:true,
//     },
//     email:{
//         type:String,
//         require:true,
//         trim:true,
//          unique: true,
//         lowercase: true,
//          match: [/.+@.+\..+/]
//     },
//      password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [6, "Password must be at least 6 characters long"],
//     select: false, // hides password when querying users
//      match: [
//     /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/],
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
//   role: {
//     type: String,
//     enum: ["citizen", "admin", "analyst"],
//     default: "citizen"
//   },

//   phone: {
//     type: Number,
//     trim: true
//   },

//   address: {
//     type: String,
//     trim: true
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// })

// // 🔹 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // 🔹 Compare password for login
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Generate Password Reset Token
// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(10).toString("hex");

//   // Hash the token and store in DB
//   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//   // Token valid for 15 minutes
//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return resetToken;
// };



// const User = mongoose.model("User",UserSchema);
// module.exports=User;

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import {webcrypto} from 'crypto'

const jwt=jsonwebtoken
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter your name'],
    maxLength: [25, 'invalid name. Please enter a valid name with fewer than 25 characters'],
    minLength: [3, 'Name should contain 3 characters']
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minLength: [8, 'password should contain 8 characters'],
    select: false,

  },
  role: {
    type: String,
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true })

// password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();

})
userSchema.methods.getJwtToken=function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn:`${process.env.JWT_EXPIRE}`*24*60*60*1000
  })
}
userSchema.methods.verifyPassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
} 

userSchema.methods.generatePasswordResetToken = async function () {
  // Generate secure random token (20 bytes => 40 hex characters)
  const randomBytes = new Uint8Array(20);
  webcrypto.getRandomValues(randomBytes);
  const resetToken = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Hash the token using SHA-256
  const tokenBuffer = Buffer.from(resetToken, 'utf-8');
  const hashBuffer = await webcrypto.subtle.digest('SHA-256', tokenBuffer);
  const hashedToken = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Save hashed token and expiry on the user
  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return resetToken;
};

export default mongoose.model('user', userSchema)

