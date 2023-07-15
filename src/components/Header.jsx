import React from 'react'
import { useLocation , useNavigate } from 'react-router'
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  function pathLocation (path){
    if(path === location.pathname){
      return true;
    }
  }
  return (
    <div className='border-b shadow-sm sticky top-0 z-50 bg-white'>
      <header className='flex justify-between px-5 max-w-6xl mx-auto items-center'>
        <div>
          <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" className='h-5 cursor-pointer' alt="" />
        </div>
        <ul className='flex space-x-10'>
          <li onClick={()=>{navigate("/")}} className={`py-3 text-sm border-b-[3px] border-b-transparent font-semibold text-gray-400 cursor-pointer ${pathLocation("/") && "text-black border-b-red-700"}`}>Home</li>
          <li onClick={()=>{navigate("/offers")}} className={`py-3 text-sm border-b-[3px] border-b-transparent font-semibold text-gray-400 cursor-pointer ${pathLocation("/offers") && "text-black border-b-red-700"}`}>Offers</li>
          <li onClick={()=>{navigate("/sign-in")}} className={`py-3 text-sm border-b-[3px] border-b-transparent font-semibold text-gray-400 cursor-pointer ${pathLocation("/sign-in") && "text-black border-b-red-700"}`}>Sign In</li>
        </ul>
      </header>
    </div>
  )
}
