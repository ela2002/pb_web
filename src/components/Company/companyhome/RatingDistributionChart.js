import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FaStar } from "react-icons/fa"; // Import the Star icon
import styles from "./RatingDistributionChart.module.css";

// Define a StarRating component
const StarRating = ({ count }) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push(<FaStar style={{ marginLeft: '8px', color: '#ffc107' }} key={i} />);
  }
  return <div style={{ display: 'inline-flex' }}>{stars}</div>;
};

const RatingDistributionChart = () => {
  const [ratingDistribution, setRatingDistribution] = useState([]);

  useEffect(() => {
    const fetchRatingDistribution = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const companyQuerySnapshot = await getDocs(
            query(collection(firestore, "companiesprofile"), where("uid", "==", user.uid))
          );
          if (!companyQuerySnapshot.empty) {
            let companyId;
            companyQuerySnapshot.forEach((doc) => {
              companyId = doc.id;
            });
            const reviewsCollection = collection(firestore, "companiesprofile", companyId, "reviews");
            const querySnapshot = await getDocs(reviewsCollection);
            const reviews = querySnapshot.docs.map((doc) => doc.data());
            console.log("Fetched reviews:", reviews);
            const ratingDist = getRatingDistribution(reviews);
            console.log("Rating distribution:", ratingDist);
            setRatingDistribution(ratingDist);
          } else {
            console.error("Company data not found for UID:", user.uid);
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching rating distribution:", error);
      }
    };

    fetchRatingDistribution();
  }, []);

  const getRatingDistribution = (reviews) => {
    const ratingDist = {
      "5 Stars": 0,
      "4 Stars": 0,
      "3 Stars": 0,
      "2 Stars": 0,
      "1 Star": 0,
    };

    reviews.forEach((review) => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        ratingDist[`${rating} Stars`] += 1;
      }
    });

    const totalReviews = reviews.length;

    // Calculate average rating for each rating level
    const averageDist = Object.entries(ratingDist).map(([name, count]) => {
      const starCount = parseInt(name.charAt(0));
      const average = totalReviews !== 0 ? count / totalReviews : 1;
      return {
        name,
        average
      };
    });

    return averageDist;
  };

  return (
    <div className={styles.ratingDistribution}>
      <h3 >Rating Distribution</h3>
      <div className={styles.starAndBar}>
        {ratingDistribution.map((rating, index) => (
          <div key={index} className={styles.row}>
            <StarRating count={5 - index} />
            <BarChart width={400} height={40} data={[rating]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} display="none" />
              <XAxis type="number" hide />
              <YAxis type="category" hide />
              <Tooltip />
              <Bar dataKey="average" fill="#8884d8" barSize={15} radius={[5, 5, 5, 5]} />
            </BarChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingDistributionChart;
