import React, { useState } from "react";
import styles from "./ProfileHeader.module.css";

const ProfileHeader = ({ employeeData }) => {
  const avatar = "/assets/avatar.jpg";
  const [isLoading, setIsLoading] = useState(false);


  return (
    <div className={styles.header}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          <img src={employeeData?.profilePicture || avatar} alt="Avatar" />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <h2>{employeeData?.fullName || "Anonymous"}</h2>
       
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
          <p className={styles.bio}>{employeeData?.bio}</p>
          
        </div>
      </div>
      {isLoading && <div className={styles.loading}>Saving...</div>}
    </div>
  );
};

export default ProfileHeader;
