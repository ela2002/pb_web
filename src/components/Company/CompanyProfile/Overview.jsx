import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./Overview.module.css";
import { SlOptionsVertical } from "react-icons/sl";
import EditOverview from "./Editoverview";

const Overview = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Define setError here

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const firestore = getFirestore();
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const companiesProfileCollectionRef = collection(firestore, 'companiesprofile');
            const q = query(companiesProfileCollectionRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const data = querySnapshot.docs[0].data();
              setCompanyData(data);
            } else {
              setError("Company data not found for UID:" + user.uid);
            }
          } else {
            setError("User not authenticated");
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        setError("Error fetching company data: " + error.message);
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const firestore = getFirestore();
      const companyRef = doc(firestore, 'companiesprofile', companyData.uid);
      await updateDoc(companyRef, formData);
      setCompanyData(formData);
      setIsEditing(false);
      console.log("Company data updated successfully");
    } catch (error) {
      console.error("Error updating company data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.editIcon} onClick={handleEditClick}>
        <SlOptionsVertical title="Edit" />
        <span className={styles.editText}>Edit</span>
      </button>
      {isEditing && (
        <div className={styles.overlay}>
          <EditOverview companyData={companyData} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.card}>
          <p className={styles.description}><h6 className={styles.title}>Description: </h6> {companyData.description}</p>
        </div>
        <p className={styles.phone}> <h6 className={styles.title}>Phone Number:</h6> {companyData.phoneNumber}</p>
      </div>
    </div>
  );
};

export default Overview;
