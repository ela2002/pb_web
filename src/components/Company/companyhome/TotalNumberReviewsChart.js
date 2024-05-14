import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import styles from "./TotalNumberReviewsChart.module.css";
import { MdRateReview } from "react-icons/md"; // Import the icon from the Material-UI library

const TotalNumberReviewsChart = () => {
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [companyData, setCompanyData] = useState(null);

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

  useEffect(() => {
    if (companyData) {
      const fetchTotalReviews = async () => {
        try {
          const reviewsCollection = collection(
            firestore,
            `companiesprofile/${companyData.id}/reviews`
          );
          const querySnapshot = await getDocs(reviewsCollection);
          // Get total number of reviews by counting the documents
          const totalReviewsCount = querySnapshot.size;
          setTotalReviews(totalReviewsCount);
        } catch (error) {
          console.error("Error fetching reviews from Firestore:", error);
        }
      };

      fetchTotalReviews();
    }
  }, [companyData]);

  return (
    <div className={styles.totalNumberReviews}>
      <h3>Total Number of Reviews</h3>
      <div className={styles.value}>
        <MdRateReview style={{ verticalAlign: 'middle', marginRight: '5px', color:'#0056b3' }} />
        {totalReviews}
      </div>
    </div>
  );
};

export default TotalNumberReviewsChart;
