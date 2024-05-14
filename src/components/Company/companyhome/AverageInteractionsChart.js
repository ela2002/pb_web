import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import styles from "./AverageInteractionsChart.module.css";
import { MdThumbUp } from "react-icons/md"; // Import the icon from the Material-UI library

const AverageInteractionsChart = () => {
  const [averageInteractions, setAverageInteractions] = useState(0);
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
    const fetchReviews = async () => {
      if (companyData) {
        try {
          const reviewsCollection = collection(
            firestore,
            `companiesprofile/${companyData.id}/reviews`
          );
          const querySnapshot = await getDocs(reviewsCollection);
          const reviewsData = querySnapshot.docs.map((doc) => doc.data());
          
          // Calculate total number of likes and total number of reviews
          let totalLikes = 0;
          let totalReviews = reviewsData.length;

          reviewsData.forEach((review) => {
            totalLikes += review.likes || 0; // Extract likes per review
          });

          // Calculate average interactions (likes per review) as a percentage
          const average = totalReviews !== 0 ? (totalLikes / (totalReviews * 5)) * 100 : 0; // Assuming each review can have a maximum of 5 likes
          setAverageInteractions(average);
        } catch (error) {
          console.error("Error fetching reviews from Firestore:", error);
        }
      }
    };

    fetchReviews();
  }, [companyData]);

  return (
    <div className={styles.averageInteractions}>
      <h3>Average Number of Interactions (%)</h3>
      <div className={styles.value}>
        <MdThumbUp style={{ verticalAlign: 'middle', marginRight: '5px', color:'darkviolet' }} />
        {averageInteractions.toFixed(2)}
      </div>
    </div>
  );
};

export default AverageInteractionsChart;
