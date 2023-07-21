import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData , setFormData] = useState({
    name : "",
    email : "",
    password : ""
  });
  const {name,email, password} = formData;
  function onChange (e){
    setFormData(prevItems => ({

      ...prevItems,
      [e.target.id] : e.target.value 
    }
    ))

  };

  async function onSubmit (e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was successful");
      navigate("/");
     } catch (error) {
        {
          toast.error("Something went wrong with the registration");
        }
      }
  }
  
  return (
    <section className='Poppins font-bold'>
      <h1 className='text-center text-4xl py-8 '>Sign Up</h1>
      <div className='flex max-w-[67%] mx-auto items-center space-x-5 flex-wrap '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg" className='w-full' alt="" />
        </div>
      <div className='w-full md:w-[50%] lg:w-[40%] lg:ml-20'>
        <form onSubmit={onSubmit}>
          <input className='w-full py-2 mb-3 rounded-sm px-4 transition ease-in-out' onChange={onChange} id='name' value={name} type="text" placeholder='Full Name ' />
          <input className='w-full py-2 mb-3 rounded-sm px-4 transition ease-in-out' onChange={onChange} id='email' value={email} type="text" placeholder='Email Address ' />
          <div className='relative'>
          <input className='w-full py-2 mb-3 rounded-sm px-4 transition ease-in-out ' onChange={onChange} id='password' value={password} type={showPassword ? "text" : "password"} placeholder='Password' />
          {showPassword ? 
          <BsEyeFill className='absolute right-3 top-3  cursor-pointer' onClick={() => setShowPassword((prev=>(!prev)))}/> :
          <BsEyeSlashFill className='absolute right-3 top-3 cursor-pointer' onClick={() => setShowPassword((prev=>(!prev)))}/>  
          }
          </div>

        <div className='flex lg:mt-3 justify-between text-sm mb-4'>
          <p>Have an account?
          <Link className='ml-1 text-red-500 hover:text-red-700 transition duration-200 ease-in-out' to='/sign-in'>Sign In</Link>
          </p>
          <p>
          <Link className=' text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out' to='/forgot-password'>Forgot Password</Link>
          </p>
        </div>
        <button className='my-3 bg-blue-600 w-full py-2 rounded-sm cursor-pointer text-white text-lg hover:bg-blue-700 shadow-sm transition duration-300 ease-in-out active:bg-blue-800 hover:shadow-lg'>Sign Up</button>
        <div className='flex items-center my-3   before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
          <p className='text-center mx-3'>OR</p>
        </div>
          <OAuth/>
        </form>
          
      </div>
      </div>
    </section>
  )
}
