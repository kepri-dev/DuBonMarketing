import React, { useState, useEffect, useContext } from "react";
import { updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { auth, storage, db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";
import "./hireraccount.css";

export default function HirerAccount() {
  const { currentUser, updateUserInContext } = useContext(AuthContext);
  const [userName, setUserName] = useState(currentUser?.userName);
  const [email, setEmail] = useState(currentUser?.email);
  const [imgUrl, setImgUrl] = useState(currentUser?.imgUrl);
  useEffect(() => {
    setUserName(currentUser?.userName);
    setEmail(currentUser?.email);
    setImgUrl(currentUser?.imgUrl);
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "business", currentUser.uid);
    const newusersRef = doc(db, "newusers", currentUser.uid);

    const updatedData = {
      userName,
      email,
      imgUrl,
    };
    if (currentUser.role === "hirer" || currentUser.role === "For Brands") {
      try {
        await updateDoc(userRef, updatedData);
        alert("Profile updated successfully!");

        // Update the user data in context
        updateUserInContext(updatedData);
      } catch (error) {
        console.error("Error updating user's profile: ", error);
        alert("There was an issue updating your profile.");
      }
    } else {
      try {
        await updateDoc(newusersRef, updatedData);
        alert("Profile updated successfully!");

        // Update the user data in context
        updateUserInContext(updatedData);
      } catch (error) {
        console.error("Error updating user's profile: ", error);
        alert("There was an issue updating your profile.");
      }
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      alert("No file selected for upload");
      return;
    }
    const imgRef = ref(storage, `profilePictures/${currentUser.uid}/${v4()}`);
    try {
      const imgPicSnapshot = await uploadBytes(imgRef, file);
      const imgUrlDownload = await getDownloadURL(imgPicSnapshot.ref);
      setImgUrl(imgUrlDownload);
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="account-container">
      <h2>Change Your Avatar</h2>
      <form onSubmit={handleUpdateProfile} className="account-section">
        <div className="account-avatar">
          <img src={currentUser?.imgUrl}></img>
          <label htmlFor="imgUrl" className="file-upload-button-acc">
            Upload
            <input
              type="file"
              id="imgUrl"
              name="imgUrl"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>
          {currentUser.imgUrl !==
            "https://firebasestorage.googleapis.com/v0/b/test-firebase-9badc.appspot.com/o/mockProfilePic%2FDALL%C2%B7E%202024-02-26%2018.11.43%20-%20Create%20a%20gender-neutral%20and%20featureless%20default%20profile%20picture%20representing%20a%20silhouette%20of%20a%20face%20and%20upper%20torso.%20Use%20abstract%20shapes%20like%20circles%20%20(1).png?alt=media&token=a71bd835-6b0a-41c6-9fae-f4f201c28ff2" && (
            <button className="delete-button" onClick={(e) => setImgUrl("")}>
              x
            </button>
          )}
        </div>

        <label className="label-title">Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label className="label-title">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="save" type="submit">
          Save
        </button>
      </form>

      {/* <div className="notification-preferences">
        <h2>Notification Preferences</h2>
      </div> */}

      <div className="danger-zone">
        <h2>Danger Zone</h2>
        <button>Delete My Account</button>
      </div>
    </div>
  );
}
