import React from 'react'
import { useLocation, useNavigate } from 'react-router'
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  function pathLocation(path) {
    if (path === location.pathname) {
      return true;
    }
  }
  return (
    <div className='border-b shadow-sm sticky top-0 z-50 bg-white'>
      <header className='flex justify-between px-5 max-w-6xl mx-auto items-center'>
        <div>
          <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" className='h-5 cursor-pointer ' onClick={() => {navigate("/")}} alt="realtor*" />
        </div>
        <ul className='flex space-x-10'>
          <li onClick={() => { navigate("/") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathLocation("/") && "border-b-red-500 text-red-400"} `} >Home</li>
          <li onClick={() => { navigate("/offers") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathLocation("/offers") && " border-b-red-400 text-red-500"}`}>Offers</li>
          <li onClick={() => { navigate("/sign-in") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathLocation("/sign-in") && " border-b-red-400 text-red-500"}`}>Sign In</li>
        </ul>
      </header>
    </div>
  )
}