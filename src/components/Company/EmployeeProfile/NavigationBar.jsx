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
        Posts
      </button>
      <button
        className={`${styles.navButton} ${
          selectedTab === "jobs" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("jobs")}
      >
          Job Experience
      </button>
      <button
        className={`${styles.navButton} ${
          selectedTab === "mentions" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("mentions")}
      >
         CV
      </button>
      
    </div>
  );
};

export default NavigationBar;
