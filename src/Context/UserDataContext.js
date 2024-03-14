// UserDataContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const UserDataContext = createContext();

export const useUserData = (userId) => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context[userId]; 
};

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  const addUserListener = (userId) => {
    if (userData[userId] === undefined) { 
      const unsubscribe = onSnapshot(doc(db, 'newusers', userId), (doc) => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          [userId]: doc.data(),
        }));
      });

      
      return unsubscribe;
    }
  };

  const removeUserListener = (userId, unsubscribe) => {
    unsubscribe();
    setUserData((prevUserData) => {
      const newUserData = { ...prevUserData };
      delete newUserData[userId]; 
      return newUserData;
    });
  };

  const contextValue = {
    userData,
    addUserListener,
    removeUserListener,
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};


