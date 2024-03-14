import React, { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../Context/firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import OrderFormModal from "../Orders/OrderFormModal";

const Input = () => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [isUploading, setIsUploading] = useState(false);
  const isBusiness = currentUser?.role === "hirer"; // Assuming 'role' is how you differentiate users
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const uploadFile = async (file) => {
    const fileExtension = file.name.split(".").pop();
    const storageRef = ref(storage, `files/${uuid()}.${fileExtension}`);
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
    return {
      url: downloadURL,
      type: file.type.startsWith("image/") ? "image" : "pdf",
      name: file.name,
    };
  };

  const sendMessage = async (chatId, message, recipientId) => {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion(message),
      lastMessage: message,
      updatedAt: serverTimestamp(),
    });
  };

  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;

    if (!data.chatId) {
      console.error("Chat ID is not set.");
      return;
    }

    let uploadedFilesData = [];
    if (files.length) {
      setIsUploading(true);

      try {
        uploadedFilesData = await Promise.all(
          files.map((file) => uploadFile(file))
        );
      } catch (error) {
        console.error("Error uploading files: ", error);
        setIsUploading(false);

        return;
      }
      setIsUploading(false);
    }

    const messageId = uuid();
    const messageData = {
      id: messageId,
      text,
      senderId: currentUser.uid,
      attachments: uploadedFilesData,
    };

    await sendMessage(data.chatId, messageData, data.user?.uid, data.user);

    setText("");
    setFiles([]);
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  return (
    <div className="input">
      <div className="place-order-chat">
        {isBusiness && (
          <button onClick={openOrderModal} className="placeOrderButton">
            Place Order
          </button>
        )}
      </div>
      <OrderFormModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />
      <div className="file-preview">
        {files.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        value={text}
      />
      {isUploading && <div>Upload in progress, please wait...</div>}{" "}
      <div className="send">
        <input
          type="file"
          accept=".png,.pdf"
          multiple
          style={{ display: "none" }}
          id="fileInput"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <label htmlFor="fileInput">
          <FontAwesomeIcon
            icon={faPaperclip}
            style={{ color: "#040039" }}
            size="xl"
          />
        </label>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
