// NavigationBar.jsx
import React from "react";
import styles from "./NavigationBar.module.css";

const NavigationBar = ({ selectedTab, setSelectedTab }) => {
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className={styles.navbar}>
      <button
        className={`${styles.navButton} ${
          selectedTab === "overview" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("overview")}
      >
        Overview
      </button>
      <button
        className={`${styles.navButton} ${
          selectedTab === "reviews" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("reviews")}
      >
        Reviews
      </button>
      <button
        className={`${styles.navButton} ${
          selectedTab === "jobs" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("jobs")}
      >
        Jobs
      </button>
      
      
    </div>
  );
};

export default NavigationBar;
