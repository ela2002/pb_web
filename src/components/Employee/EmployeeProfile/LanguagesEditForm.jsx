import React, { useState, useEffect } from "react";
import styles from "./AddForm.module.css";

const LanguagesEditForm = ({ onClose, onSubmit,initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure formData.tags is always a string
    const tagsArray = typeof formData.tags === 'string' ? formData.tags.split(",").map((tag) => tag.trim()) : [];
    const formValues = {
      ...formData,
      tags: tagsArray,
    };
    onSubmit(formValues);
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
      <button type="submit" className={styles.addFormButton}>Update</button>
      <button type="button" onClick={onClose} className={styles.addFormButton}>Close</button>
    </form>
  );
};

export default LanguagesEditForm;
