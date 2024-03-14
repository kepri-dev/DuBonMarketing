// UsersList.js
import React, { useContext } from "react";
import { ChatContext } from "./ChatContext";
import "./userslist.css";

const UsersList = ({ users = [] }) => {
  const { dispatch } = useContext(ChatContext);

  const handleSelectUser = (user) => {
    if (!user.uid) {
      console.error("Selected user does not have a valid UID.");
      return;
    }
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="users-list">
      {users.map((user) => (
        <div
          key={user.uid}
          onClick={() => handleSelectUser(user)}
          className="user-item"
        >
          {user.userName}
        </div>
      ))}
    </div>
  );
};

export default UsersList;
