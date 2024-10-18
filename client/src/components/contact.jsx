import React, { useState , useEffect} from 'react';
import {Link} from "react-router-dom";


export default function Contact ({listing}) {
    const [message , setMessage] = useState('');
    const [landlord , setLandLoard] = useState(null);

    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandLoard(data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser();
    } , [listing.userRef]);
  return (
    <>
        {
            landlord && (
                <div className='flex flex-col gap-3'>
                    <p className='text-slate-600' >Contact <span className='text-slate-900 font-semibold'>{landlord.username}</span>{' '}for{' '}<span className='text-slate-900'>{listing.name.toLowerCase()}</span></p>
                    <textarea name="message" id="message" rows="2" className='rounded-lg w-full p-3' placeholder='Enter message here' value={message} onChange={(e)=>setMessage(e.target.value)}></textarea>
                    <Link className='text-center p-3 w-full bg-green-700 border rounded-lg hover:opacity-95 text-white' to={`mailto:${landlord.email}?Subject=Regarding ${listing.usename}&body=${message}`}>
                        send message
                    </Link>
                    
                </div>
            )
        }
    </>
  )
}
