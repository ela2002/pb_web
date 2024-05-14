import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../../../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './EmployeeProfile.module.css';
import Navbar from "../../../Company/Navbar/Navbar"
import NavigationBar from '../../../Company/EmployeeProfile/NavigationBar';
import ContentArea from '../../../Company/EmployeeProfile/ContentArea';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyDoc = doc(firestore, 'employeesprofile', id);
        const companySnapshot = await getDoc(companyDoc);
        if (companySnapshot.exists()) {
          setCompany(companySnapshot.data());
        } else {
          console.log('Employee does not exist');
        }
      } catch (error) {
        console.error('Error fetching Employee:', error);
      }
    };

    fetchCompany();
  }, [id]);

  const handleRecommend = async () => {
    try {
      const companyRef = doc(firestore, 'employeesprofile', id);
      await updateDoc(companyRef, { recommendations: company.recommendations + 1 });
    } catch (error) {
      console.error('Error recommending company:', error);
    }
  };

  const handleUnrecommend = async () => {
    try {
      const companyRef = doc(firestore, 'companies', id);
      await updateDoc(companyRef, { unrecommendations: company.unrecommendations + 1 });
    } catch (error) {
      console.error('Error unrecommending company:', error);
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  // Destructure company data
  const { fullName, jobTitle, positionHeld, profilePic, companyName,bio,recommend,Unrecommend} = company;

  return (
    <div className={styles.companyProfile}>
      <Navbar />
      {/* Company Info Section */}
      <div className={styles.companyInfo}>
        <div className={styles.logoContainer}>
          <img src={profilePic} alt={fullName} className={styles.logo} />
        </div>
        <div className={styles.details}>
          <div className={styles.companyHeader}>
            <h2>{fullName}</h2>
            <div className={styles.recommendButtons}>
            
            </div>
          </div>
          <div className={styles.recommendations}>
            <p>Recommend{recommend}</p>
            <p className={styles.unrecommandations}>  Unrecommend {Unrecommend}</p>
          </div>
          <div className='loc_ind_sz'></div>
          <p><strong>JobTitle:</strong> {jobTitle}</p>
          <p><strong>PositionHeld:</strong> {positionHeld}</p>
          <p><strong>CompanyName:</strong> {companyName}</p>
          <p> <strong>Bio:</strong> {bio}</p>
        </div>
      </div>

      {/* Navigation Section */}
      <NavigationBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <ContentArea selectedTab={selectedTab} companyId={id} />
    </div>
  );
};

export default EmployeeProfile;
