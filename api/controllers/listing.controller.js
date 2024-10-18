
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utilies/error.js';

export const createListing = async (req , res , next) => {
    try {
        const listing = await Listing.create(req.body);
         return res.status(200).json(listing)
    } catch (error) {
        next(error);
    }
}



export const getListing = async (req , res , next ) => {
    
    try {
        const listing = await Listing.findOne({_id:req.params.id});
        if(!listing) return next(errorHandler(404  , 'Listing not found!'));
    
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req , res , next) => {
    console.log(req.params.id);
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if(!listing) return next(errorHandler(404 , 'Listing not found!'));
    if(req.user.id != listing.userRef) return next(errorHandler(401 , 'You can delete your own listings!'));
    


    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("listing has been deleted")
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req , res , next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404 , 'Listing not found!'));
    if(req.user.id != listing.userRef) return next(errorHandler(401 , 'You can delete your own listings!'));
    

    try {
        const updatelisting = await Listing.findByIdAndUpdate(req.params.id , req.body , {new:true});
        res.status(200).json(updatelisting);
    } catch (error) {
        next(error)
    }
   
}

export const getListings = async (req , res , next) => {
    console.log('hi');
    try {
        const limit= req.query.limit || 9 ;
        const startIndex = req.query.startIndex || 0;
        const searchTerm = req.query.searchTerm;
        let offer = req.query.offer;
        let parking = req.query.parking;
        let furnished = req.query.furnished;
        let type = req.query.type;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';


        offer =  !offer || offer === 'false' ? { $in : [false , true] } : offer;
        parking = !parking || parking === 'false' ? { $in : [false , true]} : parking ;
        furnished = !furnished || furnished === 'false' ? { $in : [false , true]} : furnished;
        type = type === undefined || type === 'all' ? { $in : ['rent' , 'sale']} : type;



        const filter = {
            name : {$regex : searchTerm , $options : 'i'},
            offer,
            type,
            parking,
            furnished
        }
        const listings = await Listing.find(filter).sort({[sort] : order}).limit(limit).skip(startIndex);
        res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}