import React from 'react'
import { GoogleAuthProvider , getAuth , signInWithPopup} from 'firebase/auth';
import { signInStart , signInFailure , signInSuccess } from '../redux/user/userSlice.js';
import { useDispatch , useSelector } from 'react-redux';
import { app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnClick = async ()=>{

        try {
            console.log("hi")
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth , provider);


            const res = await fetch('/api/auth/google' , {
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({name : result.user.displayName , email : result.user.email , photo : result.user.photoURL})
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/')

        } catch (error) {
        console.log("could not sign in with google.", error);
           
        }

    }
   




  return (
    <button onClick={handleOnClick} className='uppercae w-full border bg-red-600 text-white p-3 hover:opacity-95 disabled:opacity-85 rounded-lg'>Continue with Google</button>
  )
}
