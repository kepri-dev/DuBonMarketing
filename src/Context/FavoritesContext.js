// //FavoritesContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "./firebase";
// import { AuthContext } from "./AuthContext";
// import { current } from "@reduxjs/toolkit";

// const FavoritesContext = createContext();

// export const useFavorites = () => useContext(FavoritesContext);

// export const FavoritesProvider = ({ children }) => {
//   const [favorites, setFavorites] = useState({});
//   const [loading, setLoading] = useState(true);
//   const { currentUser } = useContext(AuthContext);
//   const [openFirstDialog, setOpenFirstDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedCollections, setSelectedCollections] = useState(new Set());

//   useEffect(() => {
//     if (!currentUser) {
//       setFavorites({});
//       setLoading(false);
//       return;
//     }
//     const fetchFavorites = async () => {
//       if (!currentUser || !currentUser.uid) {
//         setFavorites({});
//         setLoading(false);
//         return;
//       }
//       const userRef = doc(db, "business", currentUser.uid);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists()) {
//         setFavorites(docSnap.data().favoritesList || {});
//       } else {
//         setFavorites({});
//       }
//       setLoading(false);
//     };

//     fetchFavorites();
//   }, [currentUser]);

//   const handleClickHeart = () => {
//     setOpenFirstDialog(true);
//   };

//   const handleCheckboxChange = (collectionName) => {
//     setSelectedCollections((prev) => {
//       const newSelected = new Set(prev);
//       if (newSelected.has(collectionName)) {
//         newSelected.delete(collectionName);
//       } else {
//         newSelected.add(collectionName);
//       }
//       return newSelected;
//     });
//   };

//   const handleSaveAndClose = async (
//     currentUser,
//     selectedUser,
//     selectedCollections,
//     setCollections,
//     setOpenFirstDialog,
//     setSelectedCollections
//   ) => {
//     if (currentUser && currentUser.uid && selectedUser) {
//       const userRef = doc(db, "business", currentUser.uid);

//       try {
//         const docSnap = await getDoc(userRef);
//         if (!docSnap.exists()) {
//           console.error("Document does not exist");
//           return;
//         }

//         let favoritesData = docSnap.data().favoritesList || {};

//         // Prepare userDetails based on the selectedUser argument
//         const userDetails = {
//           uid: selectedUser?.uid,
//           userName: "Test Name",
//           imgUrl: "Test URL",
//         };

//         // Iterate over each selected collection
//         selectedCollections.forEach((collection) => {
//           // Initialize the collection with an empty array if it doesn't exist
//           if (!favoritesData[collection]) {
//             favoritesData[collection] = [];
//           }

//           // Check if the user is already in the collection
//           const userIndex = favoritesData[collection].findIndex(
//             (u) => u.uid === userDetails.uid
//           );

//           // If the user is not in the collection, add them
//           if (userIndex === -1) {
//             favoritesData[collection].push(userDetails);
//           }
//         });

//         // Update Firestore with the new favorites data
//         await updateDoc(userRef, { favoritesList: favoritesData });

//         // Update local state with the new favorites data
//         setCollections(favoritesData);

//         // Reset selections and close the dialog
//         setSelectedCollections(new Set());
//         setOpenFirstDialog(false);
//       } catch (error) {
//         console.error("Error updating favorites in Firebase: ", error);
//       }
//     }
//   };

//   const addToFavoritesList = async (
//     collectionName,
//     user,
//     currentUser,
//     setCollections
//   ) => {
//     if (currentUser && currentUser.uid) {
//       if (typeof collectionName !== "string" || !collectionName.trim()) {
//         console.error("Collection name must be a non-empty string");
//         return;
//       }

//       const userRef = doc(db, "business", currentUser.uid);
//       try {
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           let favoritesData = docSnap.data().favoritesList || {};

//           // Check if the collection already exists to prevent overwriting
//           if (!favoritesData.hasOwnProperty(collectionName)) {
//             // Add the new collection as an empty array
//             favoritesData[collectionName] = [];

//             // Update the document with the modified favoritesList
//             await updateDoc(userRef, { favoritesList: favoritesData });

//             setCollections(favoritesData); // Update local state to reflect the new structure
//             console.log("New list created:", collectionName);
//           } else {
//             console.log("The list already exists:", collectionName);
//           }
//         } else {
//           console.error("User document does not exist.");
//         }
//       } catch (error) {
//         console.error("Error creating new list in Firebase: ", error);
//       }
//     }
//   };
//   const removeFromFavorites = async (collectionName, userId) => {
//     if (!collectionName.trim() || !currentUser || !userId) return;

//     const userRef = doc(db, "business", currentUser.uid);
//     try {
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists()) {
//         let userData = docSnap.data();
//         let favoritesData = userData.favoritesList || {};

//         if (
//           favoritesData[collectionName] &&
//           favoritesData[collectionName].length > 0
//         ) {
//           // Filter out the user to remove
//           favoritesData[collectionName] = favoritesData[collectionName].filter(
//             (user) => user.uid !== userId
//           );

//           // Update Firestore
//           await updateDoc(userRef, { favoritesList: favoritesData });

//           // Update local state
//           setFavorites(favoritesData);
//         }
//       }
//     } catch (error) {
//       console.error("Error removing from favorites:", error);
//     }
//   };

//   return (
//     <FavoritesContext.Provider
//       value={{
//         favorites,
//         loading,
//         setLoading,
//         openFirstDialog,
//         setOpenFirstDialog,
//         selectedUser,
//         selectedCollections,
//         setFavorites,
//         handleClickHeart,
//         handleCheckboxChange,
//         handleSaveAndClose,
//         addToFavoritesList,
//         removeFromFavorites,
//       }}
//     >
//       {children}
//     </FavoritesContext.Provider>
//   );
// };
