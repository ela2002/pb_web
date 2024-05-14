import React, { useState } from "react";
import { storage, firestore } from "../../../../firebase/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditProfilePage({ currentUser }) {
  const [username, setUsername] = useState(currentUser.username);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [cvUrl, setCvUrl] = useState(currentUser.cvUrl);
  const [experience, setExperience] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `cv/${currentUser.uid}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setCvUrl(url);
      });
    });
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = doc(firestore, "users", currentUser.uid);
    await updateDoc(userRef, {
      username: username,
      fullName: fullName,
      cvUrl: cvUrl,
      experience: experience,
      jobTitle: jobTitle,
    });
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Full Name:</label>
          <input type="text" value={fullName} onChange={handleFullNameChange} />
        </div>
        <div>
          <label>CV:</label>
          <input type="file" onChange={handleCVUpload} />
        </div>
        <div>
          <label>Experience:</label>
          <textarea value={experience} onChange={handleExperienceChange} />
        </div>
        <div>
          <label>Job Title:</label>
          <input type="text" value={jobTitle} onChange={handleJobTitleChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfilePage;
