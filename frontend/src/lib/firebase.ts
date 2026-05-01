import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc as firestoreDoc, 
  setDoc as firestoreSetDoc, 
  updateDoc as firestoreUpdateDoc,
  addDoc as firestoreAddDoc,
  getDoc as firestoreGetDoc,
  getDocs as firestoreGetDocs,
  collection as firestoreCollection,
  query as firestoreQuery,
  where as firestoreWhere,
  orderBy as firestoreOrderBy,
  onSnapshot as firestoreOnSnapshot,
  deleteDoc as firestoreDeleteDoc,
  serverTimestamp as firestoreServerTimestamp,
  Timestamp
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA1OB9Umxfrl3AKpiFoOagYx2Y6F0nPbS8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "biovita2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "biovita2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "biovita2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "181424595866",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:181424595866:web:eb08d9fcbdf7bf386b1023"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Re-exporting types and functions to match the previous mock interface
export type User = FirebaseUser;

export const onAuthStateChanged = firebaseOnAuthStateChanged;
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
export const createUserWithEmailAndPassword = firebaseCreateUserWithEmailAndPassword;
export const signOut = () => firebaseSignOut(auth);
export const updateProfile = firebaseUpdateProfile;

// Firestore exports
export const doc = firestoreDoc;
export const collection = firestoreCollection;
export const query = firestoreQuery;
export const where = firestoreWhere;
export const orderBy = firestoreOrderBy;
export const setDoc = firestoreSetDoc;
export const updateDoc = firestoreUpdateDoc;
export const addDoc = firestoreAddDoc;
export const getDoc = firestoreGetDoc;
export const getDocs = firestoreGetDocs;
export const deleteDoc = firestoreDeleteDoc;
export const onSnapshot = firestoreOnSnapshot;
export const serverTimestamp = firestoreServerTimestamp;
export { Timestamp };

// Compatibility alias
export const getDocFromServer = firestoreGetDoc;
