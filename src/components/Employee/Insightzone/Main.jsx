import React, { useState, useRef, useEffect } from "react";
import { doc, setDoc, collection, serverTimestamp, query, orderBy, onSnapshot, getDocs, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import necessary Firebase storage functions
import styles from "./Main.module.css";
import PostCard from "./PostCard";

const Main = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]); // State to store posts

  const text = useRef("");
  const scrollRef = useRef(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const collectionRef = collection(firestore, "posts"); // Define collection reference

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

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (text.current.value !== "") {
      try {
        const newPostRef = doc(collectionRef);
        await setDoc(newPostRef, {
          uid: employeeData?.uid || '',
          profilePicture: employeeData?.profilePicture || '',
          fullName: employeeData?.fullName || '',
          jobTitle: employeeData?.jobTitle || '',
          text: text.current.value,
          image: image,
          timestamp: serverTimestamp(),
        });
        text.current.value = "";
      } catch (err) {
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  const storage = getStorage();

  const metadata = {
    contentType: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"],
  };

  const submitImage = async () => {
    const fileType = metadata.contentType.includes(file["type"]);
    if (!file) return;
    if (fileType) {
      try {
        const storageRef = ref(storage, `posts/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);
        await uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          },
          (error) => {
            alert(error);
          },
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImage(downloadURL);
            });
          }
        );
      } catch (err) {
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(firestore, "posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.formContainer}>
          <div className={styles.avatarContainer}>
            {employeeData && <img src={employeeData.profilePicture || "/assets/avatar.jpg"} alt="avatar" className={styles.avatar} />}
          </div>
          <form onSubmit={handleSubmitPost} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="text"
                placeholder={`What's on your mind ${
                  employeeData?.fullName?.split(" ")[0] ||
                  (employeeData?.fullName &&
                    employeeData?.fullName.charAt(0).toUpperCase() + employeeData?.fullName.slice(1))
                }`}
                ref={text}
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                Share
              </button>
            </div>
          </form>
        </div>
        <div className={styles.actionContainer}>
          <div className={styles.actionItem}>
            <label htmlFor="addImage" className={styles.cursorPointer}>
              <img className={styles.addImageIcon} src="assets/addImage.png" alt="addImage" />
              <input
                id="addImage"
                type="file"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
            {file && (
              <button onClick={submitImage} className={styles.button}>
                Upload
              </button>
            )}
            {image && <img className={styles.previewImage} src={image} alt="previewImage" />}
          </div>
        </div>
      </div>

      <div className={styles.postContainer}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {posts.map((post, index) => (
              <div key={index} ref={index === 0 ? scrollRef : null}>
                <PostCard
                 id={post?.id}
                  profilePicture={post?.profilePicture}
                  uid={post?.uid}
                  fullName={post?.fullName}
                  jobTitle={post?.jobTitle}
                  image={post?.image}
                  text={post?.text}
                  timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()}
                  className={highlightedPostId === post?.documentId ? styles.highlightedPost : ""}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
