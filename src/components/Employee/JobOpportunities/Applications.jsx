import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './Applications.module.css';
import Navbar from '../Navbar/Navbar';
import ClipLoader from "react-spinners/ClipLoader";

const Applications = () => {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const applicationsRef = collection(firestore, 'applications');
                const querySnapshot = await getDocs(query(applicationsRef, where('userId', '==', user.uid)));
                const fetchedApplications = [];
                querySnapshot.forEach(doc => {
                    fetchedApplications.push({ id: doc.id, ...doc.data() });
                });
                setApplications(fetchedApplications);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className={styles.applicationsContainer}>
            <Navbar />
            <h1 className={styles.title}>My Applications</h1>
            {loading ? (
                <div className={styles.loading}>
                    <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
                </div>
            ) : applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <div className={styles.applicationGrid}>
                    {applications.map((item) => (
                        <div key={item.id} className={styles.applicationBox}>
                            <div className={styles.header}>
                                <img src={item.companyPic} className={styles.companyLogo} alt="Company Logo" />
                                <div className={styles.headerText}>
                                    <h2 className={styles.jobTitle}>{item.jobTitle}</h2>
                                    <p className={styles.companyName}>{item.companyName}</p>
                                    <p className={styles.status}>Status: {item.status}</p> {/* Display application status */}
                                </div>
                            </div>
                            <p className={styles.appliedAt}>Applied At: {new Date(item.appliedAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;
