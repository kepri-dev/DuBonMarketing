import React, { useState, useEffect, useContext } from "react";
import { getDoc, doc } from "firebase/firestore";
import "./Header.css";
import logo from "./logo-3.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeart,
  faEnvelope,
  faArrowRightFromBracket,
  faUserPen,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { db, auth } from "../../Context/firebase";

function Header() {
  const navigate = useNavigate();
  const { currentUser: authUser } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (authUser && authUser.uid) {
      const newUserRef = doc(db, "newusers", authUser.uid);
      const businessUserRef = doc(db, "business", authUser.uid);

      getDoc(newUserRef).then((newUserDoc) => {
        if (newUserDoc.exists()) {
          setCurrentUser({ ...newUserDoc.data(), uid: authUser.uid });
        } else {
          getDoc(businessUserRef).then((businessUserDoc) => {
            if (businessUserDoc.exists()) {
              setCurrentUser({ ...businessUserDoc.data(), uid: authUser.uid });
            } else {
              console.log("User not found in any collection.");
              setCurrentUser(null);
            }
          });
        }
      });
    } else {
      setCurrentUser(null);
    }
  }, [authUser, db]);

  const [loggedIn, setLoggedIn] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn("Log Out");
      } else {
        setLoggedIn("Log In");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("signed out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.log("sign out error", error);
      });
  };

  const handleClickMessages = () => {
    navigate("/messages");
  };

  return (
    <header className="header">
      <div className="navigation">
        {/* Logo Section */}
        <div className="logo-section">
          <img
            src={logo}
            alt="Logo"
            className="logo-png"
            onClick={() => {
              navigate("");
            }}
          />
        </div>
        {/* Nav1 Section */}
        <nav className="navbar-1">
          {" "}
          {currentUser &&
            (currentUser.role === "hirer" ||
              currentUser.role === "For Brands") && (
              <ul>
                <li>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: "#040039" }}
                  />{" "}
                  <a className="link" href="/profils">
                    Browse Profiles
                  </a>
                </li>
                <li>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ color: "#040039" }}
                  />{" "}
                  <a className="link" href="/messages">
                    Messages
                  </a>
                </li>

                <li>
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ color: "#040039" }}
                  />{" "}
                  <a className="link" href="/favorites">
                    Favorites
                  </a>
                </li>

                <li>
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    style={{ color: "#040039" }}
                  />{" "}
                  <a className="link" href="/orders">
                    Orders
                  </a>
                </li>
              </ul>
            )}
          {currentUser &&
            (currentUser.role === "contentCreator" ||
              currentUser.role === "For Creators") && (
              <ul>
                <li>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: "#040039" }}
                  />{" "}
                  <a className="link" href="/profils">
                    Browse Profiles
                  </a>
                </li>
                <li>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ color: "#040039" }}
                  />{" "}
                  <a className="link" onClick={handleClickMessages}>
                    Messages
                  </a>
                </li>

                <li>
                  <FontAwesomeIcon
                    icon={faUserPen}
                    style={{ color: "#040039" }}
                  />
                  <a className="link" href="/dashboard-creator">
                    My Profile
                  </a>
                </li>
              </ul>
            )}
        </nav>

        {/* Nav2 Section */}
        <nav className="navbar-2">
          {" "}
          <ul>
            {currentUser && (
              <li>
                <img src={currentUser.imgUrl} alt="Profile" />
              </li>
            )}
            <a className="link" href="/account">
              {currentUser?.userName}
            </a>
            <li>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                style={{ color: "#040039" }}
              />{" "}
              <a className="link" onClick={handleLogOut}>
                {loggedIn}{" "}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
