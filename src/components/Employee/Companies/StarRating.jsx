import React from "react";
import { FaStar } from "react-icons/fa";
import styles from "./StarRating.module.css";

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < rating ? styles.checked : styles.unchecked}
    >
      <FaStar />
    </span>
  ));

  return <div className={styles.starRating}>{stars}</div>;
};

export default StarRating;
