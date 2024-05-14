import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditProfileCard from "./EditProfileCard";
import styles from "./ProfileHeader.module.css";

const ProfileHeader = ({ employeeData, onEditProfileClick, isOwnProfile }) => {
  const avatar = "/assets/avatar.jpg";
  const [isEditCardVisible, setIsEditCardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditCardVisible(true);
    onEditProfileClick(); // Call the parent function to handle edit click
  };

  const handleCloseEditCard = () => {
    setIsEditCardVisible(false);
  };

  const handleSaveProfile = async (formData) => {
    setIsLoading(true);
    try {
      // Perform any necessary actions to save the profile
      setIsLoading(false);
      handleCloseEditCard(); // Close the edit card after successfully saving
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          <img src={employeeData?.profilePicture || avatar} alt="Avatar" />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <h2>{employeeData?.fullName || "Anonymous"}</h2>
            
              <button className={styles.editIcon} onClick={handleEditClick}>
                <FaEdit />
              </button>
       
            <div className={styles.recommendations}>
              <span className={styles.recommended}>
                Recommended: {employeeData?.recommend || 0}
              </span>
              <span className={styles.unrecommended}>
                Unrecommended: {employeeData?.Unrecommend || 0}
              </span>
            </div>
          </div>
          <p className={styles.jobTitle}>{employeeData?.jobTitle}</p>
          <p className={styles.company}>{employeeData?.companyName}</p>
          <p className={styles.company}>{employeeData?.industry}</p>
          <p className={styles.bio}>{employeeData?.bio}</p>
          <EditProfileCard
            isVisible={isEditCardVisible}
            onClose={handleCloseEditCard}
            employeeData={employeeData}
            onSave={handleSaveProfile}
          />
        </div>
      </div>
      {isLoading && <div className={styles.loading}>Saving...</div>}
    </div>
  );
};

export default ProfileHeader;
