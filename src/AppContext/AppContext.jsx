import React, { createContext, useState, useEffect, useContext } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth, firestore, onAuthStateChanged } from "../firebase/firebase";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fetchSignInMethodsForEmail } from "firebase/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AppContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginWithEmailAndPassword = async (email, password, navigate) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("email", "==", email)));
      const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("email", "==", email)));

      if (!employeeQuerySnapshot.empty) {
        const userData = employeeQuerySnapshot.docs[0].data();
        const role = userData.role;

        if (role === 'employee') {
          navigate('/insightzone');
        } else {
          throw new Error("Invalid role specified");
        }
      } else if (!companyQuerySnapshot.empty) {
        const userData = companyQuerySnapshot.docs[0].data();
        const role = userData.role;

        if (role === 'company') {
          navigate('/dashboard');
        } else {
          throw new Error("Invalid role specified");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.message || "Error logging in. Please try again.");
    }
  };

  const registerWithEmailAndPassword = async (fullName, email, role, password) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods && signInMethods.length > 0) {
        throw new Error("Email is already in use. Please use a different email address.");
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const usersCollectionRef = collection(firestore, "users");
      await addDoc(usersCollectionRef, {
        uid: user.uid,
        fullName,
        email: user.email,
        role,
      });

      const profileData = {
        uid: user.uid,
        fullName,
        email: user.email,
        role,
      };

      if (role === 'employee') {
        profileData.profilePicture = '';
        profileData.bio = '';
        profileData.jobTitle = '';
        profileData.industry = '';
        profileData.companyName = '';
        profileData.recommend = 0;
        profileData.Unrecommend = 0;

        await addDoc(collection(firestore, 'employeesprofile'), profileData);
      } else if (role === 'company') {
        profileData.profilePicture = '';
        profileData.companyName = profileData.fullName;
        profileData.address = '';
        profileData.phoneNumber = '';
        profileData.website = '';
        profileData.industry = '';
        profileData.globalRating = 0;
        profileData.recommended = 0;
        profileData.unrecommended = 0;
        profileData.companySize = '';
        profileData.description = '';

        await addDoc(collection(firestore, 'companiesprofile'), profileData);
      }
      navigate('/signin');
    } catch (err) {
      console.error("Error registering user:", err);
      setError(err.message || "Error registering user. Please try again.");
    }
  };

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("email", "==", user.email)));
        const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("email", "==", user.email)));

        if (!employeeQuerySnapshot.empty) {
          const userData = employeeQuerySnapshot.docs[0].data();
          setUserData(userData);
        } else if (!companyQuerySnapshot.empty) {
          const companyData = companyQuerySnapshot.docs[0].data();
          setCompanyData(companyData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    user,
    userData,
    companyData,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    signOutUser,
    sendPasswordToUser,
  };

  return (
   
<div>
      <AuthContext.Provider value={contextValue}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>{error ? <div>Error: {error}</div> : children}</>
        )}
      </AuthContext.Provider>
    </div>
  );
};

export default AppContext;
