import React, { useState, useEffect } from "react";
import { doc, collection, query, getDocs,getDoc, updateDoc, arrayUnion, deleteDoc, arrayRemove, onSnapshot,setDoc,where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import styles from "./PostCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faHeart, faBookmark, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditPostCard from "./EditPostCard";

const PostCard = ({ id,profilePicture, uid, fullName, jobTitle, image, text, timestamp }) => {
  const avatar = "/assets/avatar.jpg";

  const [open, setOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [postText, setPostText] = useState(text);
  const [postImage, setPostImage] = useState(image);
  const [saved, setSaved] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("uid", "==", user.uid)));
          if (!employeeQuerySnapshot.empty) {
            const employeeDoc = employeeQuerySnapshot.docs[0];
            setEmployeeData({ ...employeeDoc.data(), id: employeeDoc.id });
          } else {
            console.error("Employee data not found for UID:", user.uid);
            setEmployeeData(null);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setEmployeeData(null);
        setLoading(false);
        console.log("User not authenticated");
      }
    });

    return () => {
      authStateChanged();
    };
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const q = query(collection(firestore, "posts", id, "likes"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const likesData = snapshot.docs.map((doc) => doc.data());
          setLikes(likesData);
          // Check if the current user has liked this post
          const userLiked = likesData.some((like) => like.id === employeeData?.uid);
          setLiked(userLiked);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [id, employeeData?.uid]);


  const timeAgo = (timestamp) => {
    if (!(timestamp instanceof Date)) {
      timestamp = new Date(timestamp);
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + " years ";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " h";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " min";
    return Math.floor(seconds) + " s";
  };

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };


  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const likeRef = doc(firestore, "posts", id, "likes", employeeData?.uid);
      if (!liked) {
        await setDoc(likeRef, { id: employeeData?.uid });
      } else {
        await deleteDoc(likeRef);
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };
  const handleSavePost = async () => {
    try {
      const saveRef = doc(firestore, "posts", id, "saves", employeeData?.uid);
      const saveDocSnapshot = await getDoc(saveRef);

      if (!saved) {
        if (saveDocSnapshot.exists()) {
          // The post is already saved
          setSaved(true);
          return;
        }
        await setDoc(saveRef, { id: employeeData?.uid });
      } else {
        if (!saveDocSnapshot.exists()) {
          // The post is not saved
          setSaved(false);
          return;
        }
        await deleteDoc(saveRef);
      }
      setSaved(!saved);
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };


  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (employeeData?.uid === uid) {
        await deleteDoc(doc(firestore, "posts", id));
      } else {
        alert("You can't delete other users' posts!");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

 

  return (
    <div className={styles.mb4}>
      <div className={styles.cardContainer}>
        <div className={styles.userInfoContainer}>
          <img src={profilePicture || avatar} alt="avatar" className={styles.avatar} />
          <div className={styles.userInfo}>
            <p className={styles.userInfoText}>{fullName}</p>
            <p className={styles.userInfoText}>{jobTitle}</p>
            <p className={styles.userInfoText}>{timeAgo(timestamp)}</p>
          </div>
          {employeeData && employeeData.uid === uid ? (
  <div className={styles.optionsContainer}>
    <button className={styles.optionsButton} onClick={toggleOptions}>
      <FontAwesomeIcon icon={faEllipsisV} />
    </button>
    {showOptions && (
      <div className={styles.dropdown}>
        <>
          <button className={styles.dropdownItem} onClick={toggleEdit}>
            <FontAwesomeIcon icon={faEdit} /> Edit Post
          </button>
          <button className={styles.dropdownItem} onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} /> Delete Post
          </button>
        </>
       
      </div>
    )}
  </div>
) : null}
        </div>
        <div className={styles.textContentContainer}>
          {editing ? (
            <EditPostCard postId={id} initialText={text} initialImage={image} closeEdit={() => setEditing(false)} />
          ) : (
            <div>
              <p className={styles.textContent}>{text}</p>
              <img className={styles.postImage} src={image || ""} alt="" />
            </div>
          )}
        </div>
        <div className={styles.actionButtonsContainer}>
        <button className={`${styles.actionButton} ${liked && styles.liked}`} onClick={handleLike}>
            <FontAwesomeIcon icon={faHeart} /> {likes.length > 0 && likes.length}
          </button>
          <button className={styles.actionButton} onClick={handleSavePost}>
          <FontAwesomeIcon icon={faBookmark} /> {saved ? "Unsave" : "Save"}
        </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
