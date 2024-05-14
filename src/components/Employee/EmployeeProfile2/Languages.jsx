import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import styles from "./Details.module.css";


const Languages = ({ employeeData }) => {
  const [languages, setLanguages] = useState([]);


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

 

  return (
    <section className={`${styles.section} ${styles.shadow}`}>
      <h2>Languages</h2>
      {languages.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.language}</p>
            <p>{entry.proficiency}</p>
          </div>
          
        </div>
      ))}
       <div className={styles.entry}>
      </div>
    </section>
  );
};

export default Languages;
