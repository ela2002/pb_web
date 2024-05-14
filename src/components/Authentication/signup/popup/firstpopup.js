import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../../../firebase/firebase";
import styles from "./popup.module.css";
import ProfileDetails from "./profileDetails";
import CompanyProfile from "./company/companyprofile1";

const FirstPopup = ({ selectedRole, setShowPopup }) => {
  // Add setShowPopup prop
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("User not authenticated");
          return;
        }

        const userId = user.uid;

        const userProfileQuery = query(
          collection(firestore, "users"),
          where("uid", "==", userId)
        );
        const userProfileSnapshot = await getDocs(userProfileQuery);

        if (userProfileSnapshot.empty) {
          console.log("User profile not found");
          return;
        }

        const userProfileData = userProfileSnapshot.docs[0].data();
        const userRole = userProfileData.role;

        if (userRole === "employee") {
          navigate("/profiledetails");
        } else if (userRole === "company") {
          navigate("/companyDetails");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserProfile();
  }, [navigate]);

  const handleContinue = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not authenticated");
        return;
      }

      const userId = user.uid;

      // Get form data
      const formValues = {
        fullName: user.displayName,
        email: user.email,
        role: selectedRole,
        // Add other attributes based on your form fields
      };

      // Create profile with attributes based on form data
      if (selectedRole === "employee") {
        await addDoc(collection(firestore, "employeesprofile"), {
          uid: userId,
          ...formValues,
        });
        navigate("/profiledetails");
      } else if (selectedRole === "company") {
        await addDoc(collection(firestore, "companiesprofile"), {
          uid: userId,
          ...formValues,
        });
        navigate("/companyDetails");
      } else {
        console.log("Invalid role selected:", selectedRole);
      }

      // Update the user's profile with profile completion status
      await updateDoc(doc(firestore, "users", userId), {
        profileCompleted: true,
      });

      setShowPopup(false); // Hide the popup after creating profile
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  const handleSkip = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not authenticated");
        return;
      }

      const userId = user.uid;

      // Create profile with empty attributes
      if (selectedRole === "employee") {
        await addDoc(collection(firestore, "employeesprofile"), {
          uid: userId,
        });
      } else if (selectedRole === "company") {
        await addDoc(collection(firestore, "companiesprofile"), {
          uid: userId,
        });
      } else {
        console.log("Invalid role selected:", selectedRole);
      }

      // Update the user's profile with profile completion status
      await updateDoc(doc(firestore, "users", userId), {
        profileCompleted: false,
      });

      setShowPopup(false); // Hide the popup after creating profile
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  return (
    <div className={styles.backall}>
      <div className={styles.popupBackground}>
        <div className={styles.popupContent}>
          <button
            onClick={handleContinue}
            style={{ marginLeft: "380px", width: "115px" }}
          >
            Continue
          </button>
          <h2>Confirmation</h2>
          <p>Do you want to continue creating your profile?</p>
          <div className={styles.buttons}></div>
          <Link to={"/signin"}>
            <button onClick={handleSkip} style={{ width: "90px" }}>
              Skip
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirstPopup;
