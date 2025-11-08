import handleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
  err.statusCode=err.statusCode || 500;
  err.message=err.message || "Internal Server Error"

  // case error
  if (err.name==='CastError') {
    const message=`this is invalid resource ${err.path}`
    err=new handleError(message,404)
  }
  // duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const message = `This ${Object.keys(err.keyValue)} already exists, please login to continue.`;
    err = new handleError(message, 400);
  }
  res.status(err.statusCode).json({
    success:false,
    message:err.message
  })
}