import { createContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userDetails;

        const businessDoc = await getDoc(doc(db, "business", user.uid));
        if (businessDoc.exists()) {
          userDetails = businessDoc.data();
        } else {
          const newUserDoc = await getDoc(doc(db, "newusers", user.uid));
          if (newUserDoc.exists()) {
            userDetails = newUserDoc.data();
          }
        }

        if (userDetails) {
          setCurrentUser({ ...user, ...userDetails });
        } else {
          console.error("User details not found in both collections");
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateUserInContext = (newDetails) => {
    setCurrentUser((prevState) => ({ ...prevState, ...newDetails }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
};
