import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./EditProfileCard.module.css";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

const EditProfileCard = ({ isVisible, onClose, employeeData, onSave }) => {
  const avatar = "/assets/avatar.jpg";

  const [formData, setFormData] = useState({
    fullName: employeeData?.fullName || "",
    jobTitle: employeeData?.jobTitle || "",
    companyName: employeeData?.companyName || "",
    industry: employeeData?.industry || "",
    bio: employeeData?.bio || "",
    profilePicture: employeeData?.profilePicture || "",

  });

  useEffect(() => {
    setFormData({
      fullName: employeeData?.fullName || "",
    jobTitle: employeeData?.jobTitle || "",
    companyName: employeeData?.companyName || "",
    industry: employeeData?.industry || "",
    bio: employeeData?.bio || "",
    profilePicture: employeeData?.profilePicture || "",

    });
  }, [employeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${file.name}`);

    try {
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: downloadURL,
      }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeDocRef = doc(firestore, "employeesprofile", employeeData.id);
      await updateDoc(employeeDocRef, formData);
      onSave(formData); 
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      {isVisible && (
        <div className={styles.editProfileCardOverlay}>
          <div className={styles.editProfileCard}>
            <button className={styles.closeButton} onClick={onClose}>
              <FaTimes />
            </button>
            <div className={styles.profilePicture}>
              <img
                src={formData.profilePicture || avatar}
                alt="Profile Picture"
                className={styles.profilePic}
              />
              <label htmlFor="fileInput" className={styles.fileInputLabel}>
                Choose Profile Picture
              </label>
              <input
                type="file"
                id="fileInput"
                name="profilePic"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                style={{ display: "none" }}
              />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="fullName"
                placeholder="Name"
                value={formData.fullName}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className={styles.input}
              />
             <textarea
                name="bio"
                placeholder="Bio"
                value={formData.bio}
                onChange={handleChange}
                className={styles.textarea}
              />
              <button type="submit" className={styles.submitButton}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileCard;
