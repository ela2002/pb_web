import React, { useState, useEffect, useContext } from "react";
import { firestore,auth } from "../../../firebase/firebase";
import styles from "./ReviewsList.module.css";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query,where,setDoc,getDoc } from "firebase/firestore";
import StarRating from "../Companies/StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark, faPlus, faEllipsisV, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const ReviewsList = ({ companyId }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [reviews, setReviews] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    tags: [],
    anonymous: false,
  });
 useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("uid", "==", user.uid)));
          if (!employeeQuerySnapshot.empty) {
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
        setLoading(false); 
        console.log("User not authenticated");
      }
    });

    return () => {
      authStateChanged();
    };
  }, []);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(
          firestore,
          `companiesprofile/${companyId}/reviews`
        );
        const querySnapshot = await getDocs(reviewsCollection);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
        calculateGlobalRating(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews from Firestore:", error);
      }
    };

    fetchReviews();
  }, [companyId]);

  const updateReviewsState = async () => {
    try {
      const reviewsCollection = collection(
        firestore,
        `companiesprofile/${companyId}/reviews`
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

  const calculateGlobalRating = (reviews) => {
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRatings / reviews.length;
    // Update the global rating in the company document
    const companyRef = doc(firestore, "companiesprofile", companyId);
    updateDoc(companyRef, { globalRating: averageRating });
  };

  const handleLike = async (reviewId, currentLikes, isLiked) => {
    try {
      const reviewRef = doc(firestore, `companiesprofile/${companyId}/reviews`, reviewId);
      let updatedLikes;
      if (!isLiked) {
        updatedLikes = currentLikes + 1;
        await updateDoc(reviewRef, { likes: updatedLikes });
        await setDoc(doc(reviewRef, "likes", employeeData?.uid), { liked: true });
      } else {
        updatedLikes = currentLikes - 1;
        await updateDoc(reviewRef, { likes: updatedLikes });
        await deleteDoc(doc(reviewRef, "likes", employeeData?.uid));
      }
    } catch (error) {
      console.error("Error updating review likes:", error);
    }
  };
  
  const handleSave = async (reviewId, isSaved) => {
    try {
      const reviewRef = doc(firestore, `companiesprofile/${companyId}/reviews`, reviewId);
      const saveRef = doc(reviewRef, "saves", employeeData?.uid);
      const saveDocSnapshot = await getDoc(saveRef);
      
      if (!isSaved) {
        if (!saveDocSnapshot.exists()) {
          await setDoc(saveRef, { saved: true });
        }
      } else {
        if (saveDocSnapshot.exists()) {
          await deleteDoc(saveRef);
        }
      }
    } catch (error) {
      console.error("Error updating review saved status:", error);
    }
  };
  const handleAddReview = () => {
    setShowAddReview(true);
  };

  const handleCancelAddReview = () => {
    setShowAddReview(false);
    setNewReview({
      rating: 0,
      comment: "",
      tags: [],
      anonymous: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      // Split the comma-separated values into an array
      const tagsArray = value.split(",").map((tag) => tag.trim());
      setNewReview((prevState) => ({
        ...prevState,
        [name]: tagsArray,
      }));
    } else {
      setNewReview((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewsRef = collection(firestore, `companiesprofile/${companyId}/reviews`);
      const reviewData = {
        userId: employeeData.uid,
        username: employeeData.fullName,
        comment: newReview.comment,
        rating: parseInt(newReview.rating),
        date: new Date(),
        likes: 0,
        saved: false,
        tags: newReview.tags,
        anonymous: newReview.anonymous,
      };
      await addDoc(reviewsRef, reviewData);
      setShowAddReview(false);
      setNewReview({
        rating: 0,
        comment: "",
        tags: [],
        anonymous: false,
      });
      await updateReviewsState();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    // Populate the newReview state with the values of the review being edited
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      tags: review.tags,
      anonymous: review.anonymous,
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleUpdateReview = async () => {
    try {
      const reviewRef = doc(
        firestore,
        `companiesprofile/${companyId}/reviews`,
        editingReview.id
      );
      await updateDoc(reviewRef, {
        ...newReview, // Include the updated newReview object
      });
      setEditingReview(null);
      await updateReviewsState();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const reviewRef = doc(
        firestore,
        `companiesprofile/${companyId}/reviews`,
        reviewId
      );
      await deleteDoc(reviewRef);
      await updateReviewsState();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className={styles.reviewsList}>
      <button onClick={handleAddReview} className={styles.addReviewButton}>
        <FontAwesomeIcon icon={faPlus} />
        Add Review
      </button>
      {reviews.map((review) => (
  <div key={review.id} className={styles.review}>
    <div className={styles.reviewHeader}>
      <div className={styles.userInfo}>
        {review.anonymous ? ( // Render "Anonymous" if the review is anonymous
          <span className={styles.anonymous}>Anonymous</span>
        ) : (
          <span className={styles.username}>{review.username}</span>
        )}
        {employeeData && employeeData.uid === review.userId && (
          <div className={styles.options} onClick={() => setShowEditOptions(review.id)}>
            <FontAwesomeIcon
              icon={faEllipsisV}
              className={styles.optionsIcon}
            />
            {showEditOptions === review.id && (
              <div className={styles.editDeleteIcons}>
                <span>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className={styles.editIcon}
                    onClick={() => handleEdit(review)}
                  />
                </span>
                <FontAwesomeIcon
                  icon={faTrash}
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteReview(review.id)}
                />
              </div>
            )}
          </div>
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

      {showAddReview && (
        <div className={styles.overlay}>
          <div className={styles.addReviewCard}>
            <h3>Add Review</h3>
            <div className={styles.rating}>
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleInputChange}
              >
                <option value="">Select rating...</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
                <option value="0">0</option>
              </select>
            </div>
            <textarea
              className={styles.commentInput}
              name="comment"
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={handleInputChange}
            ></textarea>
            <input
              className={styles.tagInput}
              type="text"
              name="tags"
              placeholder="Add tags (comma-separated)"
              value={Array.isArray(newReview.tags) ? newReview.tags.join(",") : ""}
              onChange={handleInputChange}
            />
            <label>
              <input
                type="checkbox"
                name="anonymous"
                checked={newReview.anonymous}
                onChange={(e) =>
                  setNewReview((prevState) => ({
                    ...prevState,
                    anonymous: e.target.checked,
                  }))
                }
              />
              Anonymous
            </label>
            <div className={styles.buttons}>
              <button onClick={handleSubmitReview}>Submit</button>
              <button onClick={handleCancelAddReview}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingReview && (
        <div className={styles.overlay}>
          <div className={styles.editReviewCard}>
            <h3>Edit Review</h3>
            <div className={styles.rating}>
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleInputChange}
              >
                <option value="">Select rating...</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
                <option value="0">0</option>
              </select>
            </div>
            <textarea
              className={styles.commentInput}
              name="comment"
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={handleInputChange}
            ></textarea>
            <input
              className={styles.tagInput}
              type="text"
              name="tags"
              placeholder="Add tags (comma-separated)"
              value={Array.isArray(newReview.tags) ? newReview.tags.join(",") : ""}
              onChange={handleInputChange}
            />
            <label>
              <input
                type="checkbox"
                name="anonymous"
                checked={newReview.anonymous}
                onChange={(e) =>
                  setNewReview((prevState) => ({
                    ...prevState,
                    anonymous: e.target.checked,
                  }))
                }
              />
              Anonymous
            </label>
            <div className={styles.buttons}>
              <button onClick={handleUpdateReview}>Update</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
