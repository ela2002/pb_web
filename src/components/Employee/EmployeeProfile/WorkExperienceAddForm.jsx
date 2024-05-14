import React, { useState} from "react";
import styles from "./AddForm.module.css";

const WorkExperienceAddForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    duration: "",
    description: "",
    tags: "",
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
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
    const formValues = {
      ...formData,
      tags: tagsArray,
    };
    onSubmit(formValues);
    onClose();
  };

  return (
    <div className={styles.addFormContainer}>
      <div className={styles.scrollWrapper}>
        <form className={styles.addForm} onSubmit={handleSubmit}>
          <h2>Add Work Experience</h2>
          <label className={styles.addFormLabel}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.addFormInput}
          />
          <label className={styles.addFormLabel}>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
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
          <button type="submit" className={styles.addFormButton}>Add</button>
          <button type="button" onClick={onClose} className={styles.addFormButton}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default WorkExperienceAddForm;
