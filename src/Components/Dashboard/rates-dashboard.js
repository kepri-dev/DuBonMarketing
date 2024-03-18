import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../Context/firebase";

function RatesDisplay({ pricingType, toggleModal, updatecount }) {
  const [photoPricing, setPhotoPricing] = useState({});

  useEffect(() => {
    const fetchPhotoPricing = async () => {
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
          console.log(photoPriceData, "is the price");
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchPhotoPricing();
  }, [updatecount, auth.currentUser]);
  return (
    <div className="pricing-plan">
      <div className="pricing-details">
        <h2>{photoPricing?.photoOfferName || "N/A"}</h2>
        <p>from {photoPricing?.basePrice || "N/A"} €</p>
      </div>

      <div>
        <ul>
          <li>
            Minimum Photo Quantity:{" "}
            {photoPricing?.minimumPhotoQuantity || "N/A"}
          </li>
          <li>Free Revisions: {photoPricing?.freeRevisions || "N/A"}</li>
          <li>
            Turnaround Time:{" "}
            {`Delivered in ${photoPricing?.turnaroundTime || "N/A"} days`}
          </li>
        </ul>
      </div>
      <div className="add-ons">
        <h3>Add-ons</h3>
        <ul>
          <li>
            <span className="description">Additional Photo:</span>{" "}
            <span className="price">
              {photoPricing?.pricePerAddedPhoto || "N/A"} €
            </span>
          </li>
          <li>
            <span className="description">Additional Revision:</span>{" "}
            <span className="price">
              {photoPricing?.pricePerAddedRevision || "N/A"} €
            </span>
          </li>
        </ul>
      </div>
      <button onClick={toggleModal} className="edit-rates-button" type="button">
        Set {pricingType === "photo" ? "Photo" : "Video"} Price
      </button>
    </div>
  );
}

export default RatesDisplay;
