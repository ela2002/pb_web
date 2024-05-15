import React, { useState, useEffect } from "react";
import Navbar from "../../../Employee/Navbar/Navbar";
import ProfileHeader from "../../../Employee/EmployeeProfile2/ProfileHeader";
import NavigationBar from "../../../Employee/EmployeeProfile2/NavigationBar";
import ContentArea from "../../../Employee/EmployeeProfile2/ContentArea";
import styles from "./EmployeeProfile2.module.css";
import { useParams } from 'react-router-dom';
import { firestore } from '../../../../firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import ClipLoader from "react-spinners/ClipLoader";

const EmployeeProfile2 = () => {
  const { id } = useParams(); 
  const [employeeData, setEmployeeData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(true); 

  useEffect(() => {
    const fetchemployeeData = async () => {
      try {
        setLoading(true); 
        const userDocRef = doc(firestore, 'employeesprofile', id); 
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setEmployeeData(userDocSnapshot.data());
          setUserExists(true);
        } else {
          console.log('User does not exist');
          setUserExists(false); 
        }
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false); 
      }
    };
    fetchemployeeData();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>
            <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
          </div>
        ) : (
          <>
            {userExists ? ( 
              <>
                <ProfileHeader employeeData={employeeData} />
                <NavigationBar
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
                <ContentArea selectedTab={selectedTab} id={id} employeeData={employeeData} />
              </>
            ) : (
              <div>User does not exist</div> 
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EmployeeProfile2;
