import React , {useState} from 'react';
import {getStorage , getDownloadURL , ref , uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function createListing() {
     const { currentUser } = useSelector(state => state.user);

    const [files , setFiles] = useState([]);
    const navigate = useNavigate();
    const [formData , setFormData] = useState({
        imageURL : [],  
        name : '',
        description : '',
        address : '',
        type : 'rent',
        bedrooms : 1,
        bathrooms : 1,
        regularPrice : 50 ,
        discountPrice : 0,
        offer : false,
        parking : false,
        furnished : false,
      });
    const [filesUploadError , setFilesUploadError ] = useState(null);
    const [uploading , setUploading ] = useState(false);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(false);
    const handleOnChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
             ...formData,  type : e.target.id
            })
        }
        if(e.target.id === 'offer' || e.target.id ==='parking' || e.target.id === 'furnished'){
            setFormData({
               ...formData , [e.target.id] : e.target.checked
            })
        }
        if (e.target.type === 'number'  || e.target.type == 'textarea' || e.target.type === 'text'){
            setFormData({
                ...formData ,[e.target.id] : e.target.value
            })
        }
    }

  console.log(files);
  console.log(formData.imageURL);
    const handleOnSubmit = async (e) =>{
        e.preventDefault();
        if(formData.imageURL.length < 0) return setError("You must upload at least one image.");
        if(+formData.regularPrice < +formData.discountPrice)  return setError("Discount price must be lower than regular price. ");
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('/api/listing/create' , {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    ...formData, 
                    userRef : currentUser._id
                })
            })
            const data = await res.json();
            if (data.success == false){
                setError(data.message);
                setLoading(false);
                return 
            }
            setLoading(false);
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }
    const handleUploadImage = (e) => {
        e.preventDefault();
        if(files.length > 0 && files.length + formData.imageURL.length < 7 ){
            setUploading(true);
            setFilesUploadError(false);
            const promises = [];
            for (let i = 0 ; i<files.length ; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((url)=>{
                setFormData({
                    ...formData , imageURL : formData.imageURL.concat(url)
                })
            })
            setUploading(false);
            setFilesUploadError(false);

        }else{
            setUploading(false);
            setFilesUploadError("Image upload failed (2mb max per image")
            
        }
    }
    const handleRemoveImage = (index)=>{
        setFormData({
            ...formData , imageURL : formData.imageURL.filter((_ ,i)=> i!=index),
        })
    }
   const storeImage = (file) => {
    return Promise((resolve , reject)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage , fileName);
        const uploadTask = uploadBytesResumable(storageRef , file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                console.log("upload task : "+progress);
            },
            (error)=>{
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downLoadUrl=>{
                    resolve(downLoadUrl);
                })
            }
        )
    })
   }

  return (
    <main className='max-w-4xl p-3 mx-auto'>
        <h1 className='text-3xl font-semibold text-slate-800 text-center my-7'>
            Create a Listing
        </h1>
        <form onSubmit={handleOnSubmit} className='flex  flex-col sm:flex-row'>
            <div>
        <div className='flex flex-col gap-4 m-2'>
            <input onChange={handleOnChange} type='text' className='p-3 border rounded-lg' placeholder='Name' id='name' min='10' max='40' value = {formData.name} required />
            <textarea onChange={handleOnChange} type='text' className='p-3 border rounded-lg' placeholder='Description' id='description' value={formData.description}  required  />
            <input onChange={handleOnChange} type='text' className='p-3 border rounded-lg' placeholder='Address' id='address' value={formData.address} required />

        </div>
        <div className='p-3 flex flex-wrap gap-6'>
            <div className='flex gap-2'>
                <input onChange={handleOnChange} type='checkbox' id='sale' className='w-5' checked={formData.type =='sale'}  />
                <span>Sell</span>
            </div>
            <div className='flex gap-2' >
                <input onChange={handleOnChange} type='checkbox' id='rent' className='w-5' checked= {formData.type == 'rent'}  />
                <span>Rent</span>
            </div>
            <div className='flex gap-2' >
                <input onChange={handleOnChange} type='checkbox' id='parking' className='w-5' checked = {formData.parking} />
                <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
                <input onChange={handleOnChange} type='checkbox' id='furnished' className='w-5' checked = {formData.furnished}  />
                <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
                <input onChange={handleOnChange} type='checkbox' id='offer' className='w-5' checked = {formData.offer}  />
                <span>offer</span>
            </div>
        </div>
        <div className='flex flex-wrap gap-6 p-3'>
            <div className='flex gap-2  items-center'>
                <input onChange={handleOnChange}  min='1'max='10' className= 'border border-gray-500 rounded-lg p-3 ' id='beds' type='Number' value={formData.bedrooms} />
                <span>Beds</span>
            </div>
            <div className='flex gap-2 items-center '>
                <input onChange={handleOnChange} min='1'max='10' className='border border-gray-500 rounded-lg p-3 ' id='baths' type='Number' value={formData.bathrooms} />
                <span>Baths</span>
            </div>
            <div className='flex flex-col gap-8'>
            <div className='flex gap-4'  >
                <input onChange={handleOnChange} type="number" min='1'max='10000' className='border border-gray-400 rounded-lg p-3 ' id='regularPrice' value={formData.regularPrice} />
                <div className='flex flex-col items-center '>
                    <span>Regular price</span>
                    <span className='text-sm text-slate-600'>($ /month)</span>
                </div>
            </div>
            {
                formData.offer && (
                    <div className='flex gap-4'  >
                    <input onChange={handleOnChange} type="number" min='1'max='10000' className='border border-gray-400 rounded-lg p-3' id='discountPrice' value={formData.discountPrice}  />
                    <div className='flex flex-col items-center '>
                        <span>Discount price</span>
                        <span className='text-sm text-slate-600'>($ /month)</span>
                    </div>
                </div>
                )
            }
           
            </div>
        </div>
        </div>
        <div className='flex flex-col items-center gap-2 '>
            <div className='flex gap-3 '>
                <span className='font-semibold '>images:</span>
                <p className='text-slate-500'>The first iamge will be the cover (max 6)</p>
            </div>
            <div className='flex gap-2'>
                <input onChange={(e)=>setFiles(e.target.files)} type="file"  className='border border-slate-400 p-4 rounded-lg w-full' />
                <button onClick={handleUploadImage} className='border border-green-600 rounded-lg bg-white p-4 uppercase text-green-600'>
                    {
                        uploading ? "Uploading..." : 'Upload'
                    }
                </button>
            </div>
            {
                formData.imageURL.length > 0 && formData.imageURL.map((url , index)=>(
                    <div key={url} className='flex justify-between w-full items-center'>
                        <img src={url} className='w-20 h-20 object-cover rounded-lg ' />
                        <button onClick={()=>handleRemoveImage(index)} className='p-2 text-white text-sm bg-red-600 border rounded-lg hover:opacity-95 '>Delete</button>
                    </div>
                ))
            }
            <button  className='bg-slate-800 m-3 text-white p-3 w-full border rounded-lg hover:opacity-95 disabled:opacity-85'>Create listing</button>
        </div>
        </form>
        

    </main>
  )
}
// what is promise in js?

// promise is object that will produce a single value sometime in the future .
// if promise is successfull then it will produce resolved value 
// if promise is failed or unsuccess full by anyreason then it will produce rejected value which tell the failed reason..