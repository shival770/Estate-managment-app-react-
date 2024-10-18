import mongoose from "mongoose";



const listingSchema = new mongoose.Schema({
    name : {
        required : true,
        type : String
    },
    description : {
        type : String , 
        required : true
    },
    address : {
        type : String ,
        required : true
    },
    regularPrice : {
        type : Number,
        required : true 
    },
    discountPrice : {
        type : Number , 
        required : true
    },
    bathrooms : {
        type : Number,
        required : true
    },
    bedrooms : {
        type : Number , 
        required : true 
    },
    furnished : {
        type : Boolean ,
        requried : true
    },
    parking : {
        type : Boolean,
        requried : true

    },
    type : {
        type : String ,
        requried : true

    },
    offer : {
        type : Boolean,
        required : true
    },
    imageURL : {
        type : Array ,
        requried : true

    },
    userRef : {
        type : String ,
        required : true
    }
} , {timestamps : true});  


const Listing = mongoose.model('listing' , listingSchema);



export default Listing;