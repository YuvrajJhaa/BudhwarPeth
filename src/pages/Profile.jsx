import React,  {useState} from 'react'
import '../App.css' 
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import {FcHome} from "react-icons/fc"
import { Link } from 'react-router-dom'


export default function Profile() {
    const [formData, setFormData] = useState({
        name: "Yuvraj Jha",
        email : "yuvraj.jha2001@gmail.com"
    });
    const navigate  = useNavigate();
    const {name, email} = formData;
    function onClick(){
        const auth = getAuth();
        auth.signOut()
        navigate("/")
    }
  return (
    <>
    <section className='max-w-6xl Poppins  mx-auto justify-center flex items-center flex-col px-3'>
        <h1 className='text-center text-xl font-bold mt-3'>My Profile</h1>
        <div className=' w-full md:w-[50%] px-3 py-2 mt-6' >
            <form>
                {/* name Input */}
                <input type="text" id='name'  value={name} disabled  className='w-full px-4 border-gray-400 transition duration-200 ease-in-out py-2 mt-6 bg-white text-xl '   />

                {/* Email input */}
                <input type="text" id='email'  value={email} disabled  className='  w-full px-4 border-gray-400 transition duration-200 ease-in-out py-2 mt-6 bg-white text-xl '   />

                <div className='mb-3 flex justify-between mt-6 font-semibold text-sm sm:text-lg'>
                    <p className='flex item-center whitespaces-pre-wrap mr-4    '>Do you want to change your name ? 
                        <span className='ml-1 text-red-500 cursor-pointer hover:text-red-600 transition duration-200 ease-in-out '>Edit</span>
                    </p>
                    <p onClick={onClick} className='text-blue-500 hover:text-blue-600 cursor-pointer transition duration-200 ease-in-out pl-2 '>Sign Out</p>
                </div>
           </form>
           <button
            type="submit"
            className="w-full my-4 bg-red-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-red-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
    </section>
    </>
  )
}
