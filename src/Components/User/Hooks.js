import React, { useState, useEffect, useContext } from "react";
import { db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

// Fetch Users Data
export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersQuery = query(
          collection(db, "newusers"),
          where("profileComplete", "==", true)
        );

        const querySnapshot = await getDocs(usersQuery);
        const users = querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          const industryString = userData.industry;
          const languageString = userData.language;
          return {
            ...userData,
            industry: industryString,
            language: languageString,
            id: doc.id,
          };
        });
        setUsers(users);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);
  return users;
};

export async function fetchUserData(userId) {
  const defaultProfilePic =
    "https://firebasestorage.googleapis.com/v0/b/test-firebase-9badc.appspot.com/o/mockProfilePic%2FDALL%C2%B7E%202024-02-26%2018.11.43%20-%20Create%20a%20gender-neutral%20and%20featureless%20default%20profile%20picture%20representing%20a%20silhouette%20of%20a%20face%20and%20upper%20torso.%20Use%20abstract%20shapes%20like%20circles%20%20(1).png?alt=media&token=a71bd835-6b0a-41c6-9fae-f4f201c28ff2";
  if (!userId) {
    console.error("No user ID provided to fetchUserData");
    return null;
  }

  try {
    const userRef = doc(db, "newusers", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Attempt to fetch from 'business' collection if not found in 'newusers'
      const businessRef = doc(db, "business", userId);
      const businessSnap = await getDoc(businessRef);

      if (businessSnap.exists()) {
        return businessSnap.data();
      } else {
        console.warn(`User data not found for ID: ${userId}`);
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

//Fetch single user data

export const useFetchUserById = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "newusers", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError("No such document!");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  return { userData, loading, error };
};

// Fetch Current User Data
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { currentUser: authUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser && authUser.uid) {
      const userRef = doc(db, "business", authUser.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          setCurrentUser({ ...docSnap.data(), uid: authUser.uid });
        }
      });
    } else {
      setCurrentUser(null);
    }
  }, [authUser, db]);
  return currentUser;
};

// Fetch Collections Data

// Adjust useCollections to listen for real-time updates
export const useCollections = (currentUser) => {
  const [collections, setCollections] = useState({});

  useEffect(() => {
    let unsubscribe = () => {};
    if (
      currentUser?.uid &&
      (currentUser?.role === "hirer" || currentUser?.role === "For Brands")
    ) {
      const userRef = doc(db, "business", currentUser.uid);
      unsubscribe = onSnapshot(userRef, (doc) => {
        const newCollections = doc.data().favoritesList || {};
        setCollections(newCollections);
      });
    }
    return () => unsubscribe();
  }, [currentUser, db]);

  return { collections, setCollections };
};

// Filtering Logic
export const useFilterLogic = (users) => {
  const defaultMinAge = 14;
  const defaultMaxAge = 80;
  const [newMinAge, setNewMinAge] = useState(defaultMinAge);
  const [newMaxAge, setNewMaxAge] = useState(defaultMaxAge);
  const defaultMinPhotoPrice = 10;
  const defaultMaxPhotoPrice = 500;
  const defaultMinVideoPrice = 50;
  const defaultMaxVideoPrice = 1000;
  const [minPhotoPrice, setMinPhotoPrice] = useState(defaultMinPhotoPrice);
  const [maxPhotoPrice, setMaxPhotoPrice] = useState(defaultMaxPhotoPrice);
  const [minVideoPrice, setMinVideoPrice] = useState(defaultMinVideoPrice);
  const [maxVideoPrice, setMaxVideoPrice] = useState(defaultMaxVideoPrice);

  useEffect(() => {
    if (users.length > 0) {
      const ages = users.map((user) => user.age);
      const calculatedMinAge = Math.min(...ages);
      const calculatedMaxAge = Math.max(...ages);

      if (calculatedMinAge !== newMinAge) {
        setNewMinAge(calculatedMinAge);
      }
      if (calculatedMaxAge !== newMaxAge) {
        setNewMaxAge(calculatedMaxAge);
      }
    }
  }, [users, newMinAge, newMaxAge]);
  useEffect(() => {
    if (users.length > 0) {
      const photoPrices = users.map((user) => {
        if (Array.isArray(user.photoPrice)) {
          const basePriceObj = user.photoPrice.find(
            (p) => p.key === "basePrice"
          );
          return basePriceObj ? basePriceObj.value : 0;
        } else {
          return Number(user.photoPrice) || 0;
        }
      });
      const videoPrices = users.map((user) => {
        if (Array.isArray(user.videoPrice)) {
          const basePriceObj = user.videoPrice.find(
            (p) => p.key === "basePriceVideo"
          );
          return basePriceObj ? basePriceObj.value : 0;
        } else {
          return Number(user.videoPrice) || 0;
        }
      });

      const newMinPhotoPrice = Math.min(...photoPrices);
      const newMaxPhotoPrice = Math.max(...photoPrices);

      if (newMinPhotoPrice !== minPhotoPrice) {
        setMinPhotoPrice(newMinPhotoPrice);
      }

      if (newMaxPhotoPrice !== maxPhotoPrice) {
        setMaxPhotoPrice(newMaxPhotoPrice);
      }

      const newMinVideoPrice = Math.min(...videoPrices);
      const newMaxVideoPrice = Math.max(...videoPrices);

      if (newMinVideoPrice !== minVideoPrice) {
        setMinVideoPrice(newMinVideoPrice);
      }

      if (newMaxVideoPrice !== maxVideoPrice) {
        setMaxVideoPrice(newMaxVideoPrice);
      }
    }
  }, [users, minPhotoPrice, maxPhotoPrice, minVideoPrice, maxVideoPrice]);
  return {
    minPhotoPrice,
    maxPhotoPrice,
    minVideoPrice,
    maxVideoPrice,
    newMinAge,
    newMaxAge,
  };
};
