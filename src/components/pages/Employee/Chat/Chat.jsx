import React, { useState, useEffect, useContext } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { getDocs, doc, getDoc } from "firebase/firestore";

import { firestore,auth } from '../../../../firebase/firebase';
import styles from './Chat.module.css';
import Navbar from "../../../Employee/Navbar/Navbar";
import ClipLoader from "react-spinners/ClipLoader"; // Import the loading spinner

const Chat = () => {
  const [employeeData, setEmployeeData] = useState(null);

  const avatar="assets/avatar.jpg"
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatrooms, setChatrooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const employeeQuerySnapshot = await getDocs(query(collection(firestore, "employeesprofile"), where("uid", "==", user.uid)));
          if (!employeeQuerySnapshot.empty) {
            // Since we are fetching the data of the currently logged-in user,
            // we can directly access the first document in the snapshot
            const employeeDoc = employeeQuerySnapshot.docs[0];
            setEmployeeData({ ...employeeDoc.data(), id: employeeDoc.id });
          } else {
            console.error("Employee data not found for UID:", user.uid);
            setEmployeeData(null); // Set employeeData to null if no documents are found
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      } else {
        setEmployeeData(null);
        setLoading(false); // Set loading to false if user is not authenticated
        console.log("User not authenticated");
      }
    });

    // Unsubscribe from the auth state listener when component unmounts
    return () => {
      authStateChanged();
    };
  }, []);
  
  useEffect(() => {
    if (employeeData) {
      const unsubscribeUsers = onSnapshot(collection(firestore, 'employeesprofile'), (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Fetch chatrooms that the user has joined
      const chatroomsRef = collection(firestore, 'chatrooms');
      const chatroomsQuery = query(chatroomsRef, where('participants', 'array-contains', employeeData.uid));
      const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
        setChatrooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false); // Set loading to false after fetching chatrooms
      });

      return () => {
        unsubscribeUsers();
        unsubscribeChatrooms();
      };
    }
  }, [employeeData]);

  useEffect(() => {
    const results = users.filter(employeeData =>
      employeeData.fullName && employeeData.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, users]);

  useEffect(() => {
    // Check if selectedFriend exists and update chatId accordingly
    if (employeeData && selectedFriend) {
      // Logic for individual chat
      const participants = [employeeData.uid, selectedFriend.uid].sort().join('_');
      const chatRef = collection(firestore, 'chats');
      const chatQuery = query(chatRef, where('participants', '==', participants));
      
      const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
        if (!snapshot.empty) {
          const chatDoc = snapshot.docs[0];
          setChatId(chatDoc.id);
  
          const messagesRef = collection(chatDoc.ref, 'messages');
          const messagesQuery = query(messagesRef, orderBy('timestamp'));
          const unsubscribeMessages = onSnapshot(messagesQuery, (messagesSnapshot) => {
            const newMessages = messagesSnapshot.docs.map(doc => doc.data());
            setMessages(newMessages);
          });
        } else {
          const newChatRef = addDoc(chatRef, { participants });
          setChatId(newChatRef.id);
        }
      });
  
      return () => {
        unsubscribeChat();
      };
    } else if (selectedChatroom) {
      // Logic for chatroom
      const chatroomId = selectedChatroom.id;
      const messagesRef = collection(firestore, 'chatrooms', chatroomId, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp'));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => doc.data());
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [employeeData, selectedFriend, selectedChatroom]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    if (selectedChatroom) {
      // Sending message to a chatroom
      await addDoc(collection(firestore, 'chatrooms', selectedChatroom.id, 'messages'), {
        senderId: employeeData.uid,
        text: newMessage,
        timestamp: serverTimestamp()
      });
    } else if (selectedFriend) {
      // Sending message to an individual chat
      if (!chatId) return; // Return if chatId is not available
      await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
        senderId: employeeData.uid,
        text: newMessage,
        timestamp: serverTimestamp()
      });
    }
  
    setNewMessage('');
  };

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
    setSelectedChatroom(null); // Reset selected chatroom when selecting a friend
  };

  const selectChatroom = (chatroom) => {
    setSelectedChatroom(chatroom);
    setSelectedFriend(null); // Reset selected friend when selecting a chatroom
  };

  return (
    <div className={styles.chatContainer}>
      <Navbar />
      {loading ? ( // Conditionally render loading spinner
        <div className={styles.loading}>
          <ClipLoader color="#B69FEB" size={50} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className={styles.sidebar}>
          <h1>Chat</h1>
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBar}
          />
           <div className={styles.scrollableContent}> 
          <div>
            <h3>Friends</h3>
            <ul className={styles.userList}>
              {searchResults.map((usr) => (
                <li key={usr.id} onClick={() => selectFriend(usr)} className={selectedFriend && selectedFriend.id === usr.id ? styles.selected : ''}>
                  <img src={usr.profilePicture || avatar} alt="pic" className={styles.profilePic} />
                  <span>{usr.fullName}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Chatrooms</h3>
            <ul className={styles.chatroomList}>
            {chatrooms.map((chatroom) => (
              <li key={chatroom.id} onClick={() => selectChatroom(chatroom)} className={selectedChatroom && selectedChatroom.id === chatroom.id ? styles.selected : ''}>
                <img src={chatroom.image} alt="Chatroom Pic" className={styles.profilePic} />
                <span>{chatroom.name}</span>
              </li>
            ))}
            </ul>
          </div>
          </div>
        </div>
      )}
      {!loading && ( // Conditionally render chat section after loading
  <div className={styles.chatSection}>
    {messages.length === 0 && ( // Render welcoming message if there are no messages
      <div className={styles.welcomeMessage}>
        <p className={styles.welcomeTitle}>Welcome to the Chat!</p>
        <p className={styles.welcomeSubtitle}>Start the conversation by typing a message below.</p>
      </div>
    )}
    <div className={styles.messagesContainer}>
      {messages.map((msg, index) => (
        <div key={index} className={msg.senderId === employeeData.uid ? styles.sentMessage : styles.receivedMessage}>
          <img src={msg.senderId === employeeData.uid ? employeeData.profilePicture || avatar : (selectedFriend ? selectedFriend.profilePicture || avatar : '')} alt="Profile" className={styles.messageProfilePic} />
          <span className={styles.messageText}>{msg.text}</span>
        </div>
      ))}
    </div>
    <div className={styles.inputArea}>
      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={styles.messageInput} placeholder="Type your message here..." />
      <button onClick={sendMessage} className={styles.sendButton}>Send</button>
    </div>
  </div>
)}


    </div>
  );
};

export default Chat;
