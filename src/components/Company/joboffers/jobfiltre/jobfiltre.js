import React, { useState } from "react";
import styles from "./jobfiltre.module.css"; 



const JobFilter = ({ onFilter }) => {
  // State for filter values
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobType, setJobType] = useState("");

  // Function to handle filter submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Package filter values into an object and pass it to the onFilter callback
    const filters = {
      title,
      location,
      salaryRange,
      jobType,
    };
    onFilter(filters);
  };

  return (
    <div className={styles.jobOfferFilterCard}>

      <h2 className={styles.filterHeader}>Job Offer Filter</h2>
      <div className={styles.filterOptions}>
        <div className={styles.filterOption}>
          <label htmlFor="location" className={styles.filterLabel}>Location:</label>
          <input type="text" id="location" className={styles.filterInput} />
        </div>
        <div className={styles.filterOption}>
          <label htmlFor="job-type" className={styles.filterLabel} >Job Type:</label>
          <select id="job-type" className={styles.filterSelect}>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div className={styles.filterOption}>
          <label htmlFor="salary" className={styles.filterLabel}>Salary:</label>
          <input type="text" id="salary" className={styles.filterInput} />
        </div>
        <div className={styles.filterOption}>
          <label htmlFor="keywords" className={styles.filterLabel}>Keywords:</label>
          <input type="text" id="keywords" className={styles.filterInput} />
        </div>
      </div>
      <button className={styles.filterButton} onClick={handleSubmit}>Apply Filters</button>
    </div>
  );
};

export default JobFilter;
