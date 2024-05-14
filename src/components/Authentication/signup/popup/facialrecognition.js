import React, { useState } from "react";
import styles from "./facialrecognition.module.css";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import StepContent from "./StepContent";
import { Link } from "react-router-dom";
const Facialrecognition = ({ onAccept }) => {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handlePrivacyAcceptance = () => {
    setAcceptedPrivacy(!acceptedPrivacy);
    if (!acceptedPrivacy && onAccept) {
      onAccept();
    }
  };

  return (
    <div className={styles.all}>
      <div className={styles.facialRecognitionContainer}>
        <div className={styles.topbuttons}>
          <StepContent />
          <br />
          <Link to={"/ProfileDetails"}>
            {" "}
            <button className={styles.topLeftButton}>
              {" "}
              <GrFormPreviousLink />
              Back
            </button>{" "}
          </Link>
        </div>
        <div className={styles.instructionsBox}>
          <h2
            style={{
              fontFamily: "Arial, Helvetica",
              fontSize: "25px",
              marginBottom: "20px",
              textAlign: "center",
              color: "#9a70b3",
            }}
          >
            Facial Recognition Verification
          </h2>
          <div className={styles.instructions}>
            <h3
              style={{
                fontSize: "20px",
                color: "#9a70b3",
                fontFamily: "Arial, Helvetica, sans-serif",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              Instructions :
            </h3>
            <p>1. Find a well-lit area where your face is clearly visible.</p>
            <p>
              2. Make sure your face is in the camera frame and aligned
              correctly.
            </p>
            <p>3. Stay still while we take pictures for verification.</p>
            <p>4. Wait while we check your facial features for verification.</p>
            <p>5. Verification is happening. It might take a bit.</p>
          </div>
        </div>
        <div className={styles.privacyInfo}>
          <h3
            style={{
              fontSize: "20px",
              color: "#9a70b3",
              fontFamily: "Arial, Helvetica, sans-serif",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            Privacy and Security
          </h3>
          <p>1. Your facial data is encrypted and kept safe.</p>
          <p>2. We use top security to safeguard your identity.</p>
        </div>
        <div className={styles.privacyCheckbox}>
          <input
            type="checkbox"
            id="privacyCheckbox"
            checked={acceptedPrivacy}
            onChange={handlePrivacyAcceptance}
          />
          <br /> <br />
          <label
            htmlFor="privacyCheckbox"
            style={{ color: "#9D9D9D", fontSize: "15px" }}
          >
            I accept the terms of policy
          </label>
        </div>
        <br /> <br />
        <Link to={"/verification"}>
          {" "}
          <button className={styles.bottomRightButton}> Start </button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Facialrecognition;
