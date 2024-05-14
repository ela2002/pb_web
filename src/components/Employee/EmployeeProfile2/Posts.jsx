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

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (text !== "") {
      try {
        let imageURL = null;
        if (file) {
          const storage = getStorage();
          const metadata = {
            contentType: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"],
          };
          const storageRef = ref(storage, `images/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgressBar(progress);
            },
            (error) => {
              alert(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setImage(downloadURL);
              // Once image is uploaded, submit the post with the image URL
              submitPostWithImage(downloadURL);
            }
          );
        } else {
          // If no image, submit the post directly
          submitPostWithImage(imageURL);
        }
      } catch (err) {
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  const submitPostWithImage = async (imageURL) => {
    try {
      const newPostRef = doc(collectionRef);
      await setDoc(newPostRef, {
        uid: employeeData?.uid || "",
        profilePicture: employeeData?.profilePicture || "",
        fullName: employeeData?.fullName || "",
        jobTitle: employeeData?.jobTitle || "",
        text: text,
        image: imageURL,
        timestamp: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

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
