import React from "react";
import { Link } from "react-router-dom";
import styles from "./Approvement.module.css";
import { FcApproval } from "react-icons/fc";
import StepContent from "./StepContent";
const Approvement = () => {
  return (
    <div className={styles.allpage}>
      <div className={styles.container}>
        <StepContent />
        <br />

        <h2
          style={{
            fontFamily: "Arial, Helvetica",
            fontSize: "25px",
            marginBottom: "20px",
            textAlign: "center",
            color: "#9a70b3",
          }}
        >
          Facial Recognition Verification Successful
        </h2>
        <div className={styles.VerificationContainer}>
          <div className={styles.texts}>
            <p> Congratulations! </p>
            <p>Your face has been successfully verified,</p>
            <p> and your account has been created. </p>
            <FcApproval />
          </div>
        </div>
        <Link to={"/signup"}>
          {" "}
          <button className={styles.bottomRightButton}> SignUp </button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Approvement;
