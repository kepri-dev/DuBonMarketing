import React, { useState, useEffect, useContext, useRef } from "react";
import { db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const StartConversation = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    if (!lowerCaseSearchTerm.trim()) {
      setSearchedUsers([]);
      return;
    }

    try {
      // Define both queries
      const userNameQuery = query(
        collection(db, "newusers"),
        where("userName", "==", searchTerm)
      );
      const userNameLowerQuery = query(
        collection(db, "newusers"),
        where("userNameLower", ">=", lowerCaseSearchTerm),
        where("userNameLower", "<=", lowerCaseSearchTerm + "\uf8ff")
      );
      const userNameQuerySnapshot = await getDocs(userNameQuery);
      const userNameLowerQuerySnapshot = await getDocs(userNameLowerQuery);
      const usersList = {};
      userNameQuerySnapshot.forEach((doc) => {
        usersList[doc.id] = doc.data();
      });
      userNameLowerQuerySnapshot.forEach((doc) => {
        usersList[doc.id] = doc.data();
      });

      // Set the combined results to state
      setSearchedUsers(Object.values(usersList));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchUsers(searchTerm);
    } else {
      setSearchedUsers([]);
    }
  }, [searchTerm]);

  const handleStartConversation = (selectedUser) => {
    const newChatId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    dispatch({
      type: "CHANGE_CONVERSATION",
      payload: {
        chatId: newChatId,
        user: selectedUser,
      },
    });

    const chatDocRef = doc(db, "chats", newChatId);

    getDoc(chatDocRef)
      .then((docSnapshot) => {
        if (!docSnapshot.exists()) {
          setDoc(chatDocRef, {
            messages: [],
            sender: {
              uid: currentUser.uid,
              userName: currentUser.userName,
              imgUrl: currentUser.imgUrl,
            },
            recipient: {
              uid: selectedUser.uid,
              userName: selectedUser.userName,
              imgUrl: selectedUser.imgUrl,
            },
            lastMessage: {},
            updatedAt: new Date(),
            userIds: [currentUser.uid, selectedUser.uid],
          })
            .then(() => {
              console.log("New chat document created in Firestore");
            })
            .catch((error) => {
              console.error("Error creating new chat document:", error);
            });
        } else {
          console.log("Chat document already exists in Firestore");
        }
        navigate(`/messages/${newChatId}`);
      })
      .catch((error) => {
        console.error("Error checking chat document:", error);
      });
    setSearchTerm("");
  };

  return (
    <div className="searchUser">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />
      <div className="searchResults">
        {searchedUsers.map((user) => (
          <div
            key={user.uid}
            onClick={() => handleStartConversation(user)}
            className="userItem"
          >
            {user.userName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartConversation;
