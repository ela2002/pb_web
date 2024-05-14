import React, { useState } from "react";
import styles from "./AddForm.module.css";

const LanguagesAddForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    language: "",
    proficiency: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass formData directly to onSubmit
    onClose();
  };

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h2>Add Language</h2>
      <label className={styles.addFormLabel}>Language</label>
      <input
        type="text"
        name="language"
        value={formData.language}
        onChange={handleChange}
        className={styles.addFormInput}
      />
      <label className={styles.addFormLabel}>Proficiency</label>
      <input
        type="text"
        name="proficiency"
        value={formData.proficiency}
        onChange={handleChange}
        className={styles.addFormInput}
      />
      <button type="submit" className={styles.addFormButton}>Add</button>
      <button type="button" onClick={onClose} className={styles.addFormButton}>Close</button>
    </form>
  );
};

export default LanguagesAddForm;
