import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./AddButton.module.css";

const AddButton = ({ onClick }) => {
  return (
    <button className={styles.addButton} onClick={onClick}>
      <FaPlus className={styles.plusIcon} />
      Add Post
    </button>
  );
};

export default AddButton;
