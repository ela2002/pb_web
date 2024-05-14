import React, { useState, useEffect } from "react";
import styles from "./companyprofile1.module.css";
import { PiBag } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { Link } from "react-router-dom";
import StepContent from "../StepContent2";
import { LuPhone } from "react-icons/lu";
import profilee from "../../../../../images/profilee.png";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { getAuth } from "firebase/auth";
import { firestore } from "../../../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, addDoc, collection, updateDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const CompanyProfile1 = () => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    address: "",
    phoneNumber: "",
    website: "",
    profilePicture: "",
  });
  const [profilePicture1, setProfilePicture1] = useState(null);
  const navigate = useNavigate();

  const [documentId, setDocumentId] = useState("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          // Get the document ID dynamically
          setDocumentId(auth.currentUser.uid);
          const docRef = doc(
            firestore,
            "companiesprofile",
            auth.currentUser.uid
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCompanyInfo(data);
          } else {
            console.error("Company profile does not exist for this user.");
          }
        } else {
          console.error("User is not authenticated.");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture1(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const companyData = {
          // Populate companyData with the form fields
        };

        // Create a profile document with the filled attributes
        await addDoc(collection(firestore, "companiesprofile"), companyData);

        // Update the user's profile with profile completion status
        await updateDoc(doc(firestore, "users", userId), {
          profileCompleted: true,
        });

        console.log("Company profile created successfully");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error creating company profile:", error);
    }
  };

  const uploadProfilePicture = async (file, userId) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    try {
      await uploadBytesResumable(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return "";
    }
  };
  return (
    <div className={styles.profileback}>
      <div className={styles.profileDetailsContainer}>
        <StepContent />
        <br />
        <div className={styles.topbuttons}>
          <Link to={"/signin"}>
            <button className={styles.topLeftButton}>
              <GrFormPreviousLink />
              Back
            </button>
          </Link>
          {/* Removed the link wrapping the button */}
          <button
            type="submit"
            form="companyForm"
            className={styles.topRightButton}
          >
            Next <GrFormNextLink />
          </button>
        </div>
        <div className={styles.profileContent}>
          <h2
            className={styles.title}
            style={{ marginLeft: "200px", color: "#7D55C7", fontSize: "24px" }}
          >
            Company Details
          </h2>
          {/* Added id to the form for Next button submission */}
          <form
            id="companyForm"
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div className={styles.profilePictureContainer}>
              <input
                type="file"
                id="profilePicture"
                onChange={handleProfilePictureChange}
              />
              <img
                src={
                  profilePicture1
                    ? URL.createObjectURL(profilePicture1)
                    : profilee
                }
                alt="Profile"
                className={styles.profilePicture}
              />{" "}
              <br />
              <label htmlFor="profilePicture" className={styles.uploadLabel}>
                {" "}
                Upload Profile Picture:
              </label>
            </div>
            <br />
            <div className={styles.formGroup}>
              <label htmlFor="companyName" className={styles.label}>
                {" "}
                <PiBag />
                Company Name:
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyInfo.companyName}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <br />
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                {" "}
                <BsBuildings />
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={companyInfo.address}
                onChange={handleChange}
                className={styles.input}
                style={{ marginLeft: "52px" }}
              />
            </div>
            <br />
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                <LuPhone />
                Phone Number:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={companyInfo.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                style={{ marginLeft: "9px" }}
              />
            </div>

            <br />
            <div className={styles.formGroup}>
              <label htmlFor="website" className={styles.label}>
                <HiMiniComputerDesktop />
                Website:
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={companyInfo.website}
                onChange={handleChange}
                className={styles.input}
                style={{ marginLeft: "52px" }}
              />
            </div>
            <Link to={"/Serviceorproduct"}>
              <button className={styles.bottomRightButton}>
                Next <GrFormNextLink />
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile1;
