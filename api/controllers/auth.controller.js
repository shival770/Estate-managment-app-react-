import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utilies/error.js";
import jwt from "jsonwebtoken";

const signUp = async (req , res , next ) =>{
    console.log(req.body);
    
    const {username , email , password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password , 10);
    const newUser = new User({
        username : username ,
        email : email ,
        password : hashedPassword

    })
    try{
        await newUser.save().then(()=>console.log("user Created")).catch(error => next(error));
        res.status(200).json("User created successfully!")
    }catch(error){
        next(error);
    }

}

const signIn = async (req , res , next) => {
    

    const {email , password} = req.body;
    try {
        const validUser = await User.findOne({email : email});
        console.log(validUser);
        
        if(!validUser) return next(errorHandler(404 , 'User not found!'));
        const validPassword = bcryptjs.compareSync(password , validUser.password);
        if(!validPassword) return next(errorHandler(401 , 'wrong credentials'));
    
        const token = jwt.sign({id : validUser._id} , "MernState");
        const { password: pass , ...rest} = validUser._doc;
        console.log(rest);
        res
        .status(200)
        .cookie('access_token' , token , {httpOnly : true})
        .json(rest);



    } catch (error) {
        next(error);
    }
}


const google = async (req , res , next) => {
    try {
        const user = await User.findOne({email : req.body.email});
        if(user){
           const token = jwt.sign({id : user._id} , "MernState");
           const {password : pass , ...rest} = user._doc;
           res.status(200).cookie("access_token" , token , {httpOnly : true}).json(rest)

        }else {
            const genereatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(genereatePassword , 10);
            const newUser = new User({
                username : req.body.name.split(" ").join(" ").toLowerCase()+Math.random().toString(36).slice(-4),
                email : req.body.email,
                password : hashedPassword,
                avator : req.body.photo,
            })
            await newUser.save();
            const token = jwt.sign({id : newUser._id} , "MernState");
            const {password : pass , ...rest} = newUser._doc;
            res.json(200).cookie("access_token" , token , {httpOnly : true}).json(rest);

        }
    } catch (error) {
        next(error);
    }

}


export const signOut = async (req , res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been sign out!")
    } catch (error) {
        next(error);
    }
}

export {signIn , signUp , google}