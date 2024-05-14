// Details.jsx
import React, { useRef, useState, useEffect, useContext } from 'react';
import WorkExperiences from './WorkExperiences';
import AcademicBackground from './AcademicBackground';
import Projects from './Projects';
import Languages from './Languages';
import Certifications from './Certifications';
import Interests from './Interests';
import styles from "./Details.module.css"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from '../../../AppContext/AppContext';

const Details = ({ employeeData }) => {
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext); // Access user data from authentication context
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    if (user) {
      fetchResumeUrl(employeeData); // Fetch resume URL when user data is available
    }
  }, [user, employeeData]);

  // Function to fetch resume URL from Firebase Storage
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

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setResumeFile(file);

    try {
      const storage = getStorage();
      const resumeRef = ref(storage, `resumes/${employeeData.uid}/resume.pdf`);
      const uploadTask = uploadBytesResumable(resumeRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progress updates during upload
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgressBar(progress);
        },
        (error) => {
          // Error handling during upload
          console.error('Error uploading resume:', error);
        },
        () => {
          // Upload complete, fetch the URL and update state
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setResumeUrl(downloadURL);
          });
        }
      );
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  const handleDownloadClick = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <div>
      <WorkExperiences employeeData={employeeData} />
      <AcademicBackground employeeData={employeeData}/>
      <Projects employeeData={employeeData}/>
      <Languages employeeData={employeeData}/>
      <Certifications employeeData={employeeData}/>
      <Interests employeeData={employeeData}/>
      <section className={styles.resumeUploadSection}>
        <button className={styles.uploadButton} onClick={handleUploadClick}>
          Upload Resume
        </button>
        <input
          type="file"
          id="resumeUpload"
          className={styles.fileInput}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </section>
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
