import React, { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import "./Favorites.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";

export default function Favorites() {
  const { currentUser } = useContext(AuthContext);
  const [collections, setCollections] = useState({});
  const [favoritesList, setFavoritesList] = useState({}); // State to store the favorites list
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const fetchFavoritesData = async () => {
      if (
        currentUser &&
        (currentUser.role === "hirer" || currentUser.role === "For Brands")
      ) {
        try {
          const docSnap = await getDoc(doc(db, "business", currentUser.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFavoritesList(data.favoritesList || {});
            setCollections(data.favoritesList || {}); // Only if collections is indeed different
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error(
            "Error fetching user favorites and collections: ",
            error
          );
        }
      }
    };

    fetchFavoritesData();
  }, [currentUser]);

  useEffect(() => {
    const fetchAllUserDetails = async () => {
      if (!selectedCollection) return;

      const usersInCollection = favoritesList[selectedCollection] || [];
      await Promise.all(
        usersInCollection.map((userRef) => getUserDetails(userRef.uid))
      );

      // No need to do anything after fetching; the setUserDetailsCache call in getUserDetails
      // will trigger a re-render with the new cache
    };

    fetchAllUserDetails();
  }, [selectedCollection, favoritesList]);

  const fetchUserDetails = async (uid) => {
    const userRef = doc(db, "newusers", uid);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.error("No user found for ID:", uid);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const [userDetailsCache, setUserDetailsCache] = useState({});

  const getUserDetails = async (uid) => {
    if (userDetailsCache[uid]) {
      return userDetailsCache[uid];
    }
    const details = await fetchUserDetails(uid);
    setUserDetailsCache((prevCache) => ({
      ...prevCache,
      [uid]: details,
    }));
    return details;
  };

  const handleCollectionSelection = (collectionName) => {
    setSelectedCollection(collectionName);
  };

  // Function to delete a user from a collection
  const deleteUserFromCollection = async (userId, collectionName) => {
    // Create a new object without the deleted user
    const updatedCollection = favoritesList[collectionName].filter(
      (user) => user.uid !== userId
    );

    const updatedFavoritesList = {
      ...favoritesList,
      [collectionName]: updatedCollection,
    };

    try {
      // Update Firestore
      const userRef = doc(db, "business", currentUser.uid);
      await updateDoc(userRef, {
        favoritesList: updatedFavoritesList,
      });

      // Update local state
      setFavoritesList(updatedFavoritesList);
    } catch (error) {
      console.error("Error deleting user from favorites: ", error);
    }
  };

  const deleteCollection = async (collectionName) => {
    // Reference to the Firestore document
    const hirerRef = doc(db, "business", currentUser.uid);

    try {
      // Perform the delete operation on Firebase
      await updateDoc(hirerRef, {
        [`favoritesList.${collectionName}`]: deleteField(),
      });

      // Update local state to reflect the deletion
      setFavoritesList((prevFavoritesList) => {
        // Clone the previous state
        const updatedFavoritesList = { ...prevFavoritesList };
        // Remove the collection from the cloned state
        delete updatedFavoritesList[collectionName];
        // Return the updated state
        return updatedFavoritesList;
      });

      // If you also maintain the collections in a separate state, update that as well
      setCollections((prevCollections) => {
        const updatedCollections = { ...prevCollections };
        delete updatedCollections[collectionName];
        return updatedCollections;
      });
    } catch (error) {
      console.error("Error deleting collection from Firebase: ", error);
    }
  };

  // Function to render the users of a selected collection
  const renderUsersForCollection = (favoritesList, selectedCollection) => {
    if (!selectedCollection) {
      return null; // Or render a default message
    }

    const usersInCollection = favoritesList[selectedCollection] || [];
    return (
      <div className="all-favorite-creators">
        {usersInCollection.map((userRef) => {
          const user = userDetailsCache[userRef.uid] || {
            userName: "Loading...", // Ensure a valid imgUrl or provide a default
            imgUrl: "path/to/default/image", // Default image path
            country: "Unknown", // Default country
            tag: "None", // Default tag
          };
          return (
            <div key={userRef.uid} className="favorite-creator">
              {" "}
              {/* Change user.id to userRef.uid */}
              <img src={user.imgUrl} alt={user.userName} />
              <div>
                <div>{user.userName}</div>
                <div>{user.country}</div>
                <div>{user.tag}</div>
              </div>
              <div className="user-collection">{selectedCollection}</div>
              <div className="user-actions">
                <button
                  className="button-delete"
                  type="button"
                  onClick={() =>
                    deleteUserFromCollection(userRef.uid, selectedCollection)
                  } // Change user.id to userRef.uid
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const usersComponents = renderUsersForCollection(
    favoritesList,
    selectedCollection
  );

  return (
    <div className="favorites-layout">
      <div className="all-collections-names">
        <div className="collection-title">
          <h1>Your Collections</h1>
        </div>
        {collections &&
          Object.keys(collections).map((collectionName, index) => (
            <div key={index} className="collection-name">
              {" "}
              <div>{collectionName}</div>
              <div className="user-actions">
                <button
                  className="button-check"
                  type="button"
                  onClick={() => handleCollectionSelection(collectionName)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="button-delete"
                  type="button"
                  onClick={() => deleteCollection(collectionName)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="all-favorite-creators">
        <div className="favorite-title">
          <h1>Your Favorite Creators</h1>
        </div>
        {usersComponents}
      </div>
    </div>
  );
}
