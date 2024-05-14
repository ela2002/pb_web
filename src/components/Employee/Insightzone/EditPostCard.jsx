import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import styles from "./EditPostCard.module.css";

const EditPostCard = ({ postId, initialText, initialImage, closeEdit }) => {
  const [text, setText] = useState(initialText);
  const [image, setImage] = useState(initialImage);
  const [file, setFile] = useState(null);

  const handleSave = async () => {
    try {
        
      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, { text, image });
      closeEdit(); 
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className={styles.editPostCard}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.textarea}
      />
      <div className={styles.imageContainer}>
        <img src={image} alt="Post" className={styles.image} />
        <label className={styles.imageInputLabel}>
            <span>Change Image</span>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.imageInput}
            />
            </label>
      </div>
      <button onClick={handleSave} className={styles.saveButton}>
        Save
      </button>
    </div>
  );
};

export default EditPostCard;
