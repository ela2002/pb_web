import React from "react";
import styles from "./Overview.module.css";

const Overview = () => {
  return (
    <div className={styles.container}>
      <div className={styles.employeePostCard}>
        <div className={styles.postHeader}>
          <h2 className={styles.postTitle}>Post Title</h2>
          <p className={styles.postDate}>Post Date</p>
        </div>
        <p className={styles.postContent}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          vehicula est ac pretium pretium. Mauris feugiat ligula vel dui
          consequat, at fermentum arcu fermentum. Fusce in elit euismod,
          posuere turpis sit amet, faucibus arcu. Nullam in consectetur enim.
        </p>
      </div>
    </div>
  );
};

export default Overview;
