import React, { useState } from "react";
import styles from "./editjobmodal.module.css";

const EditJobModal = ({ job, onUpdate, onClose }) => {
  const [updatedJob, setUpdatedJob] = useState({ ...job });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleRequirementChange = (e, index) => {
    const newRequirements = [...updatedJob.requirements];
    newRequirements[index] = e.target.value;
    setUpdatedJob((prevJob) => ({
      ...prevJob,
      requirements: newRequirements,
    }));
  };

  const handleRemoveRequirement = (index) => {
    const newRequirements = [...updatedJob.requirements];
    newRequirements.splice(index, 1);
    setUpdatedJob((prevJob) => ({
      ...prevJob,
      requirements: newRequirements,
    }));
  };

  const handleAddRequirement = () => {
    const newRequirements = [...updatedJob.requirements, ""];
    setUpdatedJob((prevJob) => ({
      ...prevJob,
      requirements: newRequirements,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedJob);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2 className={styles.title}>Edit Job</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className={styles.label}>Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedJob.title}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="description" className={styles.label}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={updatedJob.description}
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
          <label htmlFor="location" className={styles.label}>Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={updatedJob.location}
            onChange={handleChange}
            className={styles.input}
          />
          {/* Requirements */}
          <div className={styles.requirements}>
            <label htmlFor="requirements" className={styles.label}>Requirements:</label>
            {updatedJob.requirements.map((requirement, index) => (
              <div key={index} className={styles.requirementItem}>
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleRequirementChange(e, index)}
                  className={styles.input}
                />
                <button onClick={() => handleRemoveRequirement(index)} className={styles.removeButton}>Remove</button>
              </div>
            ))}
            <button onClick={handleAddRequirement} className={styles.addButton}>Add <br/> Requirement</button>
          </div>

          <button type="submit" className={styles.button}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
