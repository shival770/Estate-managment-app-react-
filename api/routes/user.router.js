import express from 'express';
import { deleteUser, updateUser , getUser , showListings } from '../controllers/user.controller.js';
import { verifyUser } from '../utilies/verifyUser.js';

const router = express.Router();


router.post("/update/:id" ,verifyUser, updateUser);
router.delete("/delete/:id" ,verifyUser, deleteUser);
router.get('/:id' , getUser); 
router.get('/listings/:id' ,verifyUser, showListings);



export default router;