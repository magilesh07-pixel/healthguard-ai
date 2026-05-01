import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Your real Firebase configuration from the screenshot
const firebaseConfig = {
  apiKey: "AIzaSyCbLVfpavp36hK-WHdEher3WxNl6PCJmHw",
  authDomain: "healthguard-ai-cb4da.firebaseapp.com",
  projectId: "healthguard-ai-cb4da",
  storageBucket: "healthguard-ai-cb4da.firebasestorage.app",
  messagingSenderId: "561146575197",
  appId: "1:561146575197:web:34726bb31e12d3456c10b4",
  measurementId: "G-1L5S9CZ4MD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  onAuthStateChanged
};
