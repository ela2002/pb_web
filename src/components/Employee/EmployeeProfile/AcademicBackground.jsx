import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import styles from "./Details.module.css";
import AcademicBackgroundAddForm from "./AcademicBackgroundAddForm";
import AcademicBackgroundEditForm from "./AcademicBackgroundEditForm";

const AcademicBackground = ({ employeeData }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [academicBackground, setAcademicBackground] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const academicBackgroundRef = collection(firestore, "employeesprofile", employeeData.id, "academicBackground");
        const querySnapshot = await getDocs(academicBackgroundRef);
        const fetchedacademicBackground = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAcademicBackground(fetchedacademicBackground);
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
      formData.formType = "AcademicBackground";
      const sectionRef = collection(firestore, "employeesprofile", employeeData.id, "academicBackground");
      await addDoc(sectionRef, formData);
      const updatedData = await fetchDataFromCollection(sectionRef);
      setAcademicBackground(updatedData);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEdit = async (id) => {
    const AcademicBackgroundToEdit = academicBackground.find((exp) => exp.id === id);
    setEditId(id);
    setEditFormData(AcademicBackgroundToEdit);
    setShowAddForm(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const sectionDocRef = doc(firestore, "employeesprofile", employeeData.id, "academicBackground", editId);
      await updateDoc(sectionDocRef, formData);
      const updatedData = await fetchDataFromCollection(collection(firestore, "employeesprofile", employeeData.id, "academicBackground"));
      setAcademicBackground(updatedData);
      setShowAddForm(false); // Close the edit form after successful update
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const sectionDocRef = doc(firestore, "employeesprofile", employeeData.id, "academicBackground", id);
      await deleteDoc(sectionDocRef);
      const updatedData = await fetchDataFromCollection(collection(firestore, "employeesprofile", employeeData.id, "academicBackground"));
      setAcademicBackground(updatedData);
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
      <h2>Academic Background</h2>
      {academicBackground.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.degree}</p>
            <p>{entry.institution}</p>
            <p>{entry.duration}</p>
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
          <FaPlus /> Add Experience
        </button>
      {showAddForm && (
          <div className={styles.overlay}>
            <div className={styles.addFormContainer}>
              {editId ? (
                <AcademicBackgroundEditForm onClose={handleAddFormClose} onSubmit={handleUpdate} initialFormData={editFormData} />
              ) : (
                <AcademicBackgroundAddForm onClose={handleAddFormClose} onSubmit={handleAdd} />
              )}
            </div>
          </div>
        )}
        </div>  
    </section>
  );
};

export default AcademicBackground;
