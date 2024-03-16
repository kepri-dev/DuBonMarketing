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
import MediaUploadDisplay from "./media-dashboard";
import RatesDisplay from "./rates-dashboard";
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

  const handleFileUploads = async (files, storagePath) => {
    setIsUploading(true);
    const validFiles = files.filter(
      (file) => file instanceof File && file.size > 0
    );
    const uploadPromises = validFiles.map(async (file) => {
      const fileRef = ref(storage, `${storagePath}/${v4()}`);
      const snapshot = await uploadBytes(fileRef, file);
      return await getDownloadURL(snapshot.ref);
    });
    const uploadedFilesUrls = await Promise.all(uploadPromises);
    setIsUploading(false);
    return uploadedFilesUrls;
  };

  // Event handler adjustments for coverImg and imgUrl using URL.createObjectURL for immediate preview
  const handleCoverchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgUrl(URL.createObjectURL(file));
    }
  };

  const handleBioChange = (e) => setBio(e.target.value);
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  console.log(gender);
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

  const handleBrandsLogosChange = (e) => {
    const files = Array.from(e.target.files);
    setBrandsLogos(files);
  };

  const handlePreviousWorkChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviousWork(files);
  };

  const toggleModalPhoto = () => {
    setModalPhotoOpen(!isModalPhotoOpen);
  };

  const toggleModalVideo = () => {
    setModalVideoOpen(!isModalVideoOpen);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const user = auth.currentUser;
    let updatedBrandsLogos = brandsLogos;
    let updatedPreviousWork = previousWork;

    // Only upload if there are new files to upload
    if (brandsLogos.some((file) => file instanceof File)) {
      const brandsLogosUrls = await handleFileUploads(
        brandsLogos,
        "brandsLogos"
      );
      updatedBrandsLogos = [...currentUser.brandsLogos, ...brandsLogosUrls];
    }

    if (previousWork.some((file) => file instanceof File)) {
      const previousWorkUrls = await handleFileUploads(
        previousWork,
        "previousWork"
      );
      updatedPreviousWork = [...currentUser.previousWork, ...previousWorkUrls];
    }
    let newBrandsLogos = [...(currentUser.brandsLogos || [])];
    let newPreviousWork = [...(currentUser.previousWork || [])];

    if (user) {
      if (brandsLogos.length > 0) {
        newBrandsLogos = await handleFileUploads(
          brandsLogos,
          "brandsLogos",
          currentUser.brandsLogos || []
        );
        setIsUploading(true);
      }

      if (previousWork.length > 0) {
        newPreviousWork = await handleFileUploads(
          previousWork,
          "previousWork",
          currentUser.previousWork || []
        );
        setIsUploading(true);
      }

      const coverRef = ref(storage, `coverPictures/${v4()}`);
      let coverUrlDownload;
      if (coverUrl) {
        const coverPicSnapshot = await uploadBytes(coverRef, coverUrl);
        coverUrlDownload = await getDownloadURL(coverPicSnapshot.ref);
        setCoverUrl(coverUrlDownload);
        setIsUploading(true);
      }

      const imgRef = ref(storage, `profilePictures/${v4()}`);
      let imgUrlDownload;
      if (imgUrl) {
        const imgPicSnapshot = await uploadBytes(imgRef, imgUrl);
        imgUrlDownload = await getDownloadURL(imgPicSnapshot.ref);
        setImgUrl(imgUrlDownload);
        setIsUploading(true);
      }

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
          age,
          bio,
          gender,
          language,
          industry,
          device,
          tag,
          country,
          brandsLogos: newBrandsLogos,
          previousWork: newPreviousWork,
          profileComplete: isProfileComplete,
        };
        if (coverUrlDownload) {
          updateData.coverUrl = coverUrlDownload;
        }

        if (imgUrlDownload) {
          updateData.imgUrl = imgUrlDownload;
        }

        await updateDoc(userRef, updateData);
        alert("Profile updated successfully!");
        if (brandsLogos.length > 0) {
          setBrandsLogos(newBrandsLogos);
        }
        if (previousWork.length > 0) {
          setPreviousWork(newPreviousWork);
        }
        updateUserInContext({
          ...currentUser,

          coverUrl: coverUrlDownload || currentUser.coverUrl,
          imgUrl: imgUrlDownload || currentUser.imgUrl,
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

  const handlePreviewProfile = () => {
    navigate(`/profile/${currentUser?.uid}`);
  };

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
                onClick={() => handlePreviewProfile(currentUser)}
                type="button"
              >
                Preview My Profile
              </button>
            </div>
          </div>
        )}
      <form className="user-profile-container" onSubmit={handleSubmit}>
        <div className="user-profile-photos">
          <div className="header-section">
            <UserProfileInfo
              currentUser={currentUser}
              bio={currentUser?.bio}
              tag={currentUser?.tag}
              age={currentUser?.age}
              coverUrl={currentUser?.coverUrl}
              imgUrl={currentUser?.imgUrl}
              isUploading={isUploading}
              onBioChange={handleBioChange}
              onAgeChange={handleAgeChange}
              onTagchange={handleTagChange}
              onCoverChange={handleCoverchange}
              onImgChange={handleImgChange}
            />
            <label className="label-title">
              Genders
              <InfoTooltip infoText="Select your gender." />
            </label>
            {genders.map((gender, index) => (
              <label className="checkbox-container-genders" key={index}>
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  onChange={handleGenderChange}
                  checked={gender === gender}
                />
                <span
                  className={gender === gender ? "checkmark" : "radio-custom"}
                ></span>
                {gender}
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

          <MediaUploadDisplay
            currentUser={currentUser}
            handleBrandsLogosChange={handleBrandsLogosChange}
            handlePreviousWorkChange={handlePreviousWorkChange}
            handleDeleteBrandLogo={handleDeleteBrandLogo}
            handleDeletePreviousWork={handleDeletePreviousWork}
            brandsLogos={brandsLogos}
            previousWork={previousWork}
            isUploading={isUploading}
          />
        </div>
        <div className="user-profile-info">
          <h1>Create your rates</h1>

          <RatesDisplay
            pricingType="photo"
            pricingData={currentUser?.photoPrice}
            toggleModal={toggleModalPhoto}
          />

          <RatesDisplay
            pricingType="video"
            pricingData={currentUser?.videoPrice}
            toggleModal={toggleModalVideo}
          />

          {isModalPhotoOpen && (
            <PhotoPriceModal closeModal={toggleModalPhoto} />
          )}
          {isModalVideoOpen && (
            <VideoPriceModal closeModal={toggleModalVideo} />
          )}
        </div>{" "}
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
      <div className="danger-zone-dash">
        <h1>Danger Zone</h1>
        <button>Delete My Account</button>
      </div>
    </div>
  );
};

export default DashboardCreator;
