import React, { useState, useEffect } from 'react';
import styles from './JobCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import {firestore,auth} from "../../../firebase/firebase"
import {
  
  getDocs,
  query,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const JobCard = ({ job, userId }) => {
  const { id, title, companyName, companyLogoUrl, location, description, postedDate, requirements } = job;
  const formattedPostedDate = postedDate && new Date(postedDate.seconds * 1000).toLocaleDateString();
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const checkIfApplied = async () => {
      try {
        if (!userId) return;

        const applicationsCollection = collection(firestore, "applications");
        const q = query(applicationsCollection, where("userId", "==", userId), where("jobId", "==", id));
        const applicationsSnapshot = await getDocs(q);

        if (applicationsSnapshot.size > 0) {
          // User has already applied to this job
          setApplied(true);
        } else {
          setApplied(false);
        }
      } catch (error) {
        console.error("Error checking if user has applied:", error);
      }
    };

    checkIfApplied();
  }, [userId, id]);

  const handleApply = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in.");
        return;
      }

      const applicationData = {
        jobId: id,
        jobTitle: title,
        userId: auth.currentUser.uid,
        companyName: companyName,
        companyPic: companyLogoUrl,
        appliedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(firestore, "applications"),
        applicationData
      );

      console.log(
        "Job application submitted successfully! Application ID:",
        docRef.id
      );
      alert("Success", "Job application submitted successfully!");
      setApplied(true); // Set applied to true after successful submission
    } catch (error) {
      console.error("Error submitting job application:", error);
      alert(
        "Error",
        "Failed to submit job application. Please try again later."
      );
    }
  };

  const navigateToJobDetails = (jobId) => {
    navigate(`/jobdetails/${jobId}`); // Navigate to job details page
  };

  return (
    <div className={styles.jobCard}>
      {/* Left Section - Image */}
      
      
      {/* Right Section - Job Details */}
      <div className={styles.jobDetails}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.company}>{companyName}</p>
        <p className={styles.postedDate}><span>Posted:</span> {formattedPostedDate}</p>
        <p className={styles.location}><span>Location:</span> {location}</p>
        <p className={styles.description}><span>Description:</span> {description}</p>
        <div className={styles.tagsContainer}>
          <span>Requirements: </span>
          {requirements && requirements.map(tag => (
            <span key={tag} className={styles.requirement}>#{tag}</span>
          ))}
        </div>
        <div className={styles.buttonsContainer}>
          <button className={applied ? styles.appliedButton : styles.applyButton} onClick={handleApply} disabled={applied}>
            {applied ? "Applied" : "Apply"}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default JobCard;
