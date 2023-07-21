import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {getAuth, onAuthStateChanged} from "firebase/auth"
export default function Header() {
  const location = useLocation();
  const [pageState, setPageState] = useState("Sign In");
  const navigate = useNavigate();
  function pathLocation(path) {
    if (path === location.pathname) {
      return true;
    }
  }
  const auth = getAuth();
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        setPageState("Profile")
      } else {
        setPageState("Sign In")
      }
    },[auth])
  });
  
  return (
    <div className='border-b shadow-sm sticky top-0 z-50 Poppins bg-white'>
      <header className='flex justify-between px-5 max-w-6xl mx-auto items-center'>
        <div>
          <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" className='h-5 cursor-pointer ' onClick={() => {navigate("/")}} alt="realtor*" />
        </div>
        <ul className='flex space-x-10'>
          <li onClick={() => { navigate("/") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathLocation("/") && "border-b-red-400 text-red-400"} `} >Home</li>
          <li onClick={() => { navigate("/offers") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathLocation("/offers") && " border-b-red-400 text-red-500"}`}>Offers</li>
          <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathLocation("/sign-in") || pathLocation("/profile")) && " border-b-red-400 text-red-500"}`} onClick={()=>navigate("/profile")}>
            {pageState}</li>
        </ul>
      </header>
    </div>
  )
}