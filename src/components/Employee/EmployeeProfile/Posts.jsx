import React, { useState, useRef, useEffect } from "react";
import { doc, setDoc, collection, serverTimestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "./Posts.module.css";
import PostCard from "../Insightzone/PostCard";

const Posts = ({ employeeData }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [progressBar, setProgressBar] = useState(0);
  const [posts, setPosts] = useState([]);
  const textRef = useRef("");
  const [image, setImage] = useState(null);

  const collectionRef = collection(firestore, "posts");

  
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collectionRef, where("uid", "==", employeeData?.uid)),
      (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(newPosts);
      }
    );
    return unsubscribe;
  }, [employeeData?.uid]);

  return (
    <div className={styles.container}>
                  
      <div className={styles.postContainer}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            profilePicture={post.profilePicture}
            id={post.id}
            uid={post.uid}
            fullName={post.fullName}
            jobTitle={post.jobTitle}
            email={post.email}
            image={post.image}
            text={post.text}
            timestamp={new Date(post.timestamp?.toDate())?.toUTCString()}
          />
        ))}
      </div>
    </div>
  );
};

export default Posts;
