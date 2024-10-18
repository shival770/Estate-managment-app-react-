import express from "express";
import { createListing, getListing , deleteListing, updateListing  , getListings} from "../controllers/listing.controller.js";
import { verifyUser } from "../utilies/verifyUser.js";

const router = express.Router();



router.post("/create" , createListing);
router.get('/get/:id' , getListing);
router.delete('/delete/:id' ,verifyUser, deleteListing);
router.post('/update/:id' ,verifyUser, updateListing);
router.get('/get' , getListings);


export default router;