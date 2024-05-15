import React, { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import PostCard from "../Insightzone/PostCard";
import styles from "./Saved.module.css";
import ClipLoader from "react-spinners/ClipLoader";

const Saved = ({ employeeData }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchSavedPosts = async () => {
    try {
      const savedPosts = [];
  
      const postsQuerySnapshot = await getDocs(collection(firestore, "posts"));
  
      for (const postDoc of postsQuerySnapshot.docs) {
        const savesCollectionRef = collection(postDoc.ref, "saves");
  
        const saveDocSnapshot = await getDoc(doc(savesCollectionRef, employeeData?.uid));
  
        if (saveDocSnapshot.exists()) {
          savedPosts.push({ id: postDoc.id, ...postDoc.data() });
        }
      }
  
      setSavedPosts(savedPosts);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  };
  
  useEffect(() => {
    fetchSavedPosts(); // Move fetchSavedPosts into useEffect to ensure it runs after component mounts
  }, []); // Empty dependency array to run only once

  return (
    <div className={styles.content}>
      <h2>Saved Content</h2>
      {loading ? ( // Render spinner if loading
        <div className={styles.spinner}>
            <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        savedPosts.length === 0 ? (
          <p>You haven't saved any content yet.</p>
        ) : (
          <div>
            {savedPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                profilePicture={post.profilePicture}
                uid={post.uid}
                fullName={post.fullName}
                jobTitle={post.jobTitle}
                image={post.image}
                text={post.text}
                timestamp={post.timestamp}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Saved;
