import { app } from "../firebase.js";
import { getStorage , getDownloadURL , ref  , uploadBytesResumable } from "firebase/storage"
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {signInStart , signInFailure , signInSuccess  , updateFailire , updateStart , updateSuccess
  ,deleteFailure,deleteStart,deleteSuccess , signOutFailure, signOutSuccess , signOutStart} from '../redux/user/userSlice.js'
import { setLogLevel } from "firebase/app";

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [formData , setFormData] = useState({});
  const [files , setFiles] = useState(null);
  const fileRef = useRef(null);
  const [filePer , setFilePer] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false);
  const [listings , setListings] = useState([]);
  const [showListingsError , setShowListingsError] = useState(null);
  const [showListingsLoading , setShowListingsLoading] = useState(false);
  console.log(listings);
  console.log(filePer);
   


  const deleteUserListing = async (listingId)=>{
       try {
        const res = await fetch(`/api/listing/delete/${listingId}` , {
          method : "DELETE"
        });
        const data = await res.json();
        if(data.success == false) return ;
        setListings([
          ...listings.filter((listing => listing._id != listingId))
        ])
       } catch (error) {
        console.log(error);
       }
  }
  const showListings = async () => {
    setShowListingsLoading(true);
    try {
      const res = await fetch (`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success == false){
        setShowListingsLoading(false);
        setShowListingsError(data.message);
      }
      setListings(data);
      setShowListingsLoading(false);
      
    
    } catch (error) {
      setShowListingsLoading(false);
      setShowListingsError(error.message);
    }
  }
  const handleOnChange = (e)=>{
    setFormData({
      ...formData , [e.target.id] : e.target.value,
    })
  }
  const handleSignOut = async (req , res , next) => {
    try {
        dispatch(signOutStart());
        const res = await  fetch("/api/auth/sign-out");
        const data = await res.json();
        if (data.success == false) {
          dispatch(signOutFailure(data.message));
          return ;
        }
        dispatch(signOutSuccess(data));
    } catch (error) {
       dispatch(signOutFailure(error));
    }
  }
  const handleFileUpload = (files)=>{
       const storage = getStorage(app);
       const fileName = new Date().getTime() + files.name;
       const storageRef = ref(storage , fileName);
       const uploadTask = uploadBytesResumable(storageRef , files);



       uploadTask.on(
        'state_changed' ,
        (snapshot) => {
            const progress = 
            (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setFilePer(progress);
        },
        (error) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downLoadUrl) => {
            setFormData({...formData , avator : downLoadUrl});
          })
        }
       )
  }

  useEffect(()=>{
    if(files){
      handleFileUpload(files);
    }
  } , [files]);


  const handleDeleteUser = async () => {
    try {
      dispatch(deleteStart());
      const res = await fetch (`/api/user/delete/${currentUser._id}` , {
        method : "DELETE",
      })
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteFailure(data.message));
        return ;
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }

  const handleOnSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}` , {
        method : 'POST' ,
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success == false) {
        dispatch(updateFailure(data.message));
        return ;
      }
      dispatch(updateSuccess(data));
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto' >
       <h1 className='font-semibold  text-slate-700 text-3xl text-center my-7 '>Profile</h1>
       <form onSubmit={handleOnSubmit} className='flex flex-col gap-4'>
          <input onChange={(e) => setFiles(e.target.files[0])} type="file" ref={fileRef} name="" id=""  accept='image/*' hidden/>
         <img onClick={()=>fileRef.current.click()} src={formData.avator || currentUser.avator} alt="" className='h-24 w-24 rounded-full shadow-sm self-center cursor-pointer' />
         <p className="text-center">
          {
            fileUploadError ? (<span className="text-red-600">Error image upload (image must be less than 2 mb)</span>)
            : 
            filePer > 0 && filePer < 100 ?
            (<span className="text-slate-700" >{`Uploading ${filePer} %` }</span>)
            :
            filePer === 100 ? 
            (<span className="text-green-600">Successfully Upload</span>) : ""
          }
          </p>
         <input onChange={handleOnChange} type="text" placeholder='username' className='p-3 border rounded-lg' id='username' defaultValue={currentUser.username} />
         <input onChange={handleOnChange} type="text" placeholder='email' className='p-3 border rounded-lg' id='email' defaultValue={currentUser.email} />
         <input onChange={handleOnChange} type="text" placeholder='password' className='p-3 border rounded-lg' id='password' />
         <button className='bg-slate-600 rounded-lg text-white border uppercase p-3 hover:opacity-95 disabled::opacity-85'>Update</button>
         <Link to={'/create-listing'} className='bg-green-600 rounded-lg  text-white border  uppercase p-3 hover:opacity-95 disabled::opacity-85'>
           <p className="text-center">Create Listing</p>
         </Link>
         </form>
         <div className='flex justify-between'>
          <span className='text-red-600 cursor-pointer' onClick={handleDeleteUser}>Delete account</span>
          <span className='text-red-600 cursor-pointer' onClick={handleSignOut}>Sign out</span>

         </div>
         <p className="text-green-600 text-center cursor-pointer" onClick={showListings}>Show Listings</p>
         {
          showListingsLoading && <p className="text-center ">Loading....</p>
         }
         {
          showListingsError && <p>{showListingsError}</p>
         }
         {

            listings && listings.length > 0 && (
              <div className="flex flex-col gap-2  ">
                <h1 className="font-semibold text-center">Your Listings</h1>
                {
                  listings.map((listing , index)=>(
                    <div key={listing._id} className="flex justify-between items-center p-1 border border-b-2 border-slate-400 rounded-lg gap-2">
                      <img src={listing.imageURL[0]} className="w-20 h-10 object-cover rounded-lg" />
                      <Link to={`/listing/${listing._id}`}>
                        <p className="hover:underline font-semibold">{listing.name}</p>
                      </Link>
                      <div className="flex flex-col items-center gap-1">
                        <button onClick={()=>deleteUserListing(listing._id)} className="text-sm text-red-700 cursor-pointer">DELETE</button>
                        <Link to={`/update-listing/${listing._id}`} >
                        <button className="text-sm text-slate-700 cursor-pointer">EDIT</button>
                        </Link>
                      </div>
                    </div>

                  ))
                }
              </div>
            )
         }
       
    </div>
  )
}
