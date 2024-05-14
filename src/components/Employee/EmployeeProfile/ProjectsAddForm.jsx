import React, { useState } from "react";
import styles from "./AddForm.module.css";

const ProjectsAddForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
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
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h2>Create a new project</h2>
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
      <label className={styles.addFormLabel}>Tags (comma separated)</label>
      <input
        type="text"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        className={styles.addFormInput}
      />
      <button type="submit" className={styles.addFormButton}>
        Add
      </button>
      <button type="button" onClick={onClose} className={styles.addFormButton}>
        Close
      </button>
    </form>
  );
};

export default ProjectsAddForm;
