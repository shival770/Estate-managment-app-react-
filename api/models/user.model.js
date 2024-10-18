import { timeStamp } from "console";
import mongoose, { Schema, mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String , 
        required : true ,
        unique : true
    },
    email : {
        type : String , 
        required : true , 
        unique : true
    },
    password : {
        type : String , 
        require : true
    },
    avator : {
        type : String , 
        default : "https://tse3.mm.bing.net/th?id=OIP.Cl56H6WgxJ8npVqyhefTdQHaHa&pid=Api&P=0&h=180",
    }
} , {timestamps : true});


const User = mongoose.model('user' , userSchema);


export default User;