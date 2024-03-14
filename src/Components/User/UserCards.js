import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Context/firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComments } from "@fortawesome/free-solid-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";

function UserCard({
  user,
  onHeartClick,
  onConversationClick,
  isInFavorites,
  currentUser,
}) {
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      const q = query(
        collection(db, "reviews"),
        where("creatorId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      let totalRating = 0;
      querySnapshot.forEach((doc) => {
        // Convert the string rating to a number before adding to totalRating
        const rating = parseFloat(doc.data().rating);
        if (!isNaN(rating)) {
          // Check if conversion is successful
          totalRating += rating;
        }
      });
      if (querySnapshot.size > 0) {
        setAverageRating(totalRating / querySnapshot.size);
      } else {
        setAverageRating(null); // No ratings available
      }
    };

    fetchRatings();
  }, [user.uid]);

  const viewProfile = () => {
    navigate(`/profile/${user.uid}`);
  };
  return (
    <div className="user-card" key={user.id}>
      <div className="images">
        <img className="coverImg" src={user.coverUrl} alt={user.userName} />
        <img className="profileImg" src={user.imgUrl} alt={user.userName} />
      </div>
      <div className="user-info">
        <div className="user-id">
          <h2>{user.userName}</h2>
          <p>{user.tag || user.userName.toLowerCase()}</p>
          <p>{user.device.join(", ")}</p>
          <p>{user.country.join(", ")}</p>
        </div>
        <div className="user-rating">
          {averageRating !== null ? (
            <>
              <p>{averageRating.toFixed(1)}</p>
              <FontAwesomeIcon icon={fasStar} style={{ color: "#ff9500" }} />
            </>
          ) : null}
        </div>
      </div>

      <div className="user-pricing">
        <div className="price-photo">
          <p>Photo Price</p>
          <p>
            from{" "}
            {Array.isArray(user.photoPrice)
              ? user.photoPrice.find((p) => p.key === "basePrice")?.value ||
                "N/A"
              : user.photoPrice || "N/A"}{" "}
            €
          </p>
        </div>
        <div className="price-video">
          <p>Video Price</p>
          <p>
            from{" "}
            {Array.isArray(user.videoPrice)
              ? user.videoPrice.find((v) => v.key === "basePriceVideo")
                  ?.value || "N/A"
              : user.videoPrice || "N/A"}{" "}
            €
          </p>
        </div>
      </div>

      {currentUser &&
        (currentUser.role === "hirer" || currentUser.role === "For Brands") && (
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
      <button className="view-profile-btn" onClick={viewProfile}>
        View Profile
      </button>
    </div>
  );
}
export default UserCard;
