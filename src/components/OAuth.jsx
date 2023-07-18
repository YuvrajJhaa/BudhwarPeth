import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { db } from '../firebase';
import { useNavigate } from 'react-router';

export default function OAuth() {
  const navigate = useNavigate();
  
    async function onGoogleClick(){
      try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      const docRef = doc(db ,"users",user.uid);
      const docSnap = await getDoc(docRef)

      if(!docSnap.exists()){
        await setDoc(docRef ,{

        name : user.displayName,
        email : user.email,
        timestamp : serverTimestamp()
      }

      )};
      navigate("/")
    }
    catch (error) {
      console.log(error);
    }
  } 
  
  

  return (
    <button onClick={onGoogleClick} type='button' className='flex w-full shadow-sm hover:shadow-xl hover:bg-red-600  active:bg-red-700 transiton duration-300 ease-in-out text-white uppercase items-center justify-center rounded-sm  bg-red-500 py-3 px-3 my-2'>
        <FcGoogle className='mr-3 bg-white rounded-full text-2xl'/>
        Continue with google
    </button>  
  );
}
