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
          selectedTab === "details" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("details")}
      >
        Details
      </button>
      <button
        className={`${styles.navButton} ${
          selectedTab === "posts" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("posts")}
      >
        Posts
      </button>
      
      <button
        className={`${styles.navButton} ${
          selectedTab === "liked" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("liked")}
      >
        Likes
      </button>
      <button
        className={`${styles.navButton} ${
          selectedTab === "saved" ? styles.active : ""
        }`}
        onClick={() => handleTabChange("saved")}
      >
        Saves
      </button>
      
    </div>
  );
};

export default NavigationBar;
