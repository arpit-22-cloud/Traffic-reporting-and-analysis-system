import app from "./app.js";
import dotenv from 'dotenv'
dotenv.config()
import { connectMongoDb } from './config/db.js'
connectMongoDb();

// import Razorpay from 'razorpay'


// import {v2 as cloudinary} from 'cloudinary'
// cloudinary.config({
//   cloud_name:process.env.CLOUDINARY_NAME,
//   api_key:process.env.API_KEY,
//   api_secret:process.env.API_SECRET
// })
const port = process.env.PORT || 3000;
// export const instance= new Razorpay({
//   key_id:process.env.RAZORPAY_API_KEY,
//   key_secret:process.env.RAZORPAY_API_SECRET,
// })

// handle uncaught execption errors
process.on('uncaughtException',(err)=>{
  console.log(`Error :${err.message}`)
  console.log(`server is shutting down due to uncaught exception errors`)
  process.exit(1);
})
const server = app.listen(port, () => {
  console.log(`server is listening on ${port}`)
})

process.on('unhandledRejection', (err) => {
  console.log(`Error:${err.message}`)
  console.log(`Server is shutting down due to unhandled promise rejection`)
  server.close(()=>{
    process.exit(1)
  })
})