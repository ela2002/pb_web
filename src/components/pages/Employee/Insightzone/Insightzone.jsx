import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../Employee/Navbar/Navbar";
import Main from "../../../Employee/Insightzone/Main";
import TrendTrack from "../../../Employee/Insightzone/TrendTrack";
import styles from "./Insightzone.module.css";
import AddButton from "../../../Employee/Insightzone/AddButton";
import AddPostCard from "../../../Employee/Insightzone/AddPostCard";
import ClipLoader from "react-spinners/ClipLoader"; // Import the loading spinner

const Insightzone = () => {
  const [showAddPostCard, setShowAddPostCard] = useState(false);
  const cardRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading spinner

  const toggleAddPostCard = () => {
    setShowAddPostCard(!showAddPostCard);
  };

  const handleClickOutside = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setShowAddPostCard(false);
    }
  };

  useEffect(() => {
    if (showAddPostCard) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddPostCard]);

  const closeAddPostCard = () => {
    setShowAddPostCard(false);
  };

  useEffect(() => {
    // Simulating asynchronous data fetching
    const timer = setTimeout(() => {
      setLoading(false);
      // Fetch data and update posts state here
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Run only on component mount

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content_container}>
        <div className={styles.left_section}>
          <AddButton onClick={toggleAddPostCard} />
        </div>
        <div className={styles.middle_section}>
          {loading ? ( // Render loading spinner while fetching data
            <div className={styles.loader}>
              <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
            </div>
          ) : (
            // Render Main component after loading
            <Main posts={posts} />
          )}
        </div>
        <div className={styles.right_section}>
          <TrendTrack />
        </div>
      </div>
      {showAddPostCard && (
        <AddPostCard closeAddPostCard={closeAddPostCard} cardRef={cardRef} />
      )}
    </div>
  );
};

export default Insightzone;
