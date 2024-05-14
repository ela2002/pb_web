import React, { useState, useEffect } from "react";
import styles from "./jobcard.module.css"; // Import CSS file
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
//import { AuthContext } from "../../AppContext/AppContext";
//import { Link, useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../../firebase/firebase";
import {
  getDocs,
  query,
  collection,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const JobCard = ({ job, onEdit, onDelete }) => {
  const { title, description, location, Salary, postedDate, requirements } =
    job;

  const [companyData, setCompanyData] = useState(null);
  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const companyQuerySnapshot = await getDocs(
            query(
              collection(firestore, "companiesprofile"),
              where("uid", "==", user.uid)
            )
          );
          if (!companyQuerySnapshot.empty) {
            companyQuerySnapshot.forEach((doc) => {
              setCompanyData({ ...doc.data(), id: doc.id }); // Include document ID in companyData
            });
          } else {
            console.error("Company data not found for UID:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      } else {
        setCompanyData(null);
        console.log("User not authenticated");
      }
    });

    return () => {
      authStateChanged(); // Call the unsubscribe function
    };
  }, []);

  // Convert Firestore timestamp to JavaScript Date object
  const formattedDate = postedDate ? new Date(postedDate.seconds * 1000) : null;

  // State for managing requirements
  const [updatedRequirements, setUpdatedRequirements] = useState(
    requirements || []
  );

  // State for tracking loading status
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle requirement change
  const handleRequirementChange = (index, value) => {
    const newRequirements = [...updatedRequirements];
    newRequirements[index] = value;
    setUpdatedRequirements(newRequirements);
  };

  // Function to handle job deletion
  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(job);
    setIsLoading(false);
  };

  return (
    <div className={styles.jobCard}>
      {isLoading ? (
        <div className={styles.loadingSpinner}>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className={styles.companyInfo}>
            <img
              src={companyData?.profilePic || "img"}
              alt="Company Logo"
              className={styles.logo}
            />
            <div className={styles.jobDetails}>
              <h3 className={styles.jobTitle}>Title: {title}</h3>
              <p className={styles.jobDescription}>
                Description: {description}
              </p>
              <p className={styles.jobLocation}>Location: {location}</p>
              <p className={styles.jobLocation}>Salary: {Salary}</p>
              <p className={styles.jobDate}>
                Posted Date: {formattedDate ? formattedDate.toDateString() : ""}
              </p>
              <div className={styles.jobRequirements}>
                <h4>Requirements:</h4>
                {updatedRequirements.map((requirement, index) => (
                  <div key={index} className={styles.requirementItem}>
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <button className={styles.editButton} onClick={() => onEdit(job)}>
              Edit <MdOutlineEdit />
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete <MdDelete />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobCard;
