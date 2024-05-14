import React, { useState } from "react";
import styles from "./Mentions.module.css";

const Mentions = () => {
  const [cvFile, setCvFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCvFile(file);
  };

  return (
    <div className={styles.container}>
      <h1>CV Upload</h1>
      <input
        type="file"
        accept=".pdf, .doc, .docx"
        onChange={handleFileChange}
      />
      {cvFile && (
        <div className={styles.cvPreview}>
          <p>Selected CV: {cvFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default Mentions;
