import { useEffect, useState } from "react";
import styles from "./jobOffers.module.css";
import Navbar from "../../../Company/Navbar/Navbar";
import AddJobButton from "../../../Company/joboffers/addjobbutton/addjobbutton";
import JobCard from "../../../Company/joboffers/jobcard/jobcard";
import EditJobModal from "../../../Company/joboffers/editjobmodal/editjobmodal";
import ClipLoader from "react-spinners/ClipLoader"; // Import the ClipLoader component
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { firestore, auth } from "../../../../firebase/firebase";

const JobOffers = () => {
  const [jobs, setJobs] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true); // Add loading state for jobs

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUserUid = user.uid;
        setCompanyId(currentUserUid);
        fetchJobs(currentUserUid);
      } else {
        setCompanyId("");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchJobs = async (companyId) => {
    try {
      const jobsCollection = collection(firestore, "jobs");
      const jobsSnapshot = await getDocs(jobsCollection);
      const jobsData = jobsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((job) => job.companyId === companyId);
      setJobs(jobsData);
      setLoadingJobs(false); // Set loading state to false after fetching jobs
    } catch (error) {
      console.error("Error fetching jobs from Firestore:", error);
    }
  };


  const handleDeleteJob = async (job) => {
    try {
      // Delete the job document from Firestore
      await deleteDoc(doc(firestore, "jobs", job.id));
      // Remove the deleted job from the state
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedJob(null);
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      // Update the job document in Firestore
      await updateDoc(doc(firestore, "jobs", updatedJob.id), updatedJob);
      // Update the job in the state
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      setShowEditModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleAddJob = async (newJob) => {
    try {
      // Add the new job document to Firestore
      const docRef = await addDoc(collection(firestore, "jobs"), newJob);
      // Update the jobs state with the new job
      setJobs((prevJobs) => [...prevJobs, { id: docRef.id, ...newJob }]);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.contentContainer}>
        <div className={styles.addjobbutton}>
          <AddJobButton onAddJob={handleAddJob} />
        </div>
        <div className={styles.jobcard}>
          {loadingJobs ? ( // Render loading spinner when loading jobs
            <div className={styles.loading}>
              <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={handleDeleteJob}
                onEdit={handleEditJob}
              />
            ))
          )}
        </div>
      </div>
      {showEditModal && (
        <EditJobModal
          job={selectedJob}
          onUpdate={handleUpdateJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default JobOffers;