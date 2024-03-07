// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from '@firebase/firestore'
import {getStorage} from '@firebase/storage'
import { getDatabase } from "firebase/database";
import {getAuth} from '@firebase/auth'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGZClho16tfUsTq6kQf_891xCQxVl0yCk",
  authDomain: "sonder-gamedev.firebaseapp.com",
  databaseURL: "https://sonder-gamedev-default-rtdb.firebaseio.com",
  projectId: "sonder-gamedev",
  storageBucket: "sonder-gamedev.appspot.com",
  messagingSenderId: "844763315610",
  appId: "1:844763315610:web:70a343baefcc91fabc4e23",
  measurementId: "G-FZRS7S99NW"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

export const auth = getAuth(firebaseApp);

export const firestore = getFirestore(firebaseApp)

export const database = getDatabase(firebaseApp);
