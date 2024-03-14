import "./users.css";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import UserCard from "./UserCards";
import FilterForm from "./FilterForm";
import Dialogs from "./Dialogs";
import {
  useFetchUsers,
  useCurrentUser,
  useCollections,
  useFilterLogic,
} from "./Hooks";
import { db } from "../../Context/firebase";
import * as UtilityFunctions from "./UtilityFunctions";
import { collection, query, where, getDocs } from "firebase/firestore";

function UsersOnApp() {
  const users = useFetchUsers();
  const { currentUser } = useContext(AuthContext);
  const { collections, setCollections } = useCollections(currentUser);
  const [openFirstDialog, setOpenFirstDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState(new Set());

  const {
    minPhotoPrice,
    maxPhotoPrice,
    minVideoPrice,
    maxVideoPrice,
    newMinAge,
    newMaxAge,
  } = useFilterLogic(users);

  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [ageRange, setAgeRange] = useState([newMinAge, newMaxAge]);
  const [photoPriceRange, setPhotoPriceRange] = useState([
    minPhotoPrice,
    maxPhotoPrice,
  ]);
  const [videoPriceRange, setVideoPriceRange] = useState([
    minVideoPrice,
    maxVideoPrice,
  ]);
  const minDistance = 1;
  const uniqueGenders = Array.from(new Set(users.map((user) => user.gender)));
  const filteredUsers = UtilityFunctions.filterUsers(
    users,
    selectedGender,
    selectedIndustry,
    selectedCountry,
    selectedLanguage,
    ageRange,
    photoPriceRange,
    videoPriceRange
  );



  // Conversation Functions

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

  const handleClickHeart = (user) => {
    if (!currentUser) {
      console.error("No current user found.");
      return;
    }
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

  const isUserInAnyCollections = (userId) => {
    return UtilityFunctions.isUserInAnyCollections(userId, collections);
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

  const predefinedIndustries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Entertainment",
    "Fashion",
    "Food & Beverage",
    "Travel",
  ];

  const predefinedCountries = [
    "France",
    "Italy",
    "Switzerland",
    "Germany",
    "Canada",
    "United States",
    "Morocco",
  ];
  const predefinedLanguages = [
    "English",
    "French",
    "Spanish",
    "Italian",
    "Arabic",
    "German",
  ];

  const navigate = useNavigate();

  const deleteFilters = (event) => {
    UtilityFunctions.deleteFilters(
      event,
      setSelectedGender,
      setAgeRange,
      newMinAge,
      newMaxAge,
      setSelectedIndustry,
      setSelectedCountry,
      setSelectedLanguage,
      setPhotoPriceRange,
      minPhotoPrice,
      maxPhotoPrice,
      setVideoPriceRange,
      minVideoPrice,
      maxVideoPrice
    );
  };

  const handleGenderChange = (event) => {
    UtilityFunctions.handleGenderChange(
      event,
      selectedGender,
      setSelectedGender
    );
  };

  const handleIndustryChange = (event) => {
    UtilityFunctions.handleIndustryChange(
      event,
      selectedIndustry,
      setSelectedIndustry
    );
  };

  const handleCountryChange = (event) => {
    UtilityFunctions.handleCountryChange(
      event,
      selectedCountry,
      setSelectedCountry
    );
  };

  const handleLanguageChange = (event) => {
    UtilityFunctions.handleLanguageChange(
      event,
      selectedLanguage,
      setSelectedLanguage
    );
  };

  const handleAgeChange = (event, newValue, activeThumb) => {
    UtilityFunctions.handleAgeChange(
      event,
      newValue,
      activeThumb,
      setAgeRange,
      ageRange,
      minDistance
    );
  };

  const handlePhotoPriceChange = (event, newValue, activeThumb) => {
    UtilityFunctions.handlePhotoPriceChange(
      event,
      newValue,
      activeThumb,
      setPhotoPriceRange,
      photoPriceRange
    );
  };

  const handleVideoPriceChange = (event, newValue, activeThumb) => {
    UtilityFunctions.handleVideoPriceChange(
      event,
      newValue,
      activeThumb,
      setVideoPriceRange,
      videoPriceRange
    );
  };

  return (
    <div className="main">
      <div>
        <FilterForm
          uniqueGenders={uniqueGenders}
          selectedGender={selectedGender}
          handleGenderChange={handleGenderChange}
          ageRange={ageRange}
          handleAgeChange={handleAgeChange}
          newMinAge={newMinAge}
          newMaxAge={newMaxAge}
          predefinedIndustries={predefinedIndustries}
          selectedIndustry={selectedIndustry}
          handleIndustryChange={handleIndustryChange}
          predefinedCountries={predefinedCountries}
          selectedCountry={selectedCountry}
          handleCountryChange={handleCountryChange}
          predefinedLanguages={predefinedLanguages}
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
          photoPriceRange={photoPriceRange}
          handlePhotoPriceChange={handlePhotoPriceChange}
          videoPriceRange={videoPriceRange}
          handleVideoPriceChange={handleVideoPriceChange}
          deleteFilters={deleteFilters}
          minPhotoPrice={minPhotoPrice}
          maxPhotoPrice={maxPhotoPrice}
          minVideoPrice={minVideoPrice}
          maxVideoPrice={maxVideoPrice}
        />
      </div>
      <div className="users">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onHeartClick={() => handleClickHeart(user)}
            onConversationClick={() => handleClickConversation(user)}
            isInFavorites={isUserInAnyCollections(user.uid)}
            currentUser={currentUser}
          />
        ))}
      </div>

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
    </div>
  );
}
export default UsersOnApp;
