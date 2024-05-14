import React, { createContext, useState, useEffect, useContext } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth, firestore, onAuthStateChanged } from "../firebase/firebase";
import { addDoc, getDocs, collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";


export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AppContext = ({ children }) => {

  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null); 


  const loginWithEmailAndPassword = async (email, password, navigate) => {
    try {
        // Authenticate the user using email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Retrieve user data from Firestore based on the provided email
        const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("email", "==", email)));
        const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("email", "==", email)));

        if (!employeeQuerySnapshot.empty) {
            // User found in the employees collection
            const userData = employeeQuerySnapshot.docs[0].data();
            const role = userData.role;

            if (role === 'employee') {
                // Navigate to employee dashboard or profile page
                navigate('/insightzone');
            } else {
                // Invalid role
                throw new Error("Invalid role specified");
            }
        } else if (!companyQuerySnapshot.empty) {
            // User found in the companies collection
            const userData = companyQuerySnapshot.docs[0].data();
            const role = userData.role;

            if (role === 'company') {
                // Navigate to company dashboard or profile page
                navigate('/dashboard');
            } else {
                // Invalid role
                throw new Error("Invalid role specified");
            }
        } else {
            // User not found in either collection
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert(error.message || "Error logging in. Please try again.");
    }
};




//registerrr 

const registerWithEmailAndPassword = async (fullName, email, role, password) => {
  try {
      // Check if the email is already in use
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods && signInMethods.length > 0) {
          // Email is already in use
          throw new Error("Email is already in use. Please use a different email address.");
      }

      // Email is not in use, proceed with registration
      console.log("Attempting to register user:", fullName, email, role);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      console.log("User created successfully:", user.uid);

      // Add user to the common "users" collection
      const usersCollectionRef = collection(firestore, "users");
      await addDoc(usersCollectionRef, {
          uid: user.uid,
          fullName,
          email: user.email,
          role,
      });

      // Create profile details for the user
      const profileData = {
          uid: user.uid,
          fullName,
          email: user.email,
          role,
      };

      if (role === 'employee') {
          // Employee profile details
          profileData.profilePicture = ''; // Add profile picture
          profileData.bio = ''; // Add bio
          profileData.jobTitle = ''; // Add job title
          profileData.industry = '';
          profileData.companyName = ''; // Add company name
          profileData.recommend = 0; 
          profileData.Unrecommend = 0; 

          // Add employee profile to "employeesprofile" collection
          await addDoc(collection(firestore, 'employeesprofile'), profileData);
      } else if (role === 'company') {
          // Company profile details
          profileData.profilePicture = ''; // Add profile picture
          profileData.companyName = profileData.fullName; // Add company name
          profileData.address = ''; // Add address
          profileData.phoneNumber = ''; // Add phone number
          profileData.website = ''; // Add website
          profileData.industry = ''; // Add industry
          profileData.globalRating = 0;
          profileData.recommended = 0;
          profileData.unrecommended = 0;
          profileData.companySize = ''; // Add company size
          profileData.description = ''; // Add description

          // Add company profile to "companiesprofile" collection
          const companyDocRef = await addDoc(collection(firestore, 'companiesprofile'), profileData);

         
      }

      // Log in the user after registration
     

      console.log("User data and profile details added to Firestore successfully, user logged in");
  } catch (err) {
      console.error("Error registering user:", err);
      alert(err.message || "Error registering user. Please try again.");
  }
};


//end registerr


  const sendPasswordToUser = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("New password sent to your email");
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  
  };

  const userStateChanged = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("email", "==", user.email)));
        const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("email", "==", user.email)));
  
        if (!employeeQuerySnapshot.empty) {
          // User found in the employees collection
          setUserData(employeeQuerySnapshot.docs[0].data());
          setUser(user);
        } else if (!companyQuerySnapshot.empty) {
          // User found in the companies collection
          setCompanyData(companyQuerySnapshot.docs[0].data());
          setUser(user);
        } else {
          // User not found in either collection
          setUser(null);
          navigate("/signin");
        }
      } else {
        setUser(null);
        navigate("/signin");
      }
    });
  };
  
  useEffect(() => {
    userStateChanged();
  }, []);
  
  useEffect(() => {
    if (user && (userData || companyData)) {
      if (userData) {
        navigate("/insightzone");
      } else if (companyData) {
        navigate("/dashboard");
      }
    } else {
      navigate("/signin");
    }
  }, [user, userData, companyData]);
  

  const initialState = () => ({
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordToUser,
    signOutUser,
    user,
    userData,
  });

  return (
    <div>
      <AuthContext.Provider value={initialState()}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AppContext;