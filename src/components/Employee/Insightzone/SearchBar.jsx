// SearchBar.js
import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <div className={styles["search-bar"]}>
      <input type="text" placeholder="Search..." className={styles.input} />
    </div>
  );
};

export default SearchBar;
