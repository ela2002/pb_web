import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import Sentiment from "sentiment";
import styles from "./SentimentAnalysisChart.module.css";

const SentimentAnalysisChart = () => {
  const [sentimentData, setSentimentData] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Fetch company data
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
                companyQuerySnapshot.forEach((doc) => {
                  const companyData = { ...doc.data(), id: doc.id }; // Include document ID in companyData
                  fetchReviews(companyData); // Fetch reviews data after fetching company data
                });
              } else {
                console.error("Company data not found for UID:", user.uid);
              }
            } catch (error) {
              console.error("Error fetching company data:", error);
            }
          } else {
            console.log("User not authenticated");
          }
        });

        return () => {
          authStateChanged(); // Call the unsubscribe function
        };
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    const fetchReviews = async (companyData) => {
      try {
        const reviewsCollection = collection(
          firestore,
          `companiesprofile/${companyData.id}/reviews`
        );
        const querySnapshot = await getDocs(reviewsCollection);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sentimentAnalysis = analyzeSentiment(reviewsData);

        setSentimentData(sentimentAnalysis);
      } catch (error) {
        console.error("Error fetching reviews from Firestore:", error);
      }
    };

    fetchCompanyData();
  }, []);

  const COLORS = ["#6a0dad", "#9c27b0", "#d05ce3"]; // Purple shades

  return (
    <div className={styles.sentimentAnalysis}>
      <h3>Sentiment Analysis</h3>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="value"
          data={sentimentData}
          cx={200}
          cy={125}
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {sentimentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};

const analyzeSentiment = (reviewsData) => {
  const sentiment = new Sentiment();
  const sentimentCount = {
    Positive: 0,
    Negative: 0,
    Neutral: 0,
  };

  reviewsData.forEach((review) => {
    const result = sentiment.analyze(review.comment);

    if (result.score > 0) {
      sentimentCount.Positive++;
    } else if (result.score < 0) {
      sentimentCount.Negative++;
    } else {
      sentimentCount.Neutral++;
    }
  });

  const sentimentData = Object.keys(sentimentCount).map((sentiment) => ({
    name: sentiment,
    value: sentimentCount[sentiment],
  }));

  return sentimentData;
};

export default SentimentAnalysisChart;
