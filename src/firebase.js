// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTx6mZDtp-Wc4p-dmgqMRXlS1qglvpIhU",
  authDomain: "realtor-clone-react-e8522.firebaseapp.com",
  projectId: "realtor-clone-react-e8522",
  storageBucket: "realtor-clone-react-e8522.appspot.com",
  messagingSenderId: "51666962162",
  appId: "1:51666962162:web:bb05de54c9c688bc57b26b"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();