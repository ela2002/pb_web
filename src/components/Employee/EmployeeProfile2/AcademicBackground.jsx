import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

const AcademicBackground = ({ employeeData }) => {
  const [academicBackground, setAcademicBackground] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (employeeData && employeeData.id) { // Check if employeeData exists and has an id property
          const academicBackgroundRef = collection(firestore, "employeesprofile", employeeData.id, "academicBackground");
          const querySnapshot = await getDocs(academicBackgroundRef);
          const fetchedAcademicBackground = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAcademicBackground(fetchedAcademicBackground);
        }
      } catch (error) {
        console.error("Error fetching academic background: ", error);
      }
    };

    fetchData();
  }, [employeeData]);

  return (
    <section className={`${styles.section} ${styles.shadow}`}>
      <h2>Academic Background</h2>
      {academicBackground.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.degree}</p>
            <p>{entry.institution}</p>
            <p>{entry.duration}</p>
            <div className={styles.tags}>
              {entry.tags.map((tag, tagIndex) => (
                <span key={tagIndex}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
       <div className={styles.entry}>
      </div>
    </section>
  );
};

export default AcademicBackground;
