import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";

const Message = ({ message, openImageModal }) => {
  const { currentUser } = useContext(AuthContext);
  const isCurrentUserSender = message.senderId === currentUser.uid;
  const { data } = useContext(ChatContext);

  const ref = useRef();
  const imgUrl = isCurrentUserSender ? currentUser.imgUrl : data.user.imgUrl;
  const userIds = message.userIds || data.userIds; // Example access, adjust based on your actual data structure

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const renderMessageContent = () => {
    if (message.text) {
      return <p>{message.text}</p>;
    }

    return message.attachments?.map((attachment, index) => {
      if (attachment.type === "image") {
        return (
          <img
            src={attachment.url}
            alt={`Attached Image ${index}`}
            key={index}
            onClick={() => openImageModal(attachment.url)}
            className="messageImage"
          />
        );
      } else if (attachment.type === "pdf") {
        return (
          <a
            href={attachment.url}
            target="_blank"
            download={attachment.name}
            key={index}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/test-firebase-9badc.appspot.com/o/images%2Fpdf-icon-4.png?alt=media&token=4319e34d-84a7-4261-822d-3f71f8154589" // Replace with the path to your PDF icon
              alt={`PDF Icon for ${attachment.name}`}
              className="pdfIcon"
              width={200}
              height={200}
            />{" "}
          </a>
        );
      }
      return null;
    });
  };

  return (
    <div ref={ref} className={`message ${isCurrentUserSender ? "owner" : ""}`}>
      {currentUser.uid !== data.user.uid && (
        <div className="messageInfo">
          <img src={imgUrl} alt="Profile" className="profilePic" />
        </div>
      )}

      <div className="messageContent"> {renderMessageContent()}</div>
    </div>
  );
};

export default Message;
