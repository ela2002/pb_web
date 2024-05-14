// Jobs.jsx
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import styles from "./Jobs.module.css";
import JobCard from './JobCard';
import { useNavigate } from "react-router-dom";

const Jobs = ({ company }) => {
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(firestore, "jobs"),
          where("companyId", "==", company.uid)
        );
        const querySnapshot = await getDocs(q);
        const jobs = [];
        querySnapshot.forEach((doc) => {
          jobs.push({ id: doc.id, ...doc.data() });
        });
        setCompanyJobs(jobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [company]);

  const handleJobPress = (jobId) => {
    navigation.navigate("JobDetail", { jobId: jobId });
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jobs</h1>
      <div className={styles.jobList}>
        {companyJobs.map(job => (
          <JobCard key={job.id} job={job} /> 
        ))}
      </div>
    </div>
  );
};

export default Jobs;
