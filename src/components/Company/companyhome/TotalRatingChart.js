import React, { useState, useEffect } from "react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import styles from "./TotalRatingChart.module.css";
import StarRating from "../CompanyProfile/StarRating";
import { getDocs, query, collection, where } from "firebase/firestore";

const TotalRatingChart = () => {
  const [globalRating, setGlobalRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const companyQuerySnapshot = await getDocs(
            query(
              collection(firestore, "companiesprofile"),
              where("uid", "==", user.uid)
            )
          );
          if (!companyQuerySnapshot.empty) {
            // Assuming there's only one company profile per user
            const companyDoc = companyQuerySnapshot.docs[0];
            setCompanyData({ ...companyDoc.data(), id: companyDoc.id });
          } else {
            setError("Company profile not found for UID: " + user.uid);
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
          setError("Error fetching company data: " + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setCompanyData(null);
        console.log("User not authenticated");
      }
    });

    return () => {
      authStateChanged();
    };
  }, []);

  useEffect(() => {
    if (companyData) {
      // Once company data is fetched, you can set global rating or perform other operations if needed
      setGlobalRating(companyData.globalRating); // Assuming 'globalRating' is a field in the company profile data
    }
  }, [companyData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.totalRating}>
      <h3>Total Rating</h3>
      <div className={styles.value}>
        <>
          <span>{globalRating !== null ? globalRating.toFixed(1) : "N/A"}</span>
          {globalRating !== null && <StarRating rating={globalRating} />}
        </>
      </div>
    </div>
  );
};

export default TotalRatingChart;
