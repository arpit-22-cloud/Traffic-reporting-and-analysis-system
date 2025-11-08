
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import payment from './routes/PaymentRoutes.js'
// import product from './routes/productRoutes.js'
import user from './Routes/userRoutes.js'
import map from './Routes/mapRoutes.js'
// import order from './routes/orderRoutes.js'
import errorHandleMiddleware from './middleware/error.js'
// import fileUpload from "express-fileupload";
import dotenv from 'dotenv'
const app=express();
app.use(cors({origin:'http://localhost:8000', credentials: true}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(fileUpload())

// app.use('/api',product)
app.use('/api',user)
app.use('/api',map)
// app.use('/api',payment)

app.use(errorHandleMiddleware)
dotenv.config()
export default app;