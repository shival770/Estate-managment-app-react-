import { errorHandler } from "../utilies/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";


 export const updateUser = async (req , res , next) => {
   console.log(req.user.id);
   console.log(req.params.id);
    if(req.user.id !== req.params.id) return next(errorHandler(401 , 'You can only update your own account!'));
       
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password , 10);

        }   
        const updateUser = await User.findByIdAndUpdate(req.params.id , {
            $set : {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avator : req.body.avator

            },
        } , {new : true});
        console.log(updateUser);

        const { password : pass  , ...rest} = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
 }




 export const deleteUser = async (req , res , next) => {
    if (req.user.id !== req.params.id) return (next(errorHandler(403 , 'You can only delete your own account!')));
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("user has been deleted successfully!")
    } catch (error) {
        next(error);
    }
 }

 export const getUser = async (req , res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(errorHandler(404 , 'use not found!'));
        const { password : pass , ...rest} = user._doc;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
 }

 export const showListings = async (req , res , next) => {
    console.log(req.params.id);
    console.log(req.user.id);
    if(req.user.id !== req.params.id) return next(errorHandler(401 , 'you can only view your own listings.'))
    try {
        const listings = await Listing.find({userRef : req.params.id});
        console.log(listings);
        if(!listings) return next(errorHandler(404 , 'Listings not found!'));
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
 }