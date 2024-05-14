import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import styles from "./Details.module.css";


const Interests = ({ employeeData }) => {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interestsRef = collection(firestore, "employeesprofile", employeeData.id, "interests");
        const querySnapshot = await getDocs(interestsRef);
        const fetchedinterests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setInterests(fetchedinterests);
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
      <h2>Interests</h2>
      {interests.map((entry, index) => (
        <div className={styles.entry} key={entry.id}>
          <div>
            <p>{entry.title}</p>
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

export default Interests;
