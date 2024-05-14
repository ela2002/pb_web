import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../../firebase/firebase';
import { useNavigate,Link } from 'react-router-dom';
import styles from './Employees.module.css';
import ClipLoader from "react-spinners/ClipLoader";
import Navbar from "../../../Company/Navbar/Navbar";
import { GrLike, GrDislike } from "react-icons/gr";
import SearchBar from "../../../Company/Employees/SearchBar"

const Employees = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const avatar = "assets/avatar.jpg";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesSnapshot = await getDocs(collection(firestore, 'employeesprofile'));
        if (!profilesSnapshot.empty) {
          const profilesData = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProfiles(profilesData);
        } else {
          console.log('No user profiles found');
        }
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    return () => {};
  }, []);

  const handleRecommend = async (id, recommendCount) => {
    try {
      const employeesprofileRef = doc(firestore, 'employeesprofile', id);
      await updateDoc(employeesprofileRef, { recommend: recommendCount + 1 });
    } catch (error) {
      console.error('Error recommending employee:', error);
    }
  };

  const handleUnrecommend = async (id, unrecommendCount) => {
    try {
      const employeesprofileRef = doc(firestore, 'employeesprofile', id);
      await updateDoc(employeesprofileRef, { Unrecommend: unrecommendCount + 1 });
    } catch (error) {
      console.error('Error unrecommending employee:', error);
    }
  };

  return (
    <div className={styles.profilesSection}>
      <Navbar />
      <SearchBar></SearchBar>
      {loading ? (
        <div className={styles.loading}>
          <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className={styles.profiles}>
          {profiles.map(profile => (
            <div key={profile.id} className={styles.profileCard}>
              <Link className={styles.link} to={`/employeeprofile2/${profile.id}`}><img className={styles.profilePic} src={profile.profilePicture || avatar} alt={`Profile ${profile.id}`} /></Link>
              <div className={styles.profileInfo}>
              <Link className={styles.link} to={`/employeeprofile2/${profile.id}`}> <h3>{profile.fullName}</h3></Link>
                <p>{profile.jobTitle}</p>
                <p className={styles.recommend}><GrLike />{profile.recommend || 0}</p>
                <p className={styles.unrecommend}><GrDislike /> {profile.Unrecommend || 0}</p>
                <p>{profile.bio}</p>
              </div>
              <div className={styles.buttons}>
                <button className={styles.consultButton} onClick={() => handleRecommend(profile.id, profile.recommend || 0)}>Recommend</button>
                <button className={styles.sendMessageButton} onClick={() => handleUnrecommend(profile.id, profile.Unrecommend || 0)}>Unrecommend</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees;
