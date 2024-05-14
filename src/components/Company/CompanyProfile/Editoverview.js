import React, { useState } from "react";
import styles from "./Editoverview.module.css";

const EditOverview = ({ companyData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: companyData.description,
    phoneNumber: companyData.phoneNumber
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass the updated form data to the onSave function
  };
  

  return (
    <div className={styles.container}>
      <h2>Edit Overview</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label htmlFor="description" className={styles.label}>
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="phoneNumber" className={styles.label}>
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOverview;

