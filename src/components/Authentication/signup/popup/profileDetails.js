import React, { useState } from "react";
import styles from "./profileDetails.module.css";
import { LiaIndustrySolid } from "react-icons/lia";
import { TfiWrite } from "react-icons/tfi";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaRegBuilding } from "react-icons/fa";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { PiBag } from "react-icons/pi";
import StepContent from "./StepContent";
import { Link } from "react-router-dom";
import profilee from "../../../../images/profilee.png";

const ProfileDetails = ({ formData, setFormData }) => {
  const [profilePicture, setProfilePicture] = useState(
    formData?.profilePicture || null
  );
  const [bio, setBio] = useState(formData?.bio || "");
  const [jobTitle, setJobTitle] = useState(formData?.jobTitle || "");
  const [industry, setIndustry] = useState(formData?.industry || "");
  const [positionHeld, setPositionHeld] = useState(
    formData?.positionHeld || ""
  );
  const [companyName, setCompanyName] = useState(formData?.companyName || "");

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value);
  };

  const handleIndustryChange = (event) => {
    setIndustry(event.target.value);
  };

  const handlePositionHeldChange = (event) => {
    setPositionHeld(event.target.value);
  };

  const handleCompanyNameChange = (event) => {
    setCompanyName(event.target.value);
  };

  return (
    <div className={styles.profileback}>
      <div className={styles.profileDetailsContainer}>
        <StepContent />
        <br />
        <div className={styles.topbuttons}>
          <Link to={"/signup"}>
            {" "}
            <button className={styles.topLeftButton}>
              {" "}
              <GrFormPreviousLink />
              Back
            </button>
          </Link>
          <Link to={"/recognition"}>
            {" "}
            <button className={styles.topRightButton}>
              Skip <GrFormNextLink />
            </button>
          </Link>
        </div>
        <div className={styles.profileContent}>
          <h2
            style={{ marginLeft: "220px", color: "#9a70b3", fontSize: "30px" }}
          >
            Profile Details
          </h2>
          <div className={styles.profilePictureContainer}>
            <input
              type="file"
              id="profilePicture"
              onChange={handleProfilePictureChange}
            />
            <img
              src={
                profilePicture ? URL.createObjectURL(profilePicture) : profilee
              }
              alt="Profile"
              className={styles.profilePicture}
            />{" "}
            <br />
            <label htmlFor="profilePicture"> Upload Profile Picture:</label>
          </div>
          <div className={styles.bioContainer}>
            <label htmlFor="bio" style={{ marginLeft: "8px" }}>
              Bio: <TfiWrite />
            </label>
            <textarea
              id="bio"
              className={styles.inputs}
              value={bio}
              onChange={handleBioChange}
            />
          </div>
          <div className={styles.industryPositionContainer}>
            <div className={styles.jobTitleContainer}>
              <label htmlFor="jobTitle" style={{ marginLeft: "8px" }}>
                {" "}
                <PiBag />
                Job Title:
              </label>
              <input
                type="text"
                id="jobTitle"
                className={styles.inputs}
                value={jobTitle}
                onChange={handleJobTitleChange}
              />
            </div>
            <div className={styles.industryContainer}>
              <label htmlFor="industry" style={{ marginLeft: "185px" }}>
                {" "}
                <LiaIndustrySolid />
                Industry:
              </label>
              <select
                id="industry"
                style={{ marginLeft: "175px" }}
                className={styles.inputs}
                value={industry}
                onChange={handleIndustryChange}
              >
                <option value="">Select Industry</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Transportation">Transportation</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Construction">Construction</option>
                <option value="Energy">Energy</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>
          <div className={styles.industryPositionContainer}>
            <div className={styles.positionHeldContainer}>
              <label htmlFor="positionHeld" style={{ marginLeft: "8px" }}>
                {" "}
                <BsPersonWorkspace />
                Position Held:
              </label>
              <input
                type="text"
                id="positionHeld"
                className={styles.inputs}
                value={positionHeld}
                onChange={handlePositionHeldChange}
              />
            </div>
            <div className={styles.companyNameContainer}>
              <label htmlFor="companyName" style={{ marginLeft: "185px" }}>
                {" "}
                <FaRegBuilding />
                Company Name:
              </label>
              <input
                type="text"
                id="companyName"
                style={{ marginLeft: "175px" }}
                className={styles.inputs}
                value={companyName}
                onChange={handleCompanyNameChange}
              />
            </div>
          </div>
          <br />
          <Link
            to={"/signup"}
            onClick={() => {
              setFormData({
                profilePicture,
                bio,
                jobTitle,
                industry,
                positionHeld,
                companyName,
              });
            }}
          >
            {" "}
            <button className={styles.bottomRightButton}> Finish </button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
