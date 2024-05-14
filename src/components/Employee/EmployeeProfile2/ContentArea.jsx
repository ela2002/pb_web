// ContentArea.jsx
import React from "react";
import styles from "./ContentArea.module.css";
import Posts from "./Posts";
import Details from "./Details";
import Liked from "./Liked";
import Saved from "./Saved";
import Mentioned from "./Mentioned";

const ContentArea = ({ selectedTab, employeeData }) => {
  return (
    <div className={styles.content}>
      {selectedTab === "details" && <Details employeeData={employeeData} />}
      {selectedTab === "posts" && <Posts employeeData={employeeData} />}
      {selectedTab === "liked" && <Liked employeeData={employeeData} />}
      {selectedTab === "saved" && <Saved employeeData={employeeData}/>}
      {selectedTab === "mentioned" && <Mentioned employeeData={employeeData}/>}
    </div>
  );
};

export default ContentArea;
