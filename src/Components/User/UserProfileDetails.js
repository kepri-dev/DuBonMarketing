import "./userprofilepage.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComments,
  faAngleDown,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import * as UtilityFunctions from "./UtilityFunctions";
import { db } from "../../Context/firebase";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export default function UserProfile({
  user,
  onHeartClick,
  onConversationClick,
  currentUser,
  isInFavorites,
}) {
  const { userId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("creatorId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const reviewsPromises = querySnapshot.docs.map(async (docs) => {
        const reviewData = docs.data();
        // Adjust 'businessId' to the actual field name if different
        const businessRef = doc(db, "business", reviewData.businessId); // Make sure this matches your data structure
        const businessSnapshot = await getDoc(businessRef);
        const businessData = businessSnapshot.data();
        return {
          id: doc.id,
          ...reviewData,
          reviewerName: businessData?.userName,
          reviewerImgUrl: businessData?.imgUrl,
        };
      });

      const reviewsArray = await Promise.all(reviewsPromises);
      setReviews(reviewsArray);
    };

    fetchReviews();
  }, [userId]);

  const [activeFaq, setActiveFaq] = useState(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showSection, setShowSection] = useState("photos"); // Default to photos
  const [reviews, setReviews] = useState([]);

  const maxLength = 150;
  const faqs = [
    {
      question: "What is a UGC ?",
      answer:
        "UGC (User-Generated Content) is brand-centric content created by everyday consumers and shared on social media. UGC differs from influencer content in that it focuses on your brand and your audience, not on influencers.",
    },
    {
      question: "Why use UGC ?",
      answer:
        "People no longer want to be sold products; they prefer to discover a product for themselves by experiencing it through the eyes of people like them. People buy with their emotions, not with their wallets, and they want to feel like they are buying from a friend who understands them. The need for UGC is becoming more and more important as it allows you to present your product in an authentic way to your audience and overcome their possible objections.",
    },
    {
      question: "Can I use your platform on behalf of my clients ?",
      answer:
        "Absolutely! Youdji is designed to be a flexible platform that can accommodate the needs of a variety of users, including agency owners. Whether you're seeking UGC creators for your own brand or on behalf of your clients, Youdji makes it simple and straightforward to find the right fit.",
    },
  ];

  const bio =
    user.bio ||
    "Hello, I'm currently not available to provide a personalized bio. As a passionate creator in the field of user-generated content, I strive to bring unique visions to life through innovative visual storytelling. Stay tuned for updates!";

  const toggleFaq = (faqIndex) => {
    setActiveFaq((prevActiveFaq) =>
      prevActiveFaq !== faqIndex ? faqIndex : null
    );
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const toggleBioDisplay = () => {
    setIsBioExpanded(!isBioExpanded); // Toggle the state
  };

  const navigate = useNavigate();

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

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  function formatServiceName(key) {
    const replacements = {
      pricePerAddedVideo: "Additional Video",
      pricePerAddedRevisionVideo: "Additional Revision",
      priceForFasterTurnaroundVideo: "Faster Turnaround",
      priceForEditingVideo: "Video Editing",
      priceForBriefCreation: "Brief Creation",
      priceforAddedVoiceOver: "Voice-Over",
      priceForAddedHooks: "Added Hooks",
      pricePerAddedPhoto: "Additional Photo",
      pricePerAddedRevision: "Additional Revision",
      priceForFasterTurnaround: "Faster Turnaround",
      priceForEditing: "Video Editing",
    };

    return (
      replacements[key] ||
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-photos">
        <div className="header-section">
          <img
            className="coverImg"
            src={user?.coverUrl}
            alt={`${user?.userName}'s cover`}
          />
          <div className="profile-section">
            <div className="profile-pic">
              <img src={user?.imgUrl} alt={user?.userName} />
            </div>
          </div>
          <div className="user-info-buttons">
            <div className="user-information">
              <h1>{user?.userName}</h1>
              <p>{user?.tag}</p>
              <p>{user?.device?.join(", ")}</p>
              <p>{user?.country?.join(", ")}</p>
              <p>{user?.industry?.join(", ")}</p>
            </div>
            <div className="user-bio">
              <p>{isBioExpanded ? bio : truncateText(bio, maxLength)}</p>
              <button onClick={toggleBioDisplay}>
                {isBioExpanded ? "Show less" : "Show more"}
              </button>{" "}
            </div>
            {currentUser &&
              (currentUser.role === "contentCreator" ||
                currentUser.role === "For Creators") && (
                <div className="preview-profile">
                  <button onClick={() => navigate(`/dashboard-creator`)}>
                    Edit My Profile
                  </button>
                </div>
              )}
            {currentUser &&
              (currentUser.role === "hirer" ||
                currentUser.role === "For Brands") && (
                <div className="buttons-users-interaction">
                  <button
                    onClick={onHeartClick}
                    className={`icon-button add-to-favorites ${
                      isInFavorites ? "in-favorites" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>

                  <button
                    onClick={onConversationClick}
                    className="icon-button start-conversation"
                  >
                    <FontAwesomeIcon icon={faComments} />
                  </button>
                </div>
              )}
          </div>
        </div>{" "}
        <div className="media-showcase-section">
          <h2>Trusted by the following brands</h2>
          <div
            className={`media-showcase ${
              user?.brandsLogos?.length > 4 ? "slide-animation" : ""
            }`}
          >
            {(user?.brandsLogos?.length > 4
              ? Array.from({ length: 5 }, () => user.brandsLogos).flat()
              : user?.brandsLogos
            )?.map((logoItem, index) => {
              const logoUrl = logoItem.url ? logoItem.url : logoItem;
              return (
                <img key={index} src={logoUrl} alt={`Brand logo ${index}`} />
              );
            })}
          </div>
        </div>
        <div className="user-generated-content-section">
          <h2>See something you like?</h2>
          <div
            className={`user-generated-content ${showAll ? "show-all" : ""}`}
          >
            {user?.previousWork?.map((workItem, index) => {
              const workUrl = workItem.url ? workItem.url : workItem;
              return (
                <img
                  key={index}
                  src={workUrl}
                  alt={`Previous work ${index + 1}`}
                />
              );
            })}
          </div>
          <button className="show-more-btn" onClick={toggleShowAll}>
            {showAll ? (
              <FontAwesomeIcon icon={faAngleUp} size="2xl" />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} size="2xl" />
            )}
          </button>
        </div>
        <div>
          <div className="faq-container-userprofile">
            {faqs.map((faq, index) => (
              <div key={index} className="single-faq-userprofile">
                <button
                  className="faq-question-userprofile"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                </button>
                <div
                  className={
                    activeFaq === index
                      ? "faq-answer-userprofile-active"
                      : "faq-answer-userprofile"
                  }
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="user-profile-info">
        <div className="pricing-plans">
          <div className="toggle-buttons-container">
            <button
              onClick={() => setShowSection("photos")}
              className={`toggle-button-prices ${
                showSection === "photos" ? "selected" : ""
              }`}
            >
              PHOTO
            </button>
            <button
              onClick={() => setShowSection("videos")}
              className={`toggle-button-prices ${
                showSection === "videos" ? "selected" : ""
              }`}
            >
              VIDEO
            </button>
          </div>
          {showSection === "photos" && (
            <>
              <div className="pricing-plan">
                <div className="pricing-details">
                  <h2>
                    {" "}
                    {Array.isArray(user.photoPrice)
                      ? user.photoPrice.find((v) => v.key === "photoOfferName")
                          ?.value || "N/A"
                      : "UGC PHOTOS"}{" "}
                  </h2>
                  <p>
                    from{" "}
                    {Array.isArray(user.photoPrice)
                      ? user.photoPrice.find((p) => p.key === "basePrice")
                          ?.value || "N/A"
                      : user.photoPrice || "N/A"}{" "}
                    €
                  </p>
                </div>
                <div>
                  <ul>
                    {Array.isArray(user.photoPrice) ? (
                      user.photoPrice.map((item) => {
                        const basePackageAttributes = new Set([
                          "minimumPhotoQuantity",
                          "freeRevisions",
                          "turnaroundTime",
                        ]);

                        if (basePackageAttributes.has(item.key)) {
                          if (
                            item.key === "minimumPhotoQuantity" &&
                            item.value > 0
                          ) {
                            return (
                              <li key={item.key}>{item.value} UGC Photos</li>
                            );
                          }
                          if (item.key === "freeRevisions" && item.value > 0) {
                            return (
                              <li key={item.key}>
                                {item.value} included revisions
                              </li>
                            );
                          }
                          if (item.key === "turnaroundTime") {
                            return (
                              <li key={item.key}>
                                Delivered in {item.value} days
                              </li>
                            );
                          }
                          return null;
                        } else {
                          return null;
                        }
                      })
                    ) : (
                      <>
                        <li>Please contact {user?.userName} to know more!</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="add-ons-section">
                {Array.isArray(user.photoPrice) &&
                  user.photoPrice.some((item) => {
                    const isAddon = ![
                      "basePrice",
                      "minimumPhotoQuantity",
                      "freeRevisions",
                      "turnaroundTime",
                    ].includes(item.key);
                    return isAddon && item.value > 0;
                  }) && (
                    <>
                      <h3>Need More ?</h3>
                      <ul>
                        {user.photoPrice.map((item) => {
                          const isAddon = ![
                            "basePrice",
                            "minimumPhotoQuantity",
                            "freeRevisions",
                            "turnaroundTime",
                          ].includes(item.key);
                          const hasValue = item.value > 0;

                          if (isAddon && hasValue) {
                            return (
                              <li key={item.key}>
                                <span className="description">
                                  {formatServiceName(item.key)}
                                </span>
                                <span className="price">{item.value} €</span>
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </>
                  )}
              </div>
            </>
          )}

          {showSection === "videos" && (
            <>
              <div className="pricing-plan">
                <div className="pricing-details">
                  <h2>
                    {Array.isArray(user.videoPrice)
                      ? user.videoPrice.find((v) => v.key === "videoOfferName")
                          ?.value || "N/A"
                      : "UGC VIDEOS"}{" "}
                  </h2>
                  <p>
                    from{" "}
                    {Array.isArray(user.videoPrice)
                      ? user.videoPrice.find((v) => v.key === "basePriceVideo")
                          ?.value || "N/A"
                      : user.videoPrice || "N/A"}{" "}
                    €
                  </p>
                </div>
                <div>
                  <ul>
                    {Array.isArray(user.videoPrice) ? (
                      user.videoPrice.map((item) => {
                        const basePackageAttributes = new Set([
                          "minimumVideoQuantity",
                          "freeRevisionsVideo",
                          "turnaroundTimeVideo",
                        ]);

                        if (basePackageAttributes.has(item.key)) {
                          if (
                            item.key === "minimumVideoQuantity" &&
                            item.value >= 1
                          ) {
                            return (
                              <li key={item.key}>{item.value} UGC Videos</li>
                            );
                          }
                          if (
                            item.key === "freeRevisionsVideo" &&
                            item.value > 0
                          ) {
                            return (
                              <li key={item.key}>
                                {item.value} included revisions
                              </li>
                            );
                          }
                          if (item.key === "turnaroundTimeVideo") {
                            return (
                              <li key={item.key}>
                                Delivered in {item.value} days
                              </li>
                            );
                          }
                          return null;
                        } else {
                          return null;
                        }
                      })
                    ) : (
                      <>
                        <li>Please contact {user?.userName} to know more!</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              <div className="add-ons-section">
                {Array.isArray(user.videoPrice) &&
                  user.videoPrice.some((item) => {
                    const isAddon = ![
                      "basePriceVideo",
                      "minimumVideoQuantity",
                      "freeRevisionsVideo",
                      "turnaroundTimeVideo",
                    ].includes(item.key);
                    return isAddon && item.value > 0;
                  }) && (
                    <>
                      <h3>Need More ?</h3>
                      <ul>
                        {user.videoPrice.map((item) => {
                          const isAddon = ![
                            "basePriceVideo",
                            "minimumVideoQuantity",
                            "freeRevisionsVideo",
                            "turnaroundTimeVideo",
                          ].includes(item.key);
                          const hasValue = item.value > 0;

                          if (isAddon && hasValue) {
                            return (
                              <li key={item.key}>
                                <span className="description">
                                  {formatServiceName(item.key)}
                                </span>
                                <span className="price">{item.value} €</span>
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
        {currentUser &&
          (currentUser.role === "hirer" ||
            currentUser.role === "For Brands") && (
            <div className="contact-customization">
              <button onClick={() => handleClickConversation(user)}>
                {user?.userName}
                <span> </span>
                <FontAwesomeIcon icon={faComments} />
              </button>
            </div>
          )}
        <div>
          <div className="client-testimonials">
            <h1>Reviews</h1>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="client-testimonials">
                  {" "}
                  {/* Adjusted class name */}
                  <div className="client-testimonials-author">
                    <img
                      src={review.reviewerImgUrl}
                      alt={review.reviewerName}
                    />
                    <div className="author-details">
                      <div className="author-name-rating">
                        <p>{review.reviewerName}</p>
                        <div className="rating-stars">
                          <FontAwesomeIcon
                            icon={fasStar}
                            style={{ color: "#ff9500" }}
                          />
                        </div>
                        <p>{review.rating}</p>
                      </div>
                      <p className="date">
                        {formatDistanceToNow(
                          new Date(review.createdAt.seconds * 1000)
                        ) + " ago"}
                      </p>{" "}
                      {/* Date display */}
                    </div>
                  </div>
                  <div className="client-testimonials-text">
                    <p>{review.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
