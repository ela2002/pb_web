// ContentArea.jsx
import React from "react";
import styles from "./ContentArea.module.css";
import Overview from "./Overview";

import Review from "./Review";

const ContentArea = ({ selectedTab,companyData}) => {
  return (
    <div className={styles.content}>
      {selectedTab === "overview" && <Overview />}
      {selectedTab === "review" && <Review companyData={companyData}  />}

    </div>
  );
};

export default ContentArea;
