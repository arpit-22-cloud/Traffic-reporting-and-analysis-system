import handleAsyncError from "../models/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
export const verifyUserAuth = handleAsyncError(async(req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);
  if (!token) {
    return next(new handleError("please login to access this resource", 401))
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decodedData);
  req.user= await User.findById(decodedData.id);
  next();
})

export const roleBasedAcess=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new handleError(`role- ${req.user.role} is not allwoed to use this resources`,403))

    }
    next()
  }
}