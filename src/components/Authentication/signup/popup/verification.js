import React from "react";
import { Link } from "react-router-dom";
import styles from "./verification.module.css";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import StepContent from "./StepContent";
const Verification = () => {
  const handleCameraClick = () => {
    alert("Opening Camera...");
  };

  return (
    <div className={styles.all}>
      <div className={styles.containers}>
        <StepContent />
        <br />
        <Link to={"/profile"}>
          {" "}
          <button className={styles.topLeftButton}>
            {" "}
            <GrFormPreviousLink />
            Back
          </button>{" "}
        </Link>
        <h2 className={styles.title}>Facial Recognition Verification</h2>
        <div className={styles.cameraContainer}>
          <button className={styles.cameraButton} onClick={handleCameraClick}>
            Start now
          </button>
        </div>
        <Link to={"/approvment"}>
          {" "}
          <button className={styles.bottomRightButton}> Proceed </button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Verification;
