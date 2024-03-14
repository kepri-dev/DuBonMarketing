import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.imgUrl} alt="" />
        <span>{currentUser.userName}</span>
      </div>
    </div>
  );
};

export default Navbar;
