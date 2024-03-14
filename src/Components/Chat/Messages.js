import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { db } from "../../Context/firebase";
import Message from "./Message";
import ImageModal from "./ImageModal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComments } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

const Messages = ({ userId, user }) => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [messages, setMessages] = useState([]);
  const [conversationData, setConversationData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const openImageModal = (imageUrl) => {
    console.log("Opening image modal for:", imageUrl);
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (data.chatId && currentUser?.uid) {
      const chatDocRef = doc(db, "chats", data.chatId);

      const unSubChat = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const newMessages = docSnapshot.data().messages.slice(-50);
          setMessages(newMessages);
          setConversationData(docSnapshot.data());
        } else {
          console.error("Chat document not found:", chatId);
        }
      });

      const userDocRef = doc(db, "newusers", currentUser.uid);
      const unSubUser = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          dispatch({
            type: "UPDATE_USER_DATA",
            payload: {
              ...docSnapshot.data(),
              uid: currentUser.uid,
            },
          });
        } else {
          console.error("User document not found:", currentUser.uid);
        }
      });

      return () => {
        unSubChat();
        unSubUser();
      };
    }
  }, [chatId, currentUser?.uid, dispatch]);

  return (
    <div>
      <div className="conversationHeader">
        <img src={data.user?.imgUrl} alt="Profile" />
        <span>{data.user?.userName}</span>
        <button onClick={() => navigate(`/profile/${data.user?.uid}`)}>
          View Profile
        </button>
      </div>
      <div className="messagesContainer">
        {messages.length > 0 ? (
          messages.map((m) => (
            <Message
              message={m}
              key={m.id}
              conversationData={conversationData}
              openImageModal={openImageModal}
            />
          ))
        ) : (
          <div className="messagesContainer-nomessages">
            <FontAwesomeIcon
              icon={faComments}
              size="2xl"
              style={{ color: "#040039" }}
              className="icon-container-comments"
            />{" "}
            <p>
              {" "}
              Start the conversation by introducing your project to{" "}
              {data.user?.userName} with a proposal, or send them a message.{" "}
            </p>{" "}
          </div>
        )}
      </div>
      {isModalOpen && (
        <ImageModal imageUrl={currentImage} onClose={closeModal} />
      )}
    </div>
  );
};

export default Messages;
