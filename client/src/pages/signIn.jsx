import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { signInFailure, signInStart , signInSuccess } from '../redux/user/userSlice.js';
import OAuth from '../components/oauth.jsx';
export default function SignIn() {

   const [formData , setFormData] = useState({});
   const {loading ,  error } = useSelector((state) => state.user);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleOnChange = (e) => {
       setFormData({
        ...formData , [e.target.id] : e.target.value
       })
   }

   const handleOnSubmit = async (e) => {
       e.preventDefault();
       try {

        dispatch(signInStart());
        const res = await fetch("/api/auth/sign-in" , {
          method : "POST" , 
          headers : {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify(formData)
        });
        console.log(res);
        const data = await res.json();

        if ( data.success === false){
           dispatch(signInFailure(data.message));
          return 
        }
         dispatch(signInSuccess(data));
        navigate('/');
       } catch (error) {
          dispatch(signInFailure(error.message));
       }
   }


  return (
    <div className='max-w-lg mx-auto p-3 flex flex-col gap-2' >
      <h1 className='text-slate-800 text-3xl font-semibold text-center my-7'>Sign In</h1>
      <form  onSubmit={handleOnSubmit} className='flex flex-col gap-6'>
        <input onChange={handleOnChange} className='p-3 border rounded-lg' placeholder='email' type='text' id="email" />
        <input onChange={handleOnChange} className='p-3 border rounded-lg' placeholder='password' type='password' id="password" />
        <button  className='w-full uppercase p-3 bg-slate-700 rounded-lg text-white hover:opacity-95 disabled:opacity-85  '>
        {loading ? "Loading..." : "Sign In"}
        </button>

      </form>
      <OAuth />

      <div className='flex gap-2 my-3' >
        <p className='text-slate-600'>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-900'>sign up</span>

        </Link>
      </div>
      {
        error && <p className='text-red-slate'>{error}</p>
      }
    </div>
  )
}
