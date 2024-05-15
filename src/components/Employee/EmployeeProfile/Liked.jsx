import React, { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import PostCard from "../Insightzone/PostCard";
import styles from "./Liked.module.css";
import ClipLoader from "react-spinners/ClipLoader";

const Liked = ({ employeeData }) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedPosts = async () => {
    try {
      const likedPostsData = [];
  
      const postsQuerySnapshot = await getDocs(collection(firestore, "posts"));
  
      for (const postDoc of postsQuerySnapshot.docs) {
        const likesCollectionRef = collection(postDoc.ref, "likes");
  
        const likeDocSnapshot = await getDoc(doc(likesCollectionRef, employeeData?.uid));
  
        if (likeDocSnapshot.exists()) {
          likedPostsData.push({ id: postDoc.id, ...postDoc.data() });
        }
      }
  
      console.log(likedPostsData);
      setLikedPosts(likedPostsData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };
  
  useEffect(() => {
    if (employeeData?.uid) {
      fetchLikedPosts();
    }
  }, [employeeData?.uid]);

  return (
    <div className={styles.content}>
      <h2 >Liked Posts</h2>
      {loading ? ( // Render spinner if loading
        <div className={styles.spinner}>
            <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        likedPosts.length === 0 ? (
          <p>You haven't liked any content yet.</p>
        ) : (
          <div>
            {likedPosts.map((post) => (
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

export default Liked;
