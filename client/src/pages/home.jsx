import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Swiper , SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from '../components/listingItem.jsx';

export default function Home() {

   const [offerListings , setOfferListings] = useState([]);
   const [rentListings , setRentListings] = useState([]);
   const [saleListings , setSaleListings] = useState([]);
   SwiperCore.use([Navigation ])
   console.log(offerListings);
   console.log(rentListings);
   console.log(saleListings)

   useEffect(()=>{
    const fetchOfferListings = async ()=>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async ()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json();
        setRentListings(data);
         fetchSaleListings();
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async ()=>{
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await res.json();
        setSaleListings(data);  
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings();

   }, []);

   


  return (
    <div>
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageURL[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className='max-w-6xl p-3 flex flex-col gap-8 my-10 mx-auto'>
         {offerListings && offerListings.length > 0 && (
          <div className='flex flex-col gap-2'>
             <div>
              <h2 className='text-xl text-slate-500 font-semibold sm:text-2xl'>Recent offers</h2>
              <Link to={'/search?offer=true'} className='text-green-600 hover:underline text-sm'>show more offers</Link>
             </div>
             <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
             </div>
          </div>
         )}

          {rentListings && rentListings.length > 0 && (
          <div className='flex flex-col gap-2'>
             <div>
              <h2 className='text-xl text-slate-500 font-semibold sm:text-2xl'>Recent places for rent</h2>
              <Link to={'/search?type=rent'} className='text-green-600 hover:underline text-sm'>show more offers</Link>
             </div>
             <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
             </div>
          </div>
         )}

        {saleListings && saleListings.length > 0 && (
          <div className='flex flex-col gap-2'>
             <div>
              <h2 className='text-xl text-slate-500 font-semibold sm:text-2xl'>Recent places for sale</h2>
              <Link to={'/search?type=sale'} className='text-green-600 hover:underline text-sm'>show more offers</Link>
             </div>
             <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
             </div>
          </div>
         )}
      </div>
    </div>
  )
}
