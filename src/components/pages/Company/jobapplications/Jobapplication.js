import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import styles from "./jobapplication.module.css";
import Navbar from "../../../Company/Navbar/Navbar";
import AddJobButton from "../../../Company/joboffers/addjobbutton/addjobbutton";
import { getAuth } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";

const ConsultApplications = ({ onClose }) => {
  const [jobApplications, setJobApplications] = useState([]);
  const [companyId, setCompanyId] = useState(""); // State to store current company ID

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUserUid = user.uid;
        setCompanyId(currentUserUid);
        fetchJobApplications(currentUserUid);
      } else {
        setCompanyId("");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchJobApplications = async (companyId) => {
    try {
      const applicationsQuery = query(
        collection(firestore, "applications"),
        where("companyId", "==", companyId)
      );

      const applicationsSnapshot = await getDocs(applicationsQuery);
      const applicationsData = [];

      for (const docSnapshot of applicationsSnapshot.docs) {
        const applicationData = docSnapshot.data();
        const userId = applicationData.userId;

        const userDocRef = doc(firestore, "employeesprofile", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const fullName = userData.fullName;

          // Fetch resume URL from Firebase Storage
          const resumeUrl = await fetchResumeUrl(userId);

          applicationData.fullName = fullName;
          applicationData.resumeUrl = resumeUrl;

          applicationsData.push({ id: docSnapshot.id, ...applicationData });
        } else {
          console.error(
            "User profile document does not exist for userId:",
            userId
          );
        }
      }

      setJobApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  const fetchResumeUrl = async (userId) => {
    try {
      const storage = getStorage();
      const resumeRef = ref(storage, `resumes/${userId}/resume.pdf`);
      const url = await getDownloadURL(resumeRef);
      return url;
    } catch (error) {
      console.error("Error fetching resume:", error);
      return null;
    }
  };

  const handleAccept = async (id) => {
    try {
      const applicationRef = doc(firestore, "applications", id);
      await updateDoc(applicationRef, { status: "accepted" });

      setJobApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, status: "accepted" }
            : application
        )
      );
    } catch (error) {
      console.error("Error accepting job application:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const applicationRef = doc(firestore, "applications", id);
      await updateDoc(applicationRef, { status: "rejected" });

      setJobApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, status: "rejected" }
            : application
        )
      );
    } catch (error) {
      console.error("Error rejecting job application:", error);
    }
  };

  return (
    <div className={styles.overlay}>
      <Navbar />
      <AddJobButton />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Applications</h2>
        </div>
        <div className={styles.applicationsContainer}>
          {jobApplications.map((application) => (
            <div
              key={application.id}
              className={`${styles.application} ${
                application.status === "accepted"
                  ? styles.accepted
                  : application.status === "rejected"
                  ? styles.rejected
                  : ""
              }`}
            >
              <div className={styles.applicationDetails}>
                <p>
                  <strong>Company Name:</strong> {application.companyName}
                </p>
                <p>
                  <strong>Job Offer:</strong> {application.jobTitle}
                </p>
                <p>
                  <strong>Applicant Name:</strong> {application.fullName}
                </p>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </div>
              <div className={styles.buttonsContainer}>
                <button
                  className={styles.acceptButton}
                  onClick={() => handleAccept(application.id)}
                >
                  Accept
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleReject(application.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultApplications;
