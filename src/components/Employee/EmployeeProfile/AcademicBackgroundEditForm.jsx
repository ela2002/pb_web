import React, { useState, useEffect } from "react";
import styles from "./AddForm.module.css";

const AcademicBackgroundEditForm = ({ onClose, onSubmit,initialFormData }) => {
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
      <h2>Add academic background</h2>
      <label className={styles.addFormLabel}>Degree</label>
      <input
        type="text"
        name="degree"
        value={formData.degree}
        onChange={handleChange}
        className={styles.addFormInput}
        
      />
      <label className={styles.addFormLabel}>Institution</label>
      <input
        type="text"
        name="institution"
        value={formData.institution}
        onChange={handleChange}
        className={styles.addFormInput}
        
      />
      <label className={styles.addFormLabel}>Duration</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
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
      <label className={styles.addFormLabel}>Tags (comma separated)</label>
      <input
        type="text"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        className={styles.addFormInput}
      />
      <button type="submit" className={styles.addFormButton}>Update</button>
      <button type="button" onClick={onClose} className={styles.addFormButton}>Close</button>
    </form>
  );
};

export default AcademicBackgroundEditForm;
