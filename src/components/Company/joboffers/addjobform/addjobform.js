import React, { useState } from "react";
import styles from "./addjobform.module.css";
import { firestore } from "../../../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const AddJobForm = ({ onClose, formData: initialFormData, formType }) => {
  const [formData, setFormData] = useState(
    initialFormData || {
      companyId: "",
      title: "",
      description: "",
      location: "",
      postedDate: "",
      requirements: "",
      Salary: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requirementsArray = formData.requirements
      .split(",")
      .map((requirement) => requirement.trim());

    // Retrieve the authenticated user's information
    const auth = getAuth();
    const user = auth.currentUser;
    const companyId = user ? user.uid : ""; // Assuming company ID is stored in the user's UID

    // Generate the current date
    const currentDate = serverTimestamp();

    const formValues = {
      companyId: companyId,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      postedDate: currentDate,
      requirements: requirementsArray,
      Salary: formData.Salary,
    };

    try {
      await addDoc(collection(firestore, "jobs"), formValues);
      onClose(); // Close the form after successful submission
      // Reset the form inputs
      setFormData({
        companyId: "",
        description: "",
        location: "",
        postedDate: "",
        requirements: "",
        Salary: 0,
        title: "",
      });
    } catch (error) {
      console.error("Error adding job offer:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className={styles.addFormContainer}>
      <div className={styles.scrollWrapper}>
        <form className={styles.addForm} onSubmit={handleSubmit}>
          <h2>Job Form</h2>
          <label className={styles.addFormLabel}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.addFormInput}
          />
          <label className={styles.addFormLabel}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.addFormInput}
          ></textarea>
          <label className={styles.addFormLabel}>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.addFormInput}
          />

          <label className={styles.addFormLabel}>
            Requirements (comma separated)
          </label>
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className={styles.addFormInput}
          />
          <label className={styles.addFormLabel}> Salary</label>
          <input
            type="text"
            name="Salary"
            value={formData.Salary}
            onChange={handleChange}
            className={styles.addFormInput}
          />
          <button type="submit" className={styles.addFormButton}>
            {initialFormData ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.addFormButton}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;
