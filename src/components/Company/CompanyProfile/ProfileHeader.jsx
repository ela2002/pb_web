import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditProfileCard from "../CompanyProfile/EditProfileCard";
import styles from "./ProfileHeader.module.css";
import StarRating from "./StarRating";
import LoadingSpinner from "./LoadingSpinner";


const ProfileHeader = ({ onEditProfileClick, companyData, onSaveProfile }) => {
  const avatar = "/assets/avatar.jpg";
  const [isEditCardVisible, setIsEditCardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditCardVisible(true);
  };

  const handleCloseEditCard = () => {
    setIsEditCardVisible(false);
  };

  const handleSaveProfile = async (formData) => {
    setIsLoading(true); 
    try {
      setIsLoading(false); 
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsLoading(false); 
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          <img src={companyData?.profilePic || avatar} alt="Avatar" />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <h2>{ companyData?.fullName || "undefined"}</h2>

            <button className={styles.editIcon} onClick={handleEditClick}>
              <FaEdit />
            </button>
            <div className={styles.recommendations}>
              <span className={styles.recommended}>Recommended: </span>
              <span className={styles.unrecommended}>Unrecommended:</span>
            </div>
            {companyData && (
              <>
                <p className={styles.industry}>Industry: { companyData?.industry || ""}</p>
                <p className={styles.companySize}>Company Size: { companyData?.companySize || ""}</p>
                <p className={styles.location}>Location: { companyData?.location || ""}</p>
                <p className={styles.website}>Website: {companyData?.website || ""}</p>

                <div className={styles.Rating}>
                  <StarRating rating={companyData?.globalRating|| ""}/>
                </div>
              </>
            )}

            {/* Conditional rendering of loading spinner */}
            {isLoading && <LoadingSpinner />}
          </div>
          <EditProfileCard
            isVisible={isEditCardVisible}
            onClose={handleCloseEditCard}
            companyData={companyData}
            onSave={handleSaveProfile} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
