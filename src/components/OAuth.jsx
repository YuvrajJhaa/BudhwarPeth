import React from 'react'
import {FcGoogle} from 'react-icons/fc'

export default function OAuth() {
  return (
    <button className='flex w-full shadow-sm hover:shadow-xl hover:bg-red-600  active:bg-red-700 transiton duration-300 ease-in-out text-white uppercase items-center justify-center rounded-sm  bg-red-500 py-3 px-3 my-2'>
        <FcGoogle className='mr-3 bg-white rounded-full text-2xl'/>
        Continue with google
    </button>  
  );
}
