  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { getStorage } from "firebase/storage";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { getDatabase } from "firebase/database";
  
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyC2HG_95fMYnundhgobAu6t_dXbuvkEB4I",
    authDomain: "powerback-f195f.firebaseapp.com",
    projectId: "powerback-f195f",
    storageBucket: "powerback-f195f.appspot.com",
    messagingSenderId: "45556693116",
    appId: "1:45556693116:web:f39801d64c43e97ed771f9",
    measurementId: "G-NVCRJLLT88"
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const database = getDatabase(app);
  
  export { app, auth, firestore, storage, database as db, onAuthStateChanged };


