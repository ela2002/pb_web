import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import styles from "./Details.module.css";

const Certifications = ({ employeeData }) => {
  const [certifications, setCertifications] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificationsRef = collection(firestore, "employeesprofile", employeeData.id, "certifications");
        const querySnapshot = await getDocs(certificationsRef);
        const fetchedcertifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCertifications(fetchedcertifications);
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
      <h2>Certifications</h2>
      {certifications.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.title}</p>
            <p>{entry.organization}</p>
            <p>{entry.date}</p>
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

export default Certifications;
