import { db } from "../../Context/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const deleteFilters = (
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
) => {
  event.preventDefault();

  setSelectedGender([]);
  setAgeRange([newMinAge, newMaxAge]);
  setSelectedIndustry([]);
  setSelectedCountry([]);
  setSelectedLanguage([]);
  setPhotoPriceRange([minPhotoPrice, maxPhotoPrice]);
  setVideoPriceRange([minVideoPrice, maxVideoPrice]);
};

export const handleGenderChange = (
  event,
  selectedGender,
  setSelectedGender
) => {
  const selected = event.target.value;
  setSelectedGender((prevSelectedGender) => {
    if (prevSelectedGender.includes(selected)) {
      return prevSelectedGender.filter((gender) => gender !== selected);
    } else {
      return [...prevSelectedGender, selected];
    }
  });
};

export const handleIndustryChange = (
  event,
  selectedIndustry,
  setSelectedIndustry
) => {
  const selected = event.target.value;
  setSelectedIndustry((prevSelectedIndustry) => {
    if (prevSelectedIndustry.includes(selected)) {
      return prevSelectedIndustry.filter((industry) => industry !== selected);
    } else {
      return [...prevSelectedIndustry, selected];
    }
  });
};

export const handleCountryChange = (event, selected, setSelectedCountry) => {
  const selectedCountry = event.target.value;
  setSelectedCountry((prevSelectedCountry) => {
    if (prevSelectedCountry.includes(selectedCountry)) {
      return prevSelectedCountry.filter(
        (country) => country !== selectedCountry
      );
    } else {
      return [...prevSelectedCountry, selectedCountry];
    }
  });
};

export const handleLanguageChange = (event, selected, setSelectedLanguage) => {
  const selectedLanguage = event.target.value;
  setSelectedLanguage((prevSelectedLanguage) => {
    const newSelectedLanguage = prevSelectedLanguage.includes(selectedLanguage)
      ? prevSelectedLanguage.filter((language) => language !== selectedLanguage)
      : [...prevSelectedLanguage, selectedLanguage];

    return newSelectedLanguage;
  });
};

export const handleAgeChange = (
  event,
  newValue,
  activeThumb,
  setAgeRange,
  ageRange,
  minDistance
) => {
  if (activeThumb === 0) {
    setAgeRange([
      Math.min(newValue[0], ageRange[1] - minDistance),
      ageRange[1],
    ]);
  } else {
    setAgeRange([
      ageRange[0],
      Math.max(newValue[1], ageRange[0] + minDistance),
    ]);
  }
};

export const handlePhotoPriceChange = (
  event,
  newValue,
  activeThumb,
  setPhotoPriceRange,
  photoPriceRange
) => {
  if (activeThumb === 0) {
    setPhotoPriceRange([
      Math.min(newValue[0], photoPriceRange[1]),
      photoPriceRange[1],
    ]);
  } else {
    setPhotoPriceRange([
      photoPriceRange[0],
      Math.max(newValue[1], photoPriceRange[0]),
    ]);
  }
};
export const handleVideoPriceChange = (
  event,
  newValue,
  activeThumb,
  setVideoPriceRange,
  videoPriceRange
) => {
  if (activeThumb === 0) {
    setVideoPriceRange([
      Math.min(newValue[0], videoPriceRange[1]),
      videoPriceRange[1],
    ]);
  } else {
    setVideoPriceRange([
      videoPriceRange[0],
      Math.max(newValue[1], videoPriceRange[0]),
    ]);
  }
};

export const filterUsers = (
  users,
  selectedGender,
  selectedIndustry,
  selectedCountry,
  selectedLanguage,
  ageRange,
  photoPriceRange,
  videoPriceRange
) => {
  return users.filter((user) => {
    const genderMatch =
      selectedGender.length === 0 || selectedGender.includes(user.gender);

    const industryMatch =
      selectedIndustry.length === 0 ||
      selectedIndustry.some((industry) => user.industry.includes(industry));

    const countryMatch =
      selectedCountry.length === 0 ||
      selectedCountry.some((country) => user.country.includes(country));

    const languageMatch =
      selectedLanguage.length === 0 ||
      selectedLanguage.some((language) => user.language.includes(language));

    const ageFiltering = user.age >= ageRange[0] && user.age <= ageRange[1];

    const getBasePrice = (priceData) => {
      if (Array.isArray(priceData)) {
        const basePriceObj = priceData.find((p) => p.key === "basePrice");
        return basePriceObj ? basePriceObj.value : 0;
      } else {
        return Number(priceData) || 0;
      }
    };

    const photoPriceFiltering =
      getBasePrice(user.photoPrice) >= photoPriceRange[0] &&
      getBasePrice(user.photoPrice) <= photoPriceRange[1];

    const getBasePriceVideo = (priceData) => {
      if (Array.isArray(priceData)) {
        const basePriceObj = priceData.find((p) => p.key === "basePriceVideo");
        return basePriceObj ? basePriceObj.value : 0;
      } else {
        return Number(priceData) || 0;
      }
    };

    const videoPriceFiltering =
      getBasePriceVideo(user.videoPrice) >= videoPriceRange[0] &&
      getBasePriceVideo(user.videoPrice) <= videoPriceRange[1];

    return (
      ageFiltering &&
      genderMatch &&
      industryMatch &&
      countryMatch &&
      languageMatch &&
      photoPriceFiltering &&
      videoPriceFiltering
    );
  });
};

