import React from "react";
import styles from "./serviceorproduct.module.css";
import { GrFormPreviousLink } from "react-icons/gr";
import { Link } from "react-router-dom";
import StepContent from "../StepContent2";
const ServiceOrProduct = () => {
  return (
    <div className={styles.alls}>
      <div className={styles.serviceOrProductContainer}>
        <StepContent />
        <br />
        <div className={styles.topbuttons}>
          <Link to={"/companysize"}>
            <button className={styles.topLeftButton}>
              <GrFormPreviousLink />
              Back
            </button>
          </Link>
        </div>
        <h2 className={styles.title}>Describe Your Service or Product</h2>
        <textarea
          className={styles.descriptionTextarea}
          placeholder="Enter description here..."
        ></textarea>
        <Link to={"/signin"}>
          <button className={styles.bottomRightButton}> Sign up </button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceOrProduct;
