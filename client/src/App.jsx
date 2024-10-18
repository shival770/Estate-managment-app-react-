import React from 'react'
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import Home from './pages/home.jsx';
import SignIn  from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';
import About from './pages/about.jsx';
import Profile from './pages/profile.jsx';
import Header from './components/header.jsx';
import PrivateRoute from './components/privateRoute.jsx';
import CreateListing from './pages/createListing.jsx';
import Listing from './pages/listing.jsx';
import UpdateListing from './pages/updateListing.jsx';
import Search from './pages/search.jsx'
export default function App() {
  return (
      <div>
        <BrowserRouter>
            <Header/>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/About' element={<About />} />
              <Route path='/listing/:id' element={<Listing />} />
              <Route path='/search' element={<Search />} />


              
              <Route element={<PrivateRoute />}>
            
              <Route path='/profile' element={<Profile />} />
              <Route path='/create-listing' element={<CreateListing />} />
              <Route path='/update-listing/:id' element={<UpdateListing />} />
               
              </Route>
            </Routes>
        </BrowserRouter>
      </div>
  )
}