// Conversation Functions

export const handleClickHeart = async (
  user,
  setOpenFirstDialog,
  setSelectedUser
) => {
  console.log("User passed to handleClickHeart:", user);

  setOpenFirstDialog(true);
  setSelectedUser(user); // This sets the selectedUser
};

export const handleCollectionNameChange = (e, setCollectionName) => {
  e.preventDefault();
  setCollectionName(e.target.value);
};


export const handleSaveAndClose = async (
  currentUser,
  selectedUser,
  selectedCollections,
  setCollections,
  setOpenFirstDialog,
  setSelectedCollections
) => {
  if (
    currentUser &&
    currentUser.uid &&
    (currentUser.role === "hirer" || currentUser.role === "For Brands") &&
    selectedUser
  ) {
    const userRef = doc(db, "business", currentUser.uid);

    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        console.error("Document does not exist");
        return;
      }

      let favoritesData = docSnap.data().favoritesList || {};

      // Prepare userDetails based on the selectedUser argument
      const userDetails = {
        uid: selectedUser.uid,
        // userName: selectedUser.userName,
        // imgUrl: selectedUser.imgUrl,
        // tag: selectedUser.tag,
        // country: selectedUser.country.join(","),
      };

      Object.keys(favoritesData).forEach((collection) => {
        const isInSelectedCollections = selectedCollections.has(collection);
        const userIndex = favoritesData[collection].findIndex(
          (u) => u.uid === userDetails.uid
        );

        if (isInSelectedCollections && userIndex === -1) {
          // If the user is not in the collection, add them
          favoritesData[collection].push(userDetails);
        } else if (!isInSelectedCollections && userIndex !== -1) {
          // If the user is in the collection but not selected, remove them
          favoritesData[collection].splice(userIndex, 1);
        }
      });

      // Update Firestore with the new favorites data
      await updateDoc(userRef, { favoritesList: favoritesData });

      // Update local state with the new favorites data
      setCollections(favoritesData);

      // Reset selections and close the dialog
      setSelectedCollections(new Set());
      setOpenFirstDialog(false);
    } catch (error) {
      console.error("Error updating favorites in Firebase: ", error);
    }
  }
};

export const addToFavoritesList = async (
  collectionName,
  user,
  currentUser,
  setCollections
) => {
  if (typeof collectionName !== "string" || !collectionName.trim()) {
    console.error("Collection name must be a non-empty string");
    return;
  }

  const userRef = doc(db, "business", currentUser.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      let favoritesData = docSnap.data().favoritesList || {};

      // Check if the collection already exists to prevent overwriting
      if (!favoritesData.hasOwnProperty(collectionName)) {
        // Add the new collection as an empty array
        favoritesData[collectionName] = [];

        // Update the document with the modified favoritesList
        await updateDoc(userRef, { favoritesList: favoritesData });

        setCollections(favoritesData); // Update local state to reflect the new structure
        console.log("New list created:", collectionName);
      } else {
        console.log("The list already exists:", collectionName);
      }
    } else {
      console.error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error creating new list in Firebase: ", error);
  }
};

export const fetchUserDetails = async (uid) => {
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

export const isUserInAnyCollections = (userId, collections) => {
  const collectionsObject = collections || {};

  return Object.values(collectionsObject).some((usersInCollection) =>
    usersInCollection.some((user) => user.uid === userId)
  );
};

export const checkForExistingConversation = async (
  db,
  currentUserId,
  otherUserId
) => {
  const potentialChatId =
    currentUserId > otherUserId
      ? currentUserId + otherUserId
      : otherUserId + currentUserId;

  const chatDocRef = doc(db, "chats", potentialChatId);

  const docSnap = await getDoc(chatDocRef);
  if (docSnap.exists()) {
    return potentialChatId;
  } else {
    return null;
  }
};

export const createNewConversation = async (
  db,
  currentUserId,
  selectedUser,
  currentUser
) => {
  const newChatId =
    currentUserId > selectedUser?.uid
      ? currentUserId + selectedUser?.uid
      : selectedUser?.uid + currentUserId;

  const chatDocRef = doc(db, "chats", newChatId);

  const docSnap = await getDoc(chatDocRef);
  if (!docSnap.exists()) {
    await setDoc(chatDocRef, {
      messages: [],
      sender: {
        uid: currentUserId,
        userName: currentUser.userName,
        imgUrl: currentUser.imgUrl,
      },
      recipient: {
        uid: selectedUser?.uid,
        userName: selectedUser.userName,
        imgUrl: selectedUser.imgUrl,
      },
      lastMessage: {},
      updatedAt: new Date(),
      userIds: [currentUserId, selectedUser?.uid],
    });
    console.log("New chat document created in Firestore");
  } else {
    console.log("Chat document already exists in Firestore");
  }

  return newChatId;
};

export const handleClickConversation = async (
  navigate,
  checkForExistingConversation,
  createNewConversation,
  currentUser,
  user
) => {
  let conversationId = await checkForExistingConversation(
    currentUser?.uid,
    user?.uid
  );

  if (!conversationId) {
    conversationId = await createNewConversation(currentUser?.uid, user);
  }

  if (conversationId) {
    navigate(`/messages/${conversationId}`);
  }
};
