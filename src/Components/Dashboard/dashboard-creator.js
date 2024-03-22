import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard-creator.css";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { auth, storage, db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";
import PhotoPriceModal from "../User/PhotoPriceModal";
import VideoPriceModal from "../User/VideoPriceModal";
import UserProfileInfo from "./header-dashboard";
import CheckboxDashboard from "./checkbox-dashboard";
import LogoUploadDisplay from "./logo-dashboard";
import PreviousWorkUploadDisplay from "./previousWork-dashboard";
import RatesDisplay from "./rates-dashboard";
import RatesVideoDisplay from "./rates-videos-dashboard";
import InfoTooltip from "./InfoToolTip";

const DashboardCreator = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserInContext } = useContext(AuthContext);
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [gender, setGender] = useState(currentUser?.gender || "");
  const [age, setAge] = useState(currentUser?.age || "");
  const [tag, setTag] = useState(currentUser?.tag || "");
  const [language, setLanguage] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [device, setDevice] = useState([]);
  const [country, setCountry] = useState([]);
  const [coverUrl, setCoverUrl] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [brandsLogos, setBrandsLogos] = useState([]);
  const [previousWork, setPreviousWork] = useState([]);
  const [isModalPhotoOpen, setModalPhotoOpen] = useState(false);
  const [isModalVideoOpen, setModalVideoOpen] = useState(false);
  const devices = ["Phone", "Pro Camera"];
  const [isUploading, setIsUploading] = useState(false);
  const [photoPricing, setPhotoPricing] = useState({});
  const [videoPricing, setVideoPricing] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  const isProfileComplete = currentUser?.profileComplete === true;

  const genders = ["Male", "Female"];

  const countries = [
    "Morocco",
    "France",
    "Italy",
    "Switzerland",
    "Germany",
    "Canada",
    "United States",
  ];
  const languages = [
    "English",
    "French",
    "Spanish",
    "Italian",
    "German",
    "Arabic",
  ];
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Entertainment",
    "Fashion",
    "Food & Beverage",
    "Travel",
  ];
  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio || "");
      setAge(currentUser.age || "");
      setGender(currentUser.gender || "");
      setTag(currentUser.tag || "");
      setLanguage(currentUser.language || []);
      setIndustry(currentUser.industry || []);
      setDevice(currentUser.device || []);
      setCountry(currentUser.country || []);
      setImgUrl(currentUser.imgUrl || null);
      setCoverUrl(currentUser.coverUrl || null);
      setBrandsLogos(currentUser.brandsLogos || []);
      setPreviousWork(currentUser.previousWork || []);
    }
  }, [currentUser]);

  const fetchUserData = async (userId) => {
    const userRef = doc(db, "newusers", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setBrandsLogos(userData.brandsLogos || []);
      setPreviousWork(userData.previousWork || []);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserData(currentUser.uid);
    }
  }, [currentUser?.uid]);

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

  const handleCoverUpload = async (file) => {
    if (!file) {
      alert("No file selected for upload");
      return;
    }
    const imgRef = ref(storage, `coverPictures/${currentUser.uid}/${v4()}`);
    try {
      const imgPicSnapshot = await uploadBytes(imgRef, file);
      const imgUrlDownload = await getDownloadURL(imgPicSnapshot.ref);
      setCoverUrl(imgUrlDownload);
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("Failed to upload image");
    }
  };

  const handleBrandsLogosUpload = async (files) => {
    const filesArray = Array.from(files); // Convert FileList to Array
    if (filesArray.length === 0) {
      alert("No files selected for upload");
      return;
    }

    setIsUploading(true); // Assuming you have a state to track upload status

    const uploadedUrls = await Promise.all(
      filesArray.map(async (file) => {
        const imgRef = ref(storage, `brandsLogos/${currentUser.uid}/${v4()}`);
        try {
          const imgPicSnapshot = await uploadBytes(imgRef, file);
          const imgUrlDownload = await getDownloadURL(imgPicSnapshot.ref);
          return imgUrlDownload;
        } catch (error) {
          console.error("Error uploading file: ", error);
          alert("Failed to upload image");
          return null; // Return null for any failed uploads
        }
      })
    );

    // Filter out any null values in case some uploads failed
    const successfulUploads = uploadedUrls.filter((url) => url !== null);

    setBrandsLogos((prevUrls) => [...prevUrls, ...successfulUploads]); // Assuming you have a state to store URLs
    const updatedUser = {
      ...currentUser,
      brandsLogos: [...currentUser.previousWork, ...successfulUploads],
    };

    updateUserInContext(updatedUser);
    setIsUploading(false);
  };

  const handlePreviousWorkUpload = async (files) => {
    const filesArray = Array.from(files); // Convert FileList to Array
    if (filesArray.length === 0) {
      alert("No files selected for upload");
      return;
    }

    setIsUploading(true); // Assuming you have a state to track upload status

    const uploadedUrls = await Promise.all(
      filesArray.map(async (file) => {
        const imgRef = ref(storage, `previousWork/${currentUser.uid}/${v4()}`);
        try {
          const imgPicSnapshot = await uploadBytes(imgRef, file);
          const imgUrlDownload = await getDownloadURL(imgPicSnapshot.ref);
          return imgUrlDownload;
        } catch (error) {
          console.error("Error uploading file: ", error);
          alert("Failed to upload image");
          return null; // Return null for any failed uploads
        }
      })
    );

    // Filter out any null values in case some uploads failed
    const successfulUploads = uploadedUrls.filter((url) => url !== null);

    setPreviousWork((prevUrls) => [...prevUrls, ...successfulUploads]); // Assuming you have a state to store URLs
    const updatedUser = {
      ...currentUser,
      previousWork: [...currentUser.previousWork, ...successfulUploads],
    };

    updateUserInContext(updatedUser);
    setIsUploading(false);
  };

  const handleDeleteBrandLogo = async (index, event) => {
    event.stopPropagation();
    const updatedLogos = [...currentUser.brandsLogos];
    updatedLogos.splice(index, 1);

    try {
      const userRef = doc(db, "newusers", currentUser.uid);
      await updateDoc(userRef, {
        brandsLogos: updatedLogos,
      });

      // After successful Firebase update, update local state
      updateUserInContext({ ...currentUser, brandsLogos: updatedLogos });
    } catch (error) {
      console.error("Error updating logos: ", error);
    }
  };

  const handleDeletePreviousWork = async (index) => {
    const updatedWork = [...currentUser.previousWork];
    updatedWork.splice(index, 1);

    try {
      const userRef = doc(db, "newusers", currentUser.uid);
      await updateDoc(userRef, {
        previousWork: updatedWork,
      });

      // After successful Firebase update, update local state
      updateUserInContext({ ...currentUser, previousWork: updatedWork });
    } catch (error) {
      console.error("Error updating previous work: ", error);
    }
  };

  const handleBioChange = (e) => setBio(e.target.value);
  const handleGenderChange = (e) => {
    setGender(e.target.value);
    console.log("gender selected is", e.target.value);
  };

  const handleAgeChange = (e) => setAge(e.target.value);
  const handleTagChange = (e) => setTag(e.target.value);

  const handleToggleLanguage = (e) => {
    const option = e.target.value;
    setLanguage((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  const handleToggleIndustry = (e) => {
    const option = e.target.value;
    setIndustry((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleToggleDevice = (e) => {
    const option = e.target.value;
    setDevice((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  const handleToggleCountry = (e) => {
    const option = e.target.value;
    setCountry((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const toggleModalPhoto = () => setModalPhotoOpen(!isModalPhotoOpen);

  const [updateCount, setUpdateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleDataUpdated = () => {
    setUpdateCount((count) => count + 1);
  };

  useEffect(() => {
    const fetchPhotoPricing = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "newusers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().photoPrice) {
          const photoPriceData = docSnap
            .data()
            .photoPrice.reduce((obj, item) => {
              obj[item.key] = item.value;
              return obj;
            }, {});
          setPhotoPricing(photoPriceData);
        } else {
          console.log("No such document!");
        }
      }
      setIsLoading(false);
    };
    fetchPhotoPricing();
  }, [updateCount]);

  useEffect(() => {
    const fetchVideoPricing = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "newusers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().photoPrice) {
          const videoPricedata = docSnap
            .data()
            .videoPrice?.reduce((obj, item) => {
              obj[item.key] = item.value;
              return obj;
            }, {});
          setVideoPricing(videoPricedata);
        } else {
          console.log("No such document!");
        }
      }
      setIsLoading(false);
    };
    fetchVideoPricing();
  }, [updateCount]);

  const toggleModalVideo = () => {
    setModalVideoOpen(!isModalVideoOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "newusers", user.uid);
      const docSnapshot = await getDoc(userRef);
      const userData = docSnapshot.data();
      const hasPhotoPricing = userData.photoPrice?.some(
        (item) => item.key === "basePrice" && item.value !== ""
      );
      const hasVideoPricing = userData.videoPrice?.some(
        (item) => item.key === "basePriceVideo" && item.value !== ""
      );
      const isProfileComplete =
        gender &&
        age &&
        language.length > 0 &&
        industry.length > 0 &&
        country.length > 0 &&
        hasPhotoPricing &&
        hasVideoPricing;
      try {
        const updateData = {
          coverUrl: coverUrl,
          imgUrl: imgUrl,
          age,
          bio,
          gender,
          language,
          industry,
          device,
          tag,
          country,
          brandsLogos: brandsLogos,
          previousWork: previousWork,
          profileComplete: isProfileComplete,
        };

        await updateDoc(userRef, updateData);
        alert("Profile updated successfully!");

        updateUserInContext({
          ...currentUser,

          updateData,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("There was an issue updating your profile.");
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log("No user is logged in");
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      {currentUser &&
        (currentUser.role === "contentCreator" ||
          currentUser.role === "For Creators") && (
          <div>
            {!isProfileComplete && (
              <div className="profile-edit-page">
                <div className="profile-incomplete-message">
                  Your profile is currently hidden because you need to fill out
                  your device, gender, age, country, language, industries, and
                  pricing information.
                </div>
              </div>
            )}
            <div className="preview-profile">
              <button
                onClick={() => navigate(`/profile/${currentUser?.uid}`)}
                type="button"
              >
                Preview My Profile
              </button>
            </div>
          </div>
        )}
      <div className="user-profile-container">
        <form onSubmit={handleSubmit}>
          <div className="user-profile-photos">
            <div className="header-section">
              <UserProfileInfo
                currentUser={currentUser}
                bio={currentUser?.bio}
                tag={currentUser?.tag}
                age={currentUser?.age}
                coverUrl={coverUrl || currentUser?.coverUrl}
                imgUrl={imgUrl || currentUser?.imgUrl}
                isUploading={isUploading}
                onBioChange={handleBioChange}
                onAgeChange={handleAgeChange}
                onTagchange={handleTagChange}
                handleCoverUpload={handleCoverUpload}
                handleImageUpload={handleImageUpload}
              />
              <label className="label-title">
                Gender
                <InfoTooltip infoText="Select your gender." />
              </label>
              {genders.map((genderValue, index) => (
                <label className="checkbox-container-genders" key={index}>
                  <input
                    type="radio"
                    name="gender"
                    value={genderValue}
                    onChange={handleGenderChange}
                    checked={gender === genderValue} // Compare the current gender state with the value of this radio button
                  />
                  <span
                    className={
                      gender === genderValue ? "checkmark" : "radio-custom"
                    }
                  ></span>
                  {genderValue}
                </label>
              ))}

              <CheckboxDashboard
                title={
                  <span>
                    Camera Type
                    <InfoTooltip infoText="Select the types of cameras you use." />
                  </span>
                }
                options={devices}
                selectedOptions={device}
                onChange={handleToggleDevice}
              />
              <CheckboxDashboard
                title={
                  <span>
                    Country
                    <InfoTooltip infoText="Select the country you are located in." />
                  </span>
                }
                options={countries}
                selectedOptions={country}
                onChange={handleToggleCountry}
              />
              <CheckboxDashboard
                title={
                  <span>
                    Languages
                    <InfoTooltip infoText="Select the languages you speak." />
                  </span>
                }
                options={languages}
                selectedOptions={language}
                onChange={handleToggleLanguage}
              />
              <CheckboxDashboard
                title={
                  <span>
                    Industries
                    <InfoTooltip infoText="Select the industries you would like to serve." />
                  </span>
                }
                options={industries}
                selectedOptions={industry}
                onChange={handleToggleIndustry}
              />
            </div>
            <LogoUploadDisplay
              currentUser={currentUser}
              handleBrandsLogosUpload={handleBrandsLogosUpload}
              handleDeleteBrandLogo={handleDeleteBrandLogo}
              brandsLogos={brandsLogos}
              isUploading={isUploading}
            />
            <PreviousWorkUploadDisplay
              currentUser={currentUser}
              handlePreviousWorkUpload={handlePreviousWorkUpload}
              previousWork={previousWork}
              handleDeletePreviousWork={handleDeletePreviousWork}
              isUploading={isUploading}
            />
          </div>

          <div className="button-dash">
            <button
              className="save-form-dash"
              type="submit"
              onClick={handleSubmit}
            >
              Save My Profile
            </button>

            <p>Please save & refresh browser to see the updated fresh look !</p>
          </div>
        </form>
        <div className="user-profile-info">
          <h1>Create your rates</h1>

          <RatesDisplay
            pricingType="photo"
            pricingData={photoPricing}
            toggleModal={toggleModalPhoto}
            isLoading={isLoading}
            updatecount={updateCount}
          />

          <RatesVideoDisplay
            pricingType="video"
            pricingData={videoPricing}
            toggleModal={toggleModalVideo}
            isLoading={isLoading}
            updatecount={updateCount}
          />

          {isModalPhotoOpen && (
            <PhotoPriceModal
              closeModal={toggleModalPhoto}
              onPriceUpdate={handleDataUpdated}
            />
          )}
          {isModalVideoOpen && (
            <VideoPriceModal
              closeModal={toggleModalVideo}
              onPriceUpdate={handleDataUpdated}
            />
          )}
        </div>{" "}
      </div>
      <div className="danger-zone-dash">
        <h1>Danger Zone</h1>
        <button>Delete My Account</button>
      </div>
    </div>
  );
};

export default DashboardCreator;
