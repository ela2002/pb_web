import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import styles from "./ReviewsPerDateChart.module.css";

const ReviewsPerDateChart = () => {
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("uid", "==", user.uid)));
          if (!companyQuerySnapshot.empty) {
            let companyId;
            companyQuerySnapshot.forEach((doc) => {
              companyId = doc.id;
            });
            const reviewsCollection = collection(firestore, "companiesprofile", companyId, "reviews");
            const querySnapshot = await getDocs(reviewsCollection);
            const reviews = querySnapshot.docs.map((doc) => doc.data());
            console.log("Fetched reviews:", reviews);
            const reviewsPerWeek = getReviewsPerWeek(reviews);
            console.log("Reviews per week:", reviewsPerWeek);
            setReviewsData(reviewsPerWeek);
          } else {
            console.error("Company data not found for UID:", user.uid);
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviewsData();
  }, []);

  const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
  };

  const getReviewsPerWeek = (reviews) => {
    const reviewsPerWeek = reviews.reduce((acc, review) => {
      const weekNumber = getWeekNumber(review.date.toDate()); // Convert Timestamp to Date object
      acc[weekNumber] = (acc[weekNumber] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(reviewsPerWeek).map(([weekNumber, count]) => ({
      week: `Week ${weekNumber}`,
      count,
    }));
  };

  return (
    <div className={styles.reviewsPerDate}>
      <h3>Reviews per Week Progress</h3>
      <LineChart width={400} height={300} data={reviewsData}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" name="Reviews per Week" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </div>
  );
};

export default ReviewsPerDateChart;
