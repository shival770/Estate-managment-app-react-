import { useState } from 'react';
import { Link  , useNavigate } from 'react-router-dom';
import OAuth from '../components/oauth.jsx';


export default function SignUp() {
  const [formData , setFormData] = useState({});
  const [loading , setLoading] = useState(false);
  const [error , setError] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = (event)=>{
       setFormData({
        ...formData , [event.target.id] : event.target.value
       })
  }

  const handleOnSubmit = async (e) => {
          e.preventDefault();
          try {
            setLoading(true);
            const res = await fetch("/api/auth/sign-up" , {
              method : "POST",
              headers : {
                "Content-Type" : "application/json"
              },
              body :  JSON.stringify(formData)

            });
            const data = await res.json();
            console.log(data);
            if(data === false) {
              setLoading(false);
              setError(data.message);
            }
            setLoading(false);
            setError(null);
            navigate("/sign-in");
          } catch (error) {
            setLoading(false);
            setError(error);
          }
  }




  return (
    <div className='max-w-lg mx-auto p-3 flex flex-col gap-2' >
      <h1 className='text-slate-800 text-3xl font-semibold text-center my-7'>Sign Up</h1>
      <form  onSubmit={handleOnSubmit} className='flex flex-col gap-6'>
        <input className='p-3 border rounded-lg' placeholder='username' type='text' id="username" onChange={handleOnChange} />
        <input className='p-3 border rounded-lg' placeholder='email' type='text' id="email" onChange={handleOnChange} />
        <input className='p-3 border rounded-lg' placeholder='password' type='password' id="password" onChange={handleOnChange} />
        <button className='w-full uppercase p-3 bg-slate-700 rounded-lg text-white hover:opacity-95 disabled:opacity-85  '>
        {loading ? "Loading..." : "Sign Up"}
        </button>
        

      </form>
      <OAuth />
      <div className='flex gap-2 my-3' >
        <p className='text-slate-600'>already have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-900'>sign In</span>

        </Link>
      </div>
      {error && <p className='text-red-700 '>{error}</p>}
    </div>
  )
}


