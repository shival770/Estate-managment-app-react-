// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGx5YoQyj_o-wbSACS8uBrAYw8awgoxFQ",
  authDomain: "real-estate-f6d60.firebaseapp.com",
  projectId: "real-estate-f6d60",
  storageBucket: "real-estate-f6d60.appspot.com",
  messagingSenderId: "871847704250",
  appId: "1:871847704250:web:0080e6f53a07ad4bd87483",
  measurementId: "G-36TG2J30CN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
