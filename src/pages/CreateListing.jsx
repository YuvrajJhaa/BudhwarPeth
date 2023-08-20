import React, { useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router';

export default  function CreateListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geoLocationEnabled, setGeoLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type : "rent",
    name : "",
    bathrooms : "1",
    bedrooms : "1",
    parking : false,
    furnished : false,
    address : "",
    description : "",
    offer : false,
    regularPrice: 0,
    discountedPrice: 0,
    longitude : 0,
    latitude : 0,
    images: {}
  });
  const {type, name, bathrooms, bedrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, longitude,latitude,images} = formData;
  let boolean = null;
  function onChange(e){
    if(e.target.value === "true"){
      boolean = true;
    }
    if(e.target.value === "false"){
      boolean = false;
    }
    //Files
    if(e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        images : e.target.files
      }))
    }
    //Number/Boolean/Text
    if(!e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }
  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    if(+discountedPrice >= +regularPrice){
      setLoading(false);
      toast.error("Discounted Price must be less than Regular Price");
    }
    if(images.length > 6){
      setLoading(false);

      toast.error("Maximum allowed image upload length is 6 only"); 
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }


    const imgUrls = await Promise.all(
      [...images].map((images)=>storeImage(images))).catch((error)=>{
        setLoading(false);
        toast.error("Images not Uploaded");
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp()
    }
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formData.type}/${docRef.id}`)
    
  }

  if(loading){
    return <Spinner />
  }
  
  

  return (
    <main className='max-w-md px-2 mx-auto Poppins'>
      <h1 className='text-center text-2xl font-bold mt-8'>Create Listing</h1>
      <form onSubmit={onSubmit}>
        <p className='px-3 py-4 mt-3 text-lg font-semibold'>Sell/Rent</p>
        <div className='flex space-x-3'>
          <button id='type' value="sell" onClick={onChange} type='button' className={`px-7 py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${type=== 'rent' ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            Sell
          </button>
          <button id='type' value="rent" onClick={onChange} type='button' className={`px-7 py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${type=== 'sell' ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            Rent
          </button>
        </div>
        <p className='px-3 py-2 mt-6 text-lg font-semibold '>Name</p>
        <input type="text"
          id='name'
          value={name}
          onChange={onChange}
          required
          minLength={3} 
          maxLength={50}
          className='w-full px-5 py-2 text-lg transition duration-150 ease-in-out focus:bg-white
          border border-gray-400 focus:border-gray-800 '
          placeholder='Name'
        />
        <div className='mt-9  flex'>
          <div className='w-full'>
            <p className='px-3 py-3 font-semibold text-lg'>Beds</p>
            <input type="number"
              id='bedrooms'
              value={bedrooms}
              onChange={onChange}
              min={1}
              max={50}
              className='text-center'
            />
          </div>
          <div className='w-full'>
            <p className='px-3 py-3 font-semibold text-lg'>Baths</p>
            <input type="number"
              id='bathrooms'
              value={bathrooms}
              onChange={onChange}
              min={1}
              max={50}
              className='text-center'
            />
          </div>
        </div>
        <p className='px-3 py-4 mt-4 text-lg font-semibold'>Parking spot</p>
        <div className='flex space-x-3'>
          <button id='parking' onClick={onChange} value={true}  type='button' className={`px-7 uppercase py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${!parking ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            Yes
          </button>
          <button id='parking' onClick={onChange} value={false} type='button' className={`px-7 uppercase py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${parking ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            no
          </button>
        </div>
        <p className='px-3 py-4 mt-4 text-lg font-semibold'>Furnished</p>
        <div className='flex space-x-3'>
          <button id='furnished' onClick={onChange} value={true} type='button' className={`px-7 uppercase py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${!furnished ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            yes
          </button>
          <button id='furnished' onClick={onChange} value={false} type='button' className={`px-7 uppercase py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${furnished ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            no
          </button>
        </div>
        <p className='px-3 py-2 mt-6 text-lg font-semibold '>Address</p>
        <textarea type="text"
          id='address'
          value={address}
          onChange={onChange}
          required
          className='w-full px-5 py-2 text-lg transition duration-150 ease-in-out focus:bg-white
          border border-gray-400 focus:border-gray-800 '
          placeholder='Address'
        />
        {!geoLocationEnabled && (
        <div className='flex mt-6'>
          <div className='w-full '>
            <p className='text-lg font-semibold px-3 pb-2'>Longitude</p>
            <input type="number"
              onChange={onChange}
              required
              min= "-90"
              max= "90"
              value={longitude}
              id='longitude'
              className='text-center'
            />
          </div>
          <div className='w-full'>
            <p className='text-lg font-semibold px-3 pb-2'>Latitude</p>
            <input type="number"
              onChange={onChange}
              required
              min= "-180"
              max= "180"
              value={latitude}
              id='latitude'
              className='text-center'
            />

          </div>
        </div>
        )}

        <p className='px-3 py-2 mt-6 text-lg font-semibold '>Description</p>
        <textarea type="text"
          id='description'
          value={description}
          onChange={onChange}
          required
          className='w-full px-5 py-2 text-lg transition duration-150 ease-in-out focus:bg-white
          border border-gray-400 focus:border-gray-800 '
          placeholder='Description'
        />
        <p className='px-3 py-4 mt-4 text-lg font-semibold'>Offer</p>
        <div className='flex space-x-3'>
          <button id='offer' onClick={onChange} value={true} type='button' className={`px-7 uppercase py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${!offer ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            yes
          </button>
          <button id='offer' onClick={onChange} value={false} type='button' className={`px-7 uppercase py-3 w-full rounded-sm shadow-lg hover:shadow-xl text-md active:shadow-2xl transition-transform hover:scale-90 duration-200 
          ease-in-out ${offer ? "bg-gray-200 text-black ": "bg-red-600 text-white"} `}>
            no
          </button>
        </div>
        <div className="flex items-center mt-6 mb-6 ">
          <div className="">
            <p className="text-lg font-semibold px-3">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg px-3 font-semibold">Images</p>
          <p className="text-gray-600 px-3">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-red-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>        
    </main>
  )
}
