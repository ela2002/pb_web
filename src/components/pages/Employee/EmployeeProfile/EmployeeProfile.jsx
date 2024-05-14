import React, { useState, useEffect } from "react";
import Navbar from "../../../Employee/Navbar/Navbar";
import ProfileHeader from "../../../Employee/EmployeeProfile/ProfileHeader";
import NavigationBar from "../../../Employee/EmployeeProfile/NavigationBar";
import ContentArea from "../../../Employee/EmployeeProfile/ContentArea";
import EditProfileCard from "../../../Employee/EmployeeProfile/EditProfileCard";
import styles from "./EmployeeProfile.module.css";
import { firestore, auth } from '../../../../firebase/firebase';
import ClipLoader from "react-spinners/ClipLoader";
import { getDocs, query, collection, where } from "firebase/firestore"; // Updated imports for Firestore functions

const EmployeeProfile = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("details");
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("uid", "==", user.uid)));
          if (!employeeQuerySnapshot.empty) {
            // Since we are fetching the data of the currently logged-in user,
            // we can directly access the first document in the snapshot
            const employeeDoc = employeeQuerySnapshot.docs[0];
            setEmployeeData({ ...employeeDoc.data(), id: employeeDoc.id });
          } else {
            console.error("Employee data not found for UID:", user.uid);
            setEmployeeData(null); // Set employeeData to null if no documents are found
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      } else {
        setEmployeeData(null);
        setLoading(false); // Set loading to false if user is not authenticated
        console.log("User not authenticated");
      }
    });

    // Unsubscribe from the auth state listener when component unmounts
    return () => {
      authStateChanged();
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
      const employeeDocRef = collection(firestore, "employeesprofile").doc(employeeData.id);
      await employeeDocRef.update(formData);
      setEmployeeData(formData); // Update employeeData with the new data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {loading ? (
          // Render loading spinner if loading state is true
          <div className={styles.loading}>
            <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
          </div>
        ) : (
          <>
            <ProfileHeader
              onEditProfileClick={handleEditProfileClick}
              employeeData={employeeData}
            />
            <NavigationBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <ContentArea selectedTab={selectedTab} employeeData={employeeData} />

            {isEditProfileVisible && (
              <EditProfileCard
                isVisible={isEditProfileVisible}
                onClose={handleCloseEditProfile}
                employeeData={employeeData}
                onSave={handleSaveProfile}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EmployeeProfile;
