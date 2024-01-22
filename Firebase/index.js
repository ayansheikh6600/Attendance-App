import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";




const firebaseConfig = {
    apiKey: "AIzaSyB9qIuQhJM9T9b6qcnaLTUTRU5kAuuG2nw",
    authDomain: "hackathone-34448.firebaseapp.com",
    projectId: "hackathone-34448",
    storageBucket: "hackathone-34448.appspot.com",
    messagingSenderId: "1087616256564",
    appId: "1:1087616256564:web:7bcd9dec8f87b1cbf55861"
  };


const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage();

export {
  app,
  
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  doc,
  setDoc,
  storage,
  ref, uploadBytesResumable, getDownloadURL,getDoc
};