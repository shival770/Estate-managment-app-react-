import React, { useState , useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ListingItem from '../components/listingItem.jsx';
import { list } from 'firebase/storage';

export default function Search() {

   const navigate = useNavigate();
   const [sideBarData , setSideBarData] = useState({
    searchTerm : '',
    type : 'all',
    parking : false,
    offer : false,
    furnished : false,
    sort : 'created_at',
    order : 'desc'

   });
   const [loading , setLoading] = useState(false);
   const [listings , setListings ] = useState([]);
   const [showMore , setShowMore] = useState(false);

   const handleChange  = (e) => {
    if (e.target.id === 'searchTerm'){
          setSideBarData({
            ...sideBarData , searchTerm : e.target.value
          })
    }

    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
        setSideBarData({
            ...sideBarData , type : e.target.id
        })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setSideBarData({
            ...sideBarData , [e.target.id] : e.target.checked
        })
    }
    if(e.target.id === 'sort_order'){
        const sort = e.target.value.split('_')[0] || 'created_at';
        const order = e.target.value.split('_')[1] || 'desc';
        setSideBarData({
            ...sideBarData , sort , order
        })
    }
   }

   useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const offerFromUrl = urlParams.get('offer');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');



    if( searchTermFromUrl || typeFromUrl || offerFromUrl || 
        parkingFromUrl || furnishedFromUrl || sortFromUrl || orderFromUrl){
            setSideBarData({
                searchTerm : searchTermFromUrl || '' , 
                type : typeFromUrl || 'all' ,
                offer : offerFromUrl === 'true' ? true : false,
                parking : parkingFromUrl === 'true' ? true : false,
                furnished : furnishedFromUrl ==='true' ? true : false,
                sort : sortFromUrl || 'created_at',
                order : orderFromUrl || 'desc'
            })
        }

        const fetchListings = async  () => {
              setLoading(true);
              setShowMore(false);
              const searchQuery = urlParams.toString();
              const res = await fetch (`/api/listing/get?${searchQuery}`);
              const data = await json();
              if(data.length > 9) setShowMore(true)
              else setShowMore(false);
              setLoading(false);
              setListings(data);
        }
        fetchListings();
   } , [window.location.search]);
   
   const handleOnSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm' , sideBarData.searchTerm);
        urlParams.set('type' , sideBarData.type);
        urlParams.set('offer' , sideBarData.offer);
        urlParams.set('parking' , sideBarData.parking);
        urlParams.set('furnished' , sideBarData.furnished);
        urlParams.set('sort' , sideBarData.sort);
        urlParams.set('order' , sideBarData.order);
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`);
   }

   const handleShowMore = async  () => {
    setShowMore(false);
    const numberOfListing = listings.length;
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('startIndex' , startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch (`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length > 8 ) setShowMore(true);
    else setShowMore(false);
    setListings({
        ...listings , ...data
    })
   }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleOnSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap '>Seach Term:</label>
                        <input 
                            type='text'
                            placeholder='Search...'
                            id='searchTerm'
                            name='searchTerm'
                            className='border rounded-lg p-3 w-full'
                            onChange={handleChange}
                            value={sideBarData.searchTerm}
                            />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label>Type:</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sideBarData.type==='all'} />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange}  checked={sideBarData.type==='rent'} value={sideBarData.type} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={sideBarData.type==='sale'} value={sideBarData.type} />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sideBarData.offer} value={sideBarData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label>Amenities:</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sideBarData.parking
                            } value={sideBarData.parking} />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' onChange={handleChange}  checked={sideBarData.furnished} value={sideBarData.furnished} />
                            <span>Furnished</span>
                        </div>
                        
                    </div>
                    <div className='flex gap-2 items-center'>
                        <label>Sort:</label>
                        <select id="sort_order" onChange={handleChange} defaultValue={'created_at_desc'} className='p-3 border rounded-lg'>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to heigh</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>

                        </select>
                    </div>
                    <button  className='bg-slate-700 uppercase text-white rounded-lg w-full p-3 hover:opacity-95'>Search</button>
                    
            </form>
        </div>
        <div className=' w-full '>
            <h1 className='font-semibold text-3xl sm:4xl p-3'>Listing Result :</h1>
          
            <div className='flex flex-wrap gap-4 p-2'>
                {
                    !loading && listings.length == 0 && (
                        <h2 className='text-2xl font-semibold text-center'>No listing found</h2>
                    )
                }
                {
                    loading && (
                        <h2 className='text-2xl font-semibold text-center'>Loading...</h2>
                    )
                }
                {
                    !loading && listings && listings.map((listing , index)=>(
                        <ListingItem id={listing._id} listing={listing} />
                    ))
                }
                {
                    showMore && 
                     <button onClick={handleShowMore} className='text-green-green hover:underline p-7'> show More</button>
                }
            </div>
        </div>
    </div>
  )
}
