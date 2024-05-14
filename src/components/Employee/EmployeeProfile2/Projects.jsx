import React, { useState, useEffect } from "react";
import styles from "./Details.module.css";
import { collection, getDocs} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";


const Projects = ({ employeeData }) => {
  const [projects, setProjects] = useState([]);
 
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
        </div>
      ))}
       <div className={styles.entry}>
      </div>
    </section>
  );
};

export default Projects;
