// Navbar.js
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
  FaBars, // Hamburger menu icon
} from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const avatar = "/assets/avatar.jpg";
  const { signOutUser, user, userData } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState("");
  const [showLinks, setShowLinks] = useState(false); // State for toggling links

  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const companyQuerySnapshot = await getDocs(query(collection(firestore, "companiesprofile"), where("uid", "==", user.uid)));
          if (!companyQuerySnapshot.empty) {
            companyQuerySnapshot.forEach((doc) => {
              setCompanyData({ ...doc.data(), id: doc.id }); // Include document ID in companyData
            });
          } else {
            console.error("Company data not found for UID:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      } else {
        setCompanyData(null);
        console.log("User not authenticated");
      }
    });
  
    return () => {
      authStateChanged(); // Call the unsubscribe function
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link to="/dashboard" className={styles.logoLink}>
        <div className={styles.logo}>
          <span className={styles.logoFull} style={{ fontfamily: 'sans-serif', fontsize: '250px', fontweight: 'bold', color: '#8172E8',textdecoration: 'none'}}>PowerBack</span>
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
      {/* Render links conditionally based on showLinks state */}
      <ul className={`${styles.navLinks} ${showLinks ? styles.show : ''}`}>
        <li>
          <Link to="/dashboard">Dashboard </Link>
        </li>
       
        <li>
          <Link to="/job-offers">Jobs Offers</Link>
        </li>
        <li>
          <Link to="/employees">Employees</Link>
        </li>
      </ul>
      {/* Render other icons */}
      <div className={styles.icons}>
      
        <Link to="/companyprofile" className={styles.iconLink}>
          <div className={styles.profileCircle}>
            <img
              src={companyData?.profilePic || avatar}
              alt="Profile"
              className={styles.profilePic}
            />
            <div className={styles.dropdownContent}>
              <Link to="/companyprofile" className={styles.dropdownItem}>
                <FaUser className={styles.dropdownIcon} />
                  {companyData?.fullName||"Company"} Profile
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
