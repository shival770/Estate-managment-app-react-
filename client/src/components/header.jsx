import React, { useEffect , useState } from 'react';
import {FaSearch} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link , useNavigate } from 'react-router-dom';

export default function Header() {


  const [searchTerm , setSearchTerm] = useState('');
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  
  const handleOnSubmit = async  (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('searchTerm' , searchTerm);
      const searchTermQuery = urlParams.toString();
      navigate(`/search?${searchTermQuery}`);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  } , [window.location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
       <div className='flex items-center justify-between max-w-6xl mx-auto p-3'>
        <Link to={'/'} >
       <h1 className='text-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Shival</span>
            <span className='text-slate-700'>Estate</span>
       </h1>
       </Link> 
       <form  onSubmit={handleOnSubmit} className='flex items-center bg-slate-100 rounded-lg w-24 sm:w-64 p-3'>
        <input className='bg-transparent focus:outline-none  w-24 sm:w-64' placeholder='Search...' id='search' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}  />
         <button>
           <FaSearch />
         </button>
       </form>
       <ul className='flex gap-4 text-slate-700'>
        <Link to={'/'}><li className='hover:underline hidden sm:inline'>Home</li></Link>
        <Link to={'/about'}><li className='hover:underline hidden sm:inline'>About</li></Link>
        <Link to={'/profile'}>
        {
          currentUser ? (
            <img src={currentUser.avator} alt="profile" className='h-8 rounded-full' />
          ) : <li className='hover:underline'>Sign in</li>
        }
        </Link>

       </ul>
       </div>
    </header>
  )
}
