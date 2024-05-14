import React, { useState, useEffect } from "react";
import Navbar from "../../../Company/Navbar/Navbar";
import ProfileHeader from "../../../Company/CompanyProfile/ProfileHeader";
import NavigationBar from "../../../Company/CompanyProfile/NavigationBar";
import ContentArea from "../../../Company/CompanyProfile/ContentArea";
import EditProfileCard from "../../../Company/CompanyProfile/EditProfileCard";
import styles from "./CompanyProfile.module.css";
import { firestore, auth } from "../../../../firebase/firebase";
import { getDocs, query, collection, where, doc, updateDoc } from "firebase/firestore"; // Updated imports for Firestore functions
import ClipLoader from "react-spinners/ClipLoader"; // Import the ClipLoader component

const CompanyProfile = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true); // Add loading state for company data

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("uid", "==", user.uid)));
          if (!companyQuerySnapshot.empty) {
            companyQuerySnapshot.forEach((doc) => {
              setCompanyData({ ...doc.data(), id: doc.id }); // Include document ID in companyData
            });
          } else {
            console.error("Company data not found for UID:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        } finally {
          setLoadingCompany(false); // Set loading state to false after fetching company data
        }
      } else {
        setCompanyData(null);
        console.log("User not authenticated");
      }
    });
  
    return () => {
      authStateChanged(); // Call the unsubscribe function
    };
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfileVisible(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileVisible(false);
  };

  const handleSaveProfile = async (formData) => {
    try {
      const companyDocRef = doc(firestore, "companiesprofile", companyData.id);
      await updateDoc(companyDocRef, formData);
      setCompanyData(formData); // Update companyData with the new data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {loadingCompany ? ( // Render loading spinner while loading company data
          <div className={styles.loading}>
            <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
          </div>
        ) : (
          <>
            <ProfileHeader
              onEditProfileClick={handleEditProfileClick}
              companyData={companyData}
            />
            <NavigationBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <ContentArea selectedTab={selectedTab} companyData={companyData} />

            {isEditProfileVisible && (
              <EditProfileCard 
                isVisible={isEditProfileVisible} 
                onClose={handleCloseEditProfile} 
                companyData={companyData} 
                onSave={handleSaveProfile} // Pass onSave function to handle saving profile changes
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CompanyProfile;
