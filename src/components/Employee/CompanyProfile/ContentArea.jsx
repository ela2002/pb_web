// ContentArea.jsx
import React from "react";
import styles from "./ContentArea.module.css";
import Jobs from "./Jobs";
import Overview from "./Overview";
import ReviewsList from "./ReviewsList";

const ContentArea = ({ selectedTab , companyId,company }) => {
  return (
    <div className={styles.content}>
      {selectedTab === "overview" && <Overview  company={company}/>}
      {selectedTab === "reviews" && <ReviewsList companyId={companyId} />}
      {selectedTab === "jobs" && <Jobs company={company} />}
    </div>
  );
};

export default ContentArea;
