import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../Context/firebase";

function RatesVideoDisplay({ pricingType, toggleModal, updatecount }) {
  const [videoPricing, setVideoPricing] = useState({});

  useEffect(() => {
    const fetchVideoPricing = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "newusers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().photoPrice) {
          const videoPricedata = docSnap
            .data()
            .videoPrice.reduce((obj, item) => {
              obj[item.key] = item.value;
              return obj;
            }, {});
          setVideoPricing(videoPricedata);
          console.log(videoPricedata, "is the price for vids");
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchVideoPricing();
  }, [updatecount, auth.currentUser]);

  return (
    <div className="pricing-plan">
      <div className="pricing-details">
        <h2>{videoPricing?.videoOfferName || "N/A"}</h2>
        <p>from {videoPricing?.basePriceVideo || "N/A"} €</p>
      </div>

      <div>
        <ul>
          {/* Updated keys based on your videoPrice data */}
          <li>
            Minimum Video Quantity:{" "}
            {videoPricing?.minimumVideoQuantity || "N/A"}
          </li>
          <li>Free Revisions: {videoPricing?.freeRevisionsVideo || "N/A"}</li>
          <li>
            Turnaround Time:{" "}
            {`Delivered in ${videoPricing?.turnaroundTimeVideo || "N/A"} days`}
          </li>
        </ul>
      </div>
      <div className="add-ons">
        <h3>Add-ons</h3>
        <ul>
          {/* Updated keys and added more add-ons based on your videoPrice data */}
          <li>
            <span className="description">Additional Video:</span>
            <span className="price">
              {videoPricing?.pricePerAddedVideo || "N/A"} €
            </span>
          </li>
          <li>
            <span className="description">Additional Revision Video:</span>
            <span className="price">
              {videoPricing?.pricePerAddedRevisionVideo || "N/A"} €
            </span>
          </li>
          {/* Continue for other add-ons as needed */}
        </ul>
      </div>
      <button onClick={toggleModal} className="edit-rates-button" type="button">
        Set {pricingType === "photo" ? "Photo" : "Video"} Price
      </button>
    </div>
  );
}

export default RatesVideoDisplay;
