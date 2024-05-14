import React, { useState, useEffect } from "react";
import styles from "./AddForm.module.css";

const CertificationsEditForm = ({ onClose, onSubmit, initialFormData }) => {
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
      <h2>Add a new certification </h2>
      <label className={styles.addFormLabel}>Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className={styles.addFormInput}
      />
      <label className={styles.addFormLabel}>Organization</label>
      <input
        type="text"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        className={styles.addFormInput}
      />
      <label className={styles.addFormLabel}>Date</label>
      <input
        type="text"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className={styles.addFormInput}
      />
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

export default CertificationsEditForm;
