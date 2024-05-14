import React, { useState } from "react";
import AddJobForm from "../addjobform/addjobform";
import styles from "./addjobbutton.module.css"; // Import CSS file
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const AddJobButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = (formData) => {
    // Handle form submission here
    console.log("Form data submitted:", formData);
    setShowForm(false);
  };

  return (
    <>
      <div className={showForm ? styles.overlay : ""} />{" "}
      {/* Add overlay only when form is visible */}
      <div
        className={`${styles.addButtonContainer} ${
          showForm ? styles.hidden : ""
        }`}
      >
        {" "}
        {/* Add hidden class to container when form is visible */}
        <Link to="/job-offers" style={{ textDecoration: "none" }}>
          <button className={styles.addButton} onClick={handleButtonClick}>
            <span className={styles.plusIcon}></span> Add Job Offer
          </button>
        </Link>
        <Link to="/consult-applications" style={{ textDecoration: "none" }}>
          <button className={styles.addButton} style={{ marginLeft: "120px" }}>
            <span className={styles.plusIcon}></span> Consult Applications
          </button>
        </Link>
      </div>
      <div
        className={`${styles.addFormContainer} ${
          showForm ? "" : styles.hidden
        }`}
      >
        {" "}
        {/* Add hidden class to form container when form is not visible */}
        <AddJobForm onClose={handleCloseForm} onSubmit={handleSubmitForm} />
      </div>
    </>
  );
};

export default AddJobButton;
