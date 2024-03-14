import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import { useFetchUsersSnapshot } from "../User/Hooks";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const users = useFetchUsersSnapshot();
  

  useEffect(() => {
    // Add a listener for the other user's data when the component mounts
    const unsubscribe = addUserListener(otherUserId);

    // Clean up the listener when the component unmounts
    return () => removeUserListener(otherUserId, unsubscribe);
  }, [otherUserId]);

  // Now you can use otherUserData in your component, and it will
  // always be up to date.

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const updatedChats = docSnapshot.data();
            // Here you might need to map over the chats and update them with the latest user information
            const chatsWithUpdatedUserInfo = Object.entries(updatedChats).map(
              ([chatId, chatData]) => {
                const userInfo = users.find(
                  (user) => user.uid === chatData.userInfo.uid
                );
                return {
                  [chatId]: {
                    ...chatData,
                    userInfo: userInfo || chatData.userInfo, // Fallback to existing data if not found
                  },
                };
              }
            );
            setChats(chatsWithUpdatedUserInfo);
          } else {
            console.log("No such document!");
          }
        }
      );

      return () => {
        unsub();
      };
    }
  }, [currentUser.uid, users]); // Include `users` in the dependency array



  const handleSelect = (u) => {
    dispatch({
      type: "CHANGE_USER",
      payload: {
        ...u, // This should include uid, userName, imgUrl, and userType if available
        userType: u.userType || "defaultType", // Add 'defaultType' or the appropriate default
      },
    });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map(([chatId, otherUserData]) => (
          <div
            className="userChat"
            key={chatId}
            onClick={() => handleSelect(otherUserData.userInfo)}
          >
            <img src={otherUserData.userInfo.imgUrl} alt="" />
            <div className="userChatInfo">
              <span>{otherUserData.userInfo.userName}</span>
              <p>{otherUserData.lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
