import React from "react";
import { useNavigate } from "react-router-dom";

const ConversationHeader = ({ data, currentUser }) => {
  const navigate = useNavigate();
  return (
    <div className="conversationHeader">
      <img src={data.user?.imgUrl} alt="Profile" />
      <span>{data.user?.userName}</span>
      {currentUser && currentUser.role === "hirer" && (
        <button onClick={() => navigate(`/profile/${data.user?.uid}`)}>
          View Profile
        </button>
      )}
    </div>
  );
};

export default ConversationHeader;
