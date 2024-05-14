import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

const WorkExperiences = ({ employeeData }) => {
  const [workExperiences, setWorkExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workExperiencesRef = collection(firestore,`employeesprofile/${employeeData.id}/workExperiences`);
        const querySnapshot = await getDocs(workExperiencesRef);
        const fetchedWorkExperiences = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWorkExperiences(fetchedWorkExperiences);
      } catch (error) {
        console.error("Error fetching work experiences: ", error);
      }
    };

    if (employeeData) {
      fetchData();
    }
  }, [employeeData]);

  return (
    <section className={`${styles.section} ${styles.shadow}`}>
      <h2>Work Experiences</h2>
      {workExperiences.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.title}</p>
            <p>{entry.company}</p>
            <p>{entry.duration}</p>
            <p>{entry.description}</p>
            <div className={styles.tags}>
              {entry.tags.map((tag, tagIndex) => (
                <span key={tagIndex}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default WorkExperiences;
