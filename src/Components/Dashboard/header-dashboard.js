import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./dashboard-creator.css";

function UserProfileInfo({
  currentUser,
  onTagchange,
  onBioChange,
  handleGenderChange,
  onAgeChange,
  onCoverChange,
  onImgChange,
  isUploading,
  coverUrl,
  imgUrl,
  title,
  gender,
}) {
  const genders = ["Male", "Female"];
  return (
    <div>
      <div className="cover-image-container">
        <img
          className="coverImg-dash"
          src={coverUrl || currentUser.coverUrl} // Use updated coverUrl from props or context
          alt={`${currentUser?.userName}'s cover`}
        />
        <label htmlFor="coverUrl" className="file-upload-button">
          Update Cover
          <input
            type="file"
            id="coverUrl"
            name="coverUrl"
            onChange={onCoverChange}
            className="cover-file-input"
          />
        </label>
        {isUploading && <div>Upload in progress, please wait...</div>}
      </div>
      <div className="profile-section-dash">
        <div className="profile-pic-dash">
          <img
            src={imgUrl || currentUser?.imgUrl}
            alt={currentUser?.userName}
          />
          <label htmlFor="imgUrl" className="file-upload-button-imgurl">
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="xl"
              style={{ color: "#ffffff" }}
            />{" "}
            <input
              type="file"
              id="imgUrl"
              name="imgUrl"
              onChange={onImgChange}
              className="cover-file-input"
            />
          </label>
        </div>
      </div>
      <div className="user-info-buttons-dash">
        <div className="user-information-header">
          <h1>{currentUser?.userName}</h1>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
            <input
              type="text"
              name="tag"
              onChange={onTagchange}
              placeholder={currentUser?.tag || "Got a nickname?"}
              className="input-header"
            />
          </div>
        </div>
      </div>
      <div className="bio-section">
        <label htmlFor="bio" className="label-title-header">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows="3"
          placeholder={
            currentUser?.bio ||
            "Tell the people your story. Why should they hire YOU? Don't be shy, the more you tell'em the more the chances they'll go with ya!"
          }
          onChange={onBioChange}
          className="bio-textarea"
        />
      </div>
      {/* <div className="gender-selection">
      <label className="label-title">Genders</label>

        {genders.map((genderOption, index) => (
          <label className="checkbox-container-genders" key={index}>
            <input
              type="radio"
              name="gender"
              value={genderOption}
              onChange={handleGenderChange}
              checked={currentUser.gender === genderOption}
            />
            <span
              className={
                currentUser.gender === genderOption
                  ? "checkmark"
                  : "radio-custom"
              }
            ></span>
            {genderOption}
          </label>
        ))}
      </div> */}
      <label className="label-title-header">Age</label>{" "}
      <input
        className="number"
        type="number"
        name="age"
        onChange={onAgeChange}
        placeholder={currentUser?.age}
      />
    </div>
  );
}

export default UserProfileInfo;
