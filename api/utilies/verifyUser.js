import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';


export const verifyUser = (req , res, next) => {
    const token = req.cookies.access_token;
    if(!token) return next(errorHandler(404 , 'Unauthorized'));

    jwt.verify(token , 'MernState' , (err , user) => {
        if(err) return next(errorHandler(403 , 'Forbidden'));
        req.user = user;
        next();
    } )

}