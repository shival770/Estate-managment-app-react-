import React, { useEffect, useState } from 'react';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import SwiperCore from "swiper"
import { Swiper , SwiperSlide } from 'swiper/react';
import {Navigation} from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Contact from '../components/contact.jsx';

export default function Listing() {
   SwiperCore.use([Navigation]);

    const {currentUser} = useSelector(state => state.user);
    const [listing , setListing] = useState(null);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(false);
    const [contact , setContact] = useState(false);
    const params = useParams();
     console.log(params.id);
    useEffect(()=>{
        const fetchListing = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`/api/listing/get/${params.id}`);
                const data = await res.json();
                if(data.success == false){
                    setLoading(false);
                    setError(false);
                    return;
                }
                setLoading(false);
                setListing(data);
                setError(false);
                console.log(data);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    } , [params.id]);
  return <main>
    {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
      {
       listing && !loading && !error && (
        <div>
            <Swiper navigation>
            {listing.imageURL.map((url)=>(
              <SwiperSlide key={url} >
                <div 
                className='h-[500px] w-full'
                style={{background: `url(${url}) center no-repeat `, objectFit:'cover' }}>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='flex flex-col gap-4 mx-auto max-w-4xl p-3 my-7'>
            <p className='text-2xl font-semibold'>
                {listing.name} - ${' '}
                {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' /month'}
            </p>
            <p className='flex gap-3 text-slate-700 items-center'>
                <FaMapMarkerAlt className='w-10 text-green-600' />
                {listing.address}
            </p>
            <div className='flex gap-4'>
                <p className='bg-red-900 w-full max-w-[200px] p-1 rounded-lg text-white text-center'>
                    {listing.rent=='rent' ? 'For Rent' : 'For Sale' }
                </p>
                {
                    listing.offer && <p className='bg-green-800 w-full max-w-[200px] p-1 rounded-lg text-white tex-center'>{+listing.regularPrice - +listing.discountPrice} off</p>
                }
            </div>
            <p className='text-slate-600'><span className='font-semibold text-black'>Description :-</span>{listing.description}</p>
            <div className='flex gap-6'>
                <div className='text-green-700 flex gap-1 items-center'>
                    <FaBed className='w-5' />
                    <span className='font-semibold'>{listing.bedrooms > 1 ? 'Beds' : 'Bed' }</span>
                </div>
                <div className='text-green-700 flex gap-1 items-center'>
                    <FaBath className='w-5' />
                    <span className='font-semibold'>{listing.bathrooms > 1 ? 'Baths' : 'Bath' }</span>
                </div>
                <div className='text-green-700 flex gap-1 items-center'>
                    <FaParking className='w-5' />
                    <span className='font-semibold'>{listing.parking? 'Parking' : 'No parking' }</span>
                </div>
                <div className='text-green-700 flex gap-1 items-center'>
                    <FaChair className='w-5' />
                    <span className='font-semibold'>{listing.furnished ?  'Furnished' : 'No Furnished' }</span>
                </div>
            </div>
             {
                currentUser && currentUser._id != listing.userRef && (
                    <button className='w-full bg-slate-700 p-3 border rounded-lg text-white slate-700 uppercase hover:opacity-95 ' onClick={()=>setContact(true)}>Contact Landlord</button>
                )
             }
             {
                contact && <Contact listing={listing} />
             }
          </div>
        </div>
       )
      }
  </main>
}
