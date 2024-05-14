// Details.jsx
import React, { useRef, useState, useEffect, useContext } from 'react';
import WorkExperiences from './WorkExperiences';
import AcademicBackground from './AcademicBackground';
import Projects from './Projects';
import Languages from './Languages';
import Certifications from './Certifications';
import Interests from './Interests';
import styles from "./Details.module.css"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

const Details = ({ employeeData , id }) => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workExperiencesRef = collection(firestore,`employeesprofile/${id}/workExperiences`);
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

  useEffect(() => {
    if (employeeData) {
      fetchResumeUrl(employeeData); 
    }
  }, [ employeeData]);

  const fetchResumeUrl = async (employeeData) => {
    try {
      const storage = getStorage();
      const resumeRef = ref(storage, `resumes/${employeeData.uid}/resume.pdf`); // Store resume in folder based on user ID
      const url = await getDownloadURL(resumeRef);
      setResumeUrl(url);
    } catch (error) {
      // Handle case when resume does not exist for the user
      console.error('Error fetching resume:', error);
    }
  };


  const handleDownloadClick = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <div>
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
      <AcademicBackground employeeData={employeeData}/>
      <Projects employeeData={employeeData}/>
      <Languages employeeData={employeeData}/>
      <Certifications employeeData={employeeData}/>
      <Interests employeeData={employeeData}/>
      
      {resumeUrl && (
        <section className={styles.resumeSection}>
          <h2>Resume</h2>
          <button className={styles.downloadButton} onClick={handleDownloadClick}>
            Download Resume
          </button>
        </section>
      )}
    </div>
  );
};

export default Details;
