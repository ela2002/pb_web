import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import ProjectsAddForm from "./ProjectsAddForm";
import ProjectsEditForm from "./ProjectsEditForm";

const Projects = ({ employeeData }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null); // Track the ID of the project being edited
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRef = collection(firestore, "employeesprofile", employeeData.id, "projects");
        const querySnapshot = await getDocs(projectsRef);
        const fetchedprojects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProjects(fetchedprojects);
      } catch (error) {
        console.error("Error fetching work experiences: ", error);
      }
    };

    if (employeeData) {
      fetchData();
    }
  }, [employeeData]);

  const fetchDataFromCollection = async (collectionRef) => {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const handleAdd = async (formData) => {
    try {
      formData.formType = "project";
      const sectionRef = collection(firestore, "employeesprofile", employeeData.id, "projects");
      await addDoc(sectionRef, formData);
      const updatedData = await fetchDataFromCollection(sectionRef);
      setProjects(updatedData);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEdit = async (id) => {
    const projectToEdit = projects.find((exp) => exp.id === id);
    setEditId(id);
    setEditFormData(projectToEdit);
    setShowAddForm(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const sectionDocRef = doc(firestore, "employeesprofile", employeeData.id, "projects", editId);
      await updateDoc(sectionDocRef, formData);
      const updatedData = await fetchDataFromCollection(collection(firestore, "employeesprofile", employeeData.id, "projects"));
      setProjects(updatedData);
      setShowAddForm(false); // Close the edit form after successful update
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const sectionDocRef = doc(firestore, "employeesprofile", employeeData.id, "projects", id);
      await deleteDoc(sectionDocRef);
      const updatedData = await fetchDataFromCollection(collection(firestore, "employeesprofile", employeeData.id, "projects"));
      setProjects(updatedData);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const toggleDropdown = (index) => {
    setDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleAddButtonClick = () => {
    setShowAddForm(true);
    setEditId(null);
    setEditFormData(null);
  };

  const handleAddFormClose = () => {
    setShowAddForm(false);
    setEditId(null);
    setEditFormData(null);
  };
  return (
    <section className={`${styles.section} ${styles.shadow}`}>
      <h2>Projects</h2>
      {projects.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.title}</p>
            <p>{entry.description}</p>
            <div className={styles.tags}>
              {entry.tags.map((tag, tagIndex) => (
                <span key={tagIndex}>{tag}</span>
              ))}
            </div>
          </div>
          <div className={styles.optionsContainer}>
            <button className={styles.optionsButton} onClick={() => toggleDropdown(index)}>
              <FaEllipsisV />
            </button>
            {dropdownIndex === index && (
              <div className={styles.optionsDropdown}>
                <button onClick={() => handleEdit(entry.id)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className={styles.entry}>
        <button onClick={handleAddButtonClick} className={styles.addButton}>
          <FaPlus /> Add Project
        </button>
        {showAddForm && (
          <div className={styles.overlay}>
            <div className={styles.addFormContainer}>
              {editId ? (
                <ProjectsEditForm onClose={handleAddFormClose} onSubmit={handleUpdate} initialFormData={editFormData} />
              ) : (
                <ProjectsAddForm onClose={handleAddFormClose} onSubmit={handleAdd} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
