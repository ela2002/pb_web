// ContentArea.jsx
import React from "react";
import styles from "./ContentArea.module.css";
import Jobs from "./Jobs";
import Overview from "./Overview";
import ReviewsList from "./ReviewsList";
import Mentions from "./Mentions";

const ContentArea = ({ selectedTab , companyId }) => {
  return (
    <div className={styles.content}>
      {selectedTab === "overview" && <Overview />}
      {selectedTab === "reviews" && <ReviewsList companyId={companyId} />}
      {selectedTab === "jobs" && <Jobs />}
      {selectedTab === "mentions" && <Mentions />}
    </div>
  );
};

export default ContentArea;
