import React, { useState, useEffect, useContext } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { firestore, storage } from '../../../firebase/firebase'; // Import storage from firebase
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../AppContext/AppContext';
import { FaTimes } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary storage functions
import { v4 as uuidv4 } from 'uuid';
import ClipLoader from "react-spinners/ClipLoader"; 
import styles from './DiscussionForum.module.css';

const DiscussionForum = () => {
  const { user } = useContext(AuthContext);
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', bio: '', image: 'assets/group.jpg' }); // Initialize with default image
  const [logo, setLogo] = useState(null); // State to store uploaded logo file
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'chatrooms'), (snapshot) => {
      setChatrooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedChatroomId(id);
    }
  }, [id]);

  const handleJoin = async (chatroomId) => {
    try {
      const chatroomRef = collection(firestore, 'chatrooms');
      const docRef = doc(chatroomRef, chatroomId);
      await updateDoc(docRef, {
        participants: arrayUnion(user.uid)
      });
      setSelectedChatroomId(chatroomId);
      navigate(`/chat/${chatroomId}`);
    } catch (error) {
      console.error('Error joining chatroom:', error);
    }
  };

  const handleCreateForum = async () => {
    try {
      // Check if an image is selected, if not, use the default image
      const image = logo ? URL.createObjectURL(logo) : formValues.image;

      // Update formValues with the image and participants attribute
      const updatedFormValues = {
        ...formValues,
        image,
        participants: [user.uid] // Add current user to participants array
      };

      // Add the forum data to Firestore
      await addDoc(collection(firestore, 'chatrooms'), updatedFormValues);
      console.log('Forum created successfully');

      // Clear form fields and logo state
      setFormValues({ name: '', bio: '', image: 'assets/group.jpg' }); // Reset to default image
      setLogo(null);

      // Close the form
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const isUserJoined = (chatroomId) => {
    const joinedChatroom = chatrooms.find(chatroom => chatroom.id === chatroomId);
    return joinedChatroom && joinedChatroom.participants.includes(user.uid);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleLogoChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setLogo(selectedImage);
      setFormValues({ ...formValues, image: URL.createObjectURL(selectedImage) });
    } else {
      setFormValues({ ...formValues, image: 'assets/group.jpg' }); // Use default image
    }
  };

  return (
    <div className={styles.forumSection}>
      <h2 className={styles.title}>Discussion Forum</h2>
      {loading ? (
        <div className={styles.loadingContainer}>
          <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
      <div className={styles.forumList}>
        <div className={styles.forumCard}>
          <img src="assets/add.jpg" alt="" />
          <h3>Create Your Own Discussion Forum</h3>
          <p>Start your own chatroom and invite others to join the discussion!</p>
          <button onClick={() => setShowCreateForm(true)}>Create Forum</button>
        </div>
        {chatrooms.map(chatroom => (
          <div key={chatroom.id} className={styles.forumCard}>
            <img src={chatroom.image} alt={`Forum ${chatroom.id}`} />
            <h3>{chatroom.name}</h3>
            <p>Participants: {chatroom.participants.length}</p>
            <p>{chatroom.bio}</p>
            {isUserJoined(chatroom.id) ? (
              <button disabled>Joined</button>
            ) : (
              <button onClick={() => handleJoin(chatroom.id)}>Join</button>
            )}            
          </div>
        ))}
      </div>
      )}
      {showCreateForm && (
        <div className={styles.overlay}>
          <div className={styles.formContainer}>
            <button className={styles.closeButton} onClick={() => setShowCreateForm(false)}>
              <FaTimes />
            </button>
            <h2>Create Discussion Forum</h2>
            <div className={styles.imageContainer}>
              <img
                src={formValues.image}
                alt="Default Forum Image"
                className={styles.selectedImage}
              />
              <label htmlFor="forumImage" className={styles.imageLabel}>
                Choose Forum Image
              </label>
              <input
                type="file"
                name="image"
                id="forumImage"
                accept="image/*"
                onChange={handleLogoChange}
                className={styles.imageInput}
              />
            </div>
            <label htmlFor="forumName" className={styles.label}>Forum Name</label>
            <input
              type="text"
              name="name"
              id="forumName"
              placeholder="Forum Name"
              className={styles.inputText}
              value={formValues.name}
              onChange={handleChange}
            />
            <label htmlFor="forumBio" className={styles.label}>Forum Description</label>
            <textarea
              name="bio"
              id="forumBio"
              className={styles.textarea}
              placeholder="Forum Description"
              value={formValues.bio}
              onChange={handleChange}
            ></textarea>
            <button onClick={handleCreateForum} className={styles.button}>Create</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;