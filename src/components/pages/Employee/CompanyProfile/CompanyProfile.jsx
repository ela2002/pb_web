import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../../../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './CompanyProfile.module.css';
import Navbar from "../../../Employee/Navbar/Navbar";
import NavigationBar from '../../../Employee/CompanyProfile/NavigationBar';
import ContentArea from '../../../Employee/CompanyProfile/ContentArea';
import StarRating from '../../../Employee/Companies/StarRating';
import ClipLoader from "react-spinners/ClipLoader";

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const companyDoc = doc(firestore, 'companiesprofile', id);
        const companySnapshot = await getDoc(companyDoc);
        if (companySnapshot.exists()) {
          setCompany(companySnapshot.data());
        } else {
          console.log('Company does not exist');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company:', error);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleRecommend = async () => {
    try {
      const companyRef = doc(firestore, 'companiesprofile', id);
      await updateDoc(companyRef, { recommended: company.recommended + 1 });
      setCompany(prevCompany => ({ ...prevCompany, recommended: prevCompany.recommended + 1 }));
    } catch (error) {
      console.error('Error recommending company:', error);
    }
  };

  const handleUnrecommend = async () => {
    try {
      const companyRef = doc(firestore, 'companiesprofile', id);
      await updateDoc(companyRef, { unrecommended: company.unrecommended + 1 });
      setCompany(prevCompany => ({ ...prevCompany, unrecommended: prevCompany.unrecommended + 1 }));
    } catch (error) {
      console.error('Error unrecommending company:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
      </div>
    );
  }

  const { companyName, globalRating, recommended, unrecommended, location, companySize, industry, description, profilePic } = company;

  return (
    <div className={styles.companyProfile}>
      <Navbar />
      <div className={styles.companyInfo}>
        <div className={styles.logoContainer}>
          <img src={profilePic} alt={companyName} className={styles.logo} />
        </div>
        <div className={styles.details}>
          <div className={styles.companyHeader}>
            <h2>{companyName}</h2>
            <div className={styles.recommendButtons}>
              <button className={styles.recommendButton} onClick={handleRecommend}>
                Recommend
              </button>
              <button className={styles.unrecommendButton} onClick={handleUnrecommend}>
                Unrecommend
              </button>
            </div>
          </div>
          <div className={styles.rating}>
            <StarRating rating={globalRating} />
          </div>
          <div className={styles.recommendations}>
            <p>Recommendations: {recommended}</p>
            <p className={styles.unrecommendations}>Unrecommendations: {unrecommended}</p>
          </div>
          <div className='loc_ind_sz'></div>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Industry:</strong> {industry}</p>
          <p><strong>Size:</strong> {companySize}</p>
        </div>
      </div>
      <NavigationBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <ContentArea selectedTab={selectedTab} companyId={id} company={company} />
    </div>
  );
};

export default CompanyProfile;
