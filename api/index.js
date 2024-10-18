import express from "express";
import mongoose, { mongo } from "mongoose";
import authRouter from './routes/auth.router.js'
import userRouter from './routes/user.router.js';
import listingRouter from './routes/listing.router.js'
import cookieParser from "cookie-parser";

mongoose.connect("mongodb+srv")
.then(()=>{
    console.log("Connected to mongo-db");
}).catch(err=>console.log(err));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRouter);
app.use('/api/user' , userRouter);
app.use("/api/listing" , listingRouter);

app.use((err , req , res , next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server Error";
    res.status(statusCode).json({
        success : false,
        statusCode ,
        message
    })
})

app.listen(3000 , ()=>{
    console.log("Server is run on port 3000!")
})