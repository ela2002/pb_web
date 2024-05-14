import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import styles from "./TopKeywordsChart.module.css";

const TopKeywordsChart = () => {
  const [topKeywords, setTopKeywords] = useState([]);

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
        // Fetch reviews data
        const reviewsCollection = collection(
          firestore,
          `companiesprofile/${companyData.id}/reviews`
        );
        const querySnapshot = await getDocs(reviewsCollection);
        const reviewsData = querySnapshot.docs.map((doc) => doc.data());

        // Extract and filter tags from reviews
        const allTags = reviewsData.flatMap((review) => review.tags || []);
        const nonEmptyTags = allTags.filter((tag) => tag.trim() !== "");

        // Count occurrences of each tag
        const tagCounts = nonEmptyTags.reduce((counts, tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
          return counts;
        }, {});

        // Convert tag counts to array format
        const tagCountsArray = Object.keys(tagCounts).map((tag) => ({
          tag,
          count: tagCounts[tag],
        }));

        // Sort tags by count in descending order
        const sortedTags = tagCountsArray.sort((a, b) => b.count - a.count);

        // Take the top 5 tags
        const top5Tags = sortedTags.slice(0, 5);

        setTopKeywords(top5Tags);
      } catch (error) {
        console.error("Error fetching reviews from Firestore:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className={styles.topKeywords}>
      <h3>Top Keywords</h3>
      <BarChart width={400} height={300} data={topKeywords}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tag" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TopKeywordsChart;
