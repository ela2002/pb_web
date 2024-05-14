import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore, auth } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom'; 
import styles from './ProfilesSection.module.css';
import ClipLoader from "react-spinners/ClipLoader"; 
import { GrLike, GrDislike } from "react-icons/gr";

const ProfilesSection = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 
  const avatar = "assets/avatar.jpg";

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("uid", "==", user.uid)));
          if (!employeeQuerySnapshot.empty) {
            // Since we are fetching the data of the currently logged-in user,
            // we can directly access the first document in the snapshot
            const employeeDoc = employeeQuerySnapshot.docs[0];
            setEmployeeData({ ...employeeDoc.data(), id: employeeDoc.id });
          } else {
            console.error("Employee data not found for UID:", user.uid);
            setEmployeeData(null); // Set employeeData to null if no documents are found
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      } else {
        setEmployeeData(null);
        setLoading(false); // Set loading to false if user is not authenticated
        console.log("User not authenticated");
      }
    });

    // Unsubscribe from the auth state listener when component unmounts
    return () => {
      authStateChanged();
    };
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (!employeeData || !employeeData.industry) {
          console.error('User industry not available');
          return;
        }
        //, where("industry", "==", employeeData.industry)

        const profilesSnapshot = await getDocs(query(collection(firestore, 'employeesprofile')));
        if (!profilesSnapshot.empty) {
          const profilesData = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const filteredProfiles = profilesData.filter(profile => profile.id !== employeeData?.id);
          setProfiles(filteredProfiles);
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
  }, [employeeData]);

  const openProfile = (userId) => {
    navigate(`/employeeprofile2/${userId}`);
  };

  const startChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className={styles.profilesSection}>
      <h2>Discover Potential Connections</h2>
      {loading ? (
        <div className={styles.loading}>
          <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className={styles.profiles}>
          {profiles.map(profile => (
            <div key={profile.id} className={styles.profileCard}>
              <img className={styles.profilePic} src={profile.profilePicture || avatar} alt={`Profile ${profile.id}`} />
              <div className={styles.profileInfo}>
                <h3>{profile.fullName}</h3>
                <p>{profile.jobTitle}</p>
                <p>{profile.industry}</p>
                <p className={styles.recommend}><GrLike />{profile.recommend || 0}</p>
                <p className={styles.unrecommend}><GrDislike /> {profile.Unrecommend || 0}</p>
                <p>{profile.bio}</p>
              </div>
              <div className={styles.buttons}>
                {/* Button to open user's profile */}
                <button className={styles.consultButton} onClick={() => openProfile(profile.id)}>Discover</button>
                <button className={styles.sendMessageButton} onClick={() => startChat(profile.id)}>Network</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilesSection;
