import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AppContext/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebase";
import { getDocs, query, collection, where, doc, updateDoc } from "firebase/firestore"; // Updated imports for Firestore functions

import {
  FaComment,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTasks
} from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const avatar = "/assets/avatar.jpg";
  const { signOutUser, user } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState("");
  const [showLinks, setShowLinks] = useState(false); // State for toggling links

  const [ employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("uid", "==", user.uid)));
          if (!employeeQuerySnapshot.empty) {
            employeeQuerySnapshot.forEach((doc) => {
              setEmployeeData({ ...doc.data(), id: doc.id }); // Include document ID in employeeData
            });
          } else {
            console.error("Employee data not found for UID:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      } else {
        setEmployeeData(null);
        console.log("User not authenticated");
      }
    });
  
    return () => {
      authStateChanged(); // Call the unsubscribe function
    };
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName.split(" ")[0]);
    }
  }, [user]);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <span className={styles.logoFull}>PowerBack</span>
          <span className={styles.logoMobile}>PB</span>
        </div>
      </Link>
       {/*  <div className={styles.search}> 
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search" className={styles.input} />
      </div> */} 
      <div className={styles.mobileIcon} onClick={() => setShowLinks(!showLinks)}>
        <FaBars />
      </div>
      <ul className={`${styles.navLinks} ${showLinks ? styles.show : ''}`}>
        <li>
          <Link to="/insightzone"> Insightzone </Link>
        </li>
        <li>
          <Link to="/community">Community</Link>
        </li>
        <li>
          <Link to="/job-opportunities">Jobs</Link>
        </li>
        <li>
          <Link to="/companies">Companies</Link>
        </li>
      </ul>
      <div className={styles.icons}>
        <Link to="/chat" className={styles.iconLink}>
          <FaComment className={styles.chatIcon} />
        </Link>
        
        <Link to="/employeeprofile" className={styles.iconLink}>
          <div className={styles.profileCircle}>
            <img
              src={employeeData?.profilePicture || avatar}
              alt="Profile"
              className={styles.profilePic}
            />
            <div className={styles.dropdownContent}>
              <Link to="/employeeprofile" className={styles.dropdownItem}>
                <FaUser className={styles.dropdownIcon} />
                {employeeData?.fullName||"Employee"} Profile
              </Link>
              <Link to="/applications" className={styles.dropdownItem}>
                <FaTasks className={styles.dropdownIcon} />
                Job Applications
              </Link>
              <Link className={styles.dropdownItem} onClick={signOutUser}>
                <FaSignOutAlt className={styles.dropdownIcon} />
                Logout
              </Link>
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
