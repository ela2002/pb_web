import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query,where } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import styles from "./Review.module.css"; // Import module styles
import StarRating from "./StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark, faPlus, faEllipsisV, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const Review = ({ companyData }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(companyData)
    const fetchReviews = async () => {
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
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews from Firestore:", error);
      }
    };

    fetchReviews();
  }, [companyData.id]);

  const handleLike = async (reviewId, currentLikes, isLiked) => {
    try {
      const reviewRef = doc(firestore, `companiesprofile/${companyData.id}/reviews`, reviewId);
      let updatedLikes;
      if (isLiked) {
        updatedLikes = currentLikes - 1;
        await updateDoc(reviewRef, { likes: updatedLikes, liked: false }); // Set liked to false
      } else {
        updatedLikes = currentLikes + 1;
        await updateDoc(reviewRef, { likes: updatedLikes, liked: true }); // Set liked to true
      }
      await updateReviewsState();
    } catch (error) {
      console.error("Error updating review likes:", error);
    }
  };

  const handleSave = async (reviewId, isSaved) => {
    try {
      const reviewRef = doc(firestore, `companiesprofile/${companyData.id}/reviews`, reviewId);
      await updateDoc(reviewRef, { saved: !isSaved });
      await updateReviewsState();
    } catch (error) {
      console.error("Error updating review saved status:", error);
    }
  };
  const updateReviewsState = async () => {
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
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error updating reviews state:", error);
    }
  };
  return (
    <div className={styles.reviewsList}>
      
      {reviews.map((review) => (
  <div key={review.id} className={styles.review}>
    <div className={styles.reviewHeader}>
      <div className={styles.userInfo}>
        {review.anonymous ? ( // Render "Anonymous" if the review is anonymous
          <span className={styles.anonymous}>Anonymous</span>
        ) : (
          <span className={styles.username}>{review.username}</span>
        )}
      
      </div>
    </div>

    <div className={styles.reviewContent}>
      {review.rating !== undefined && (
        <div className={styles.ratingContainer}>
          <StarRating rating={review.rating !== 0 ? review.rating : 0} />
        </div>
      )}
      <p className={styles.comment}>{review.comment}</p>
      {review.tags && Array.isArray(review.tags) && (
        <div className={styles.tags}>
          {review.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      
    </div>

    <div className={styles.reviewActions}>
      <div
        className={styles.action}
        onClick={() => handleLike(review.id, review.likes, review.liked)}
      >
        <FontAwesomeIcon icon={faHeart} className={styles.likeIcon} />
        <span className={styles.actionText}>{review.likes}</span>
      </div>
      <div
        className={styles.action}
        onClick={() => handleSave(review.id, review.saved)}
      >
        <FontAwesomeIcon icon={faBookmark} className={styles.saveIcon} />
        <span className={styles.actionText}>{review.saved ? 'Saved' : 'Save'}</span>
      </div>
    </div>
  </div>
))}
 </div>
  );
};

export default Review;
