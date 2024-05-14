import React, { useState, useRef, useEffect } from "react";
import { doc, setDoc, collection, serverTimestamp, getDocs,query,where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import { getStorage,getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; 
import styles from "./AddPostCard.module.css";
import {  FaTimes } from "react-icons/fa";

const AddPostCard = ({ closeAddPostCard, cardRef }) => {
    const text = useRef("");
    const scrollRef = useRef(null);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [progressBar, setProgressBar] = useState(0);
    const collectionRef = collection(firestore, "posts");

    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                closeAddPostCard();
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
                        setProgressBar(progress);
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

    return (
        <div className={styles.addPostCardOverlay}>
            <div className={styles.addPostCard} ref={cardRef}>
                <button className={styles.closeButton} onClick={closeAddPostCard}>
                    <FaTimes />
                </button>
                <div className={styles.scrollContainer}>
                    <form onSubmit={handleSubmitPost}>
                        <textarea
                            placeholder="Write your post..."
                            className={styles.textarea}
                            ref={text}
                        ></textarea>
                        <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
                            <img className={styles.imageIcon} src="assets/addImage.png" alt="addImage" />
                            <input
                                type="file"
                                accept="image/*"
                                id="imageUpload"
                                className={styles.imageUploadInput}
                                onChange={handleUpload}
                            />
                        </label>
                        <span
                            style={{ width: `${progressBar}%` }}
                            className={styles.progressBar}
                        ></span>
                        {file && (
                            <button onClick={submitImage} className={styles.button}>
                                Upload
                            </button>
                        )}
                        {image && (
                            <img
                                className={styles.previewImage}
                                src={image}
                                alt="previewImage"
                            />
                        )}
                        <button type="submit" className={styles.postButton}>Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPostCard;
