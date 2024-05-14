import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import styles from "./Details.module.css";
import LanguagesAddForm from "./LanguagesAddForm";
import LanguagesEditForm from "./LanguagesEditForm";

const Languages = ({ employeeData }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesRef = collection(firestore, "employeesprofile", employeeData.id, "languages");
        const querySnapshot = await getDocs(languagesRef);
        const fetchedlanguages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLanguages(fetchedlanguages);
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
      formData.formType = "Language";
      const sectionRef = collection(firestore, "employeesprofile", employeeData.id, "languages");
      await addDoc(sectionRef, formData);
      const updatedData = await fetchDataFromCollection(sectionRef);
      setLanguages(updatedData);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEdit = async (id) => {
    const languageToEdit = languages.find((exp) => exp.id === id);
    setEditId(id);
    setEditFormData(languageToEdit);
    setShowAddForm(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const sectionDocRef = doc(firestore, "employeesprofile", employeeData.id, "languages", editId);
      await updateDoc(sectionDocRef, formData);
      const updatedData = await fetchDataFromCollection(collection(firestore, "employeesprofile", employeeData.id, "languages"));
      setLanguages(updatedData);
      setShowAddForm(false); // Close the edit form after successful update
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const sectionDocRef = doc(firestore, "employeesprofile", employeeData.id, "languages", id);
      await deleteDoc(sectionDocRef);
      const updatedData = await fetchDataFromCollection(collection(firestore, "employeesprofile", employeeData.id, "languages"));
      setLanguages(updatedData);
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
      <h2>Languages</h2>
      {languages.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.language}</p>
            <p>{entry.proficiency}</p>
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
          <FaPlus /> Add Language
        </button>
        {showAddForm && (
          <div className={styles.overlay}>
            <div className={styles.addFormContainer}>
              {editId ? (
                <LanguagesEditForm onClose={handleAddFormClose} onSubmit={handleUpdate} initialFormData={editFormData} />
              ) : (
                <LanguagesAddForm onClose={handleAddFormClose} onSubmit={handleAdd} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Languages;
