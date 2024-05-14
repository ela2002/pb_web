import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../../../firebase/firebase';
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import Navbar from '../Navbar/Navbar';

const JobDetails = () => {
  const { jobId } = useParams(); 
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false); // State to track if application submitted

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Create a combined query to fetch both job and company details
        const jobAndCompanyQuerySnapshot = await getDocs(query(
          collection(firestore, "jobs"),
          where("id", "==", jobId)
        ));
        
        if (!jobAndCompanyQuerySnapshot.empty) {
          const jobData = jobAndCompanyQuerySnapshot.docs[0].data();
          
          // Fetch company details based on companyId from the job data
          const companyQuerySnapshot = await getDocs(
            query(
              collection(firestore, "companiesprofile"),
              where("uid", "==", jobData.companyId)
            )
          );
    
          if (!companyQuerySnapshot.empty) {
            const companyData = companyQuerySnapshot.docs[0].data();
            setJob(jobData);
            setCompany(companyData);
          } else {
            console.log("No such company found!");
          }
        } else {
          console.log("No such job found!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    const checkIfApplied = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const applicationsRef = collection(firestore, "applications");
          const querySnapshot = await getDocs(
            query(
              applicationsRef,
              where("userId", "==", user.uid),
              where("jobId", "==", jobId)
            )
          );
          if (!querySnapshot.empty) {
            setApplied(true);
          }
        }
      } catch (error) {
        console.error("Error checking if applied:", error);
      }
    };

    fetchJobDetails();
    checkIfApplied();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in.");
        return;
      }

      const applicationData = {
        jobId: jobId,
        jobTitle: job.title,
        userId: user.uid,
        companyName: company.companyName,
        companyPic: company.profilePic,
        appliedAt: new Date(),
      };

      // Add application to Firestore
      // Note: Implement this part according to your application's logic

      console.log("Job application submitted successfully!");
      setApplied(true); // Set applied to true after successful submission
    } catch (error) {
      console.error("Error submitting job application:", error);
      alert(
        "Error",
        "Failed to submit job application. Please try again later."
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <h2>{job.title}</h2>
      <p>Location: {job.location}</p>
      <p>Description: {job.description}</p>
      <p>Company Name: {company.companyName}</p>
      <img src={company.profilePic} alt="Company Logo" />
      <p>Requirements: {job.requirements && job.requirements.join(', ')}</p>
      <button onClick={handleApply} disabled={applied}>
        {applied ? "Applied" : "Apply"}
      </button>
    </div>
  );
};

export default JobDetails;
