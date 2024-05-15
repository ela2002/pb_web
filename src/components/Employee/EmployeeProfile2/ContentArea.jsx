import React from "react";
import styles from "./ContentArea.module.css";
import Posts from "./Posts";
import Details from "./Details";

const ContentArea = ({ selectedTab, employeeData }) => {
  return (
    <div className={styles.content}>
      {selectedTab === "details" && <Details employeeData={employeeData} />}
      {selectedTab === "posts" && <Posts employeeData={employeeData} />}
    
    </div>
  );
};

export default ContentArea;
