import React from "react";
import styles from "./Overview.module.css";
const Overview = ({company}) => {
  return (
    <div className={styles.container}>
      <h1>Overview</h1>
      <div className={styles.content}>
        <div className={styles.card}>
          <p className={styles.description}><h6 className={styles.title}>Description: </h6> {company.description}</p>
        </div>
        <p className={styles.phone}> <h6 className={styles.title}>Phone Number:</h6> {company.phoneNumber}</p>
      </div>
    </div>
  );
};

export default Overview;
