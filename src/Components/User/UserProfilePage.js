import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import Dialogs from "./Dialogs";
import { useCollections } from "./Hooks";
import { db } from "../../Context/firebase";
import * as UtilityFunctions from "./UtilityFunctions";
import { useFetchUserById } from "./Hooks";
import UserProfile from "./UserProfileDetails";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { userData, loading, error } = useFetchUserById(userId);
  const { currentUser } = useContext(AuthContext);
  const { collections, setCollections } = useCollections(currentUser);
  const [openFirstDialog, setOpenFirstDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    if (openFirstDialog && collections && selectedUser) {
      const userLists = new Set();
      Object.entries(collections).forEach(([listName, users]) => {
        if (users.some((user) => user.uid === selectedUser.uid)) {
          userLists.add(listName);
        }
      });
      setSelectedCollections(userLists);
    }
  }, [openFirstDialog, collections, selectedUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleClickHeart = (user) => {
    UtilityFunctions.handleClickHeart(
      user,
      setOpenFirstDialog,
      setSelectedUser
    );
  };

  const handleCollectionNameChange = (e) => {
    UtilityFunctions.handleCollectionNameChange(e, setCollectionName);
  };

  const addToFavoritesList = async (collectionName, userData) => {
    await UtilityFunctions.addToFavoritesList(
      collectionName,
      userData,
      currentUser,
      setCollections,
      setSelectedCollections
    );
  };

  const handleSaveAndClose = async () => {
    await UtilityFunctions.handleSaveAndClose(
      currentUser,
      selectedUser,
      selectedCollections,
      setCollections,
      setOpenFirstDialog,
      setSelectedCollections
    );
  };

  const handleCheckboxChange = (collectionName) => {
    setSelectedCollections((prevSelectedCollections) => {
      const newSelectedCollections = new Set(prevSelectedCollections);
      if (newSelectedCollections.has(collectionName)) {
        newSelectedCollections.delete(collectionName);
      } else {
        newSelectedCollections.add(collectionName);
      }
      return newSelectedCollections;
    });
  };

  const isUserInAnyCollections = (userId) => {
    return UtilityFunctions.isUserInAnyCollections(userId, collections);
  };


  const handleClickConversation = async (user) => {
    let conversationId = await UtilityFunctions.checkForExistingConversation(
      db,
      currentUser?.uid,
      user?.uid
    );

    if (!conversationId) {
      conversationId = await UtilityFunctions.createNewConversation(
        db,
        currentUser?.uid,
        user,
        currentUser
      );
    }

    if (conversationId) {
      navigate(`/messages/${conversationId}`);
    }
  };

  return (
    <>
      <UserProfile
        user={userData}
        onHeartClick={() => handleClickHeart(userData)}
        onConversationClick={() => handleClickConversation(userData)}
        isInFavorites={isUserInAnyCollections(userData?.uid)}
        currentUser={currentUser}
      />
      <Dialogs
        openFirstDialog={openFirstDialog}
        setOpenFirstDialog={setOpenFirstDialog}
        openSecondDialog={openSecondDialog}
        setOpenSecondDialog={setOpenSecondDialog}
        collections={collections}
        selectedCollections={selectedCollections}
        handleCheckboxChange={handleCheckboxChange}
        handleSaveAndClose={handleSaveAndClose}
        collectionName={collectionName}
        setCollectionName={setCollectionName}
        addToFavoritesList={addToFavoritesList}
        selectedUser={selectedUser}
        handleCollectionNameChange={handleCollectionNameChange}
      />
    </>
  );
};

export default UserProfilePage;
