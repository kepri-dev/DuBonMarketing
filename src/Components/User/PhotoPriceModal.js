import React, { useState, useEffect } from "react";
import "./pricemodal.css";
import { auth, db } from "../../Context/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import InfoTooltip from "../Dashboard/InfoToolTip";

const PhotoPriceModal = ({ closeModal }) => {
  const defaultFormData = {
    photoOfferName: "Name your offer here",
    minimumPhotoQuantity: 1,
    freeRevisions: 0,
    turnaroundTime: 1,
    pricePerAddedPhoto: 0,
    pricePerAddedRevision: 0,
    priceForFasterTurnaround: 0,
    priceForEditing: 0,
    basePrice: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchFormData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "newusers", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().photoPrice) {
            // Convert the array to an object
            const photoPriceData = docSnap
              .data()
              .photoPrice.reduce((obj, item) => {
                obj[item.key] = item.value;
                return obj;
              }, {});

            // Set the form data, using the fetched values or default values as fallback
            setFormData({ ...defaultFormData, ...photoPriceData });
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchFormData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // const numericalValue = value === "" ? "" : Number(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "newusers", user.uid);
      // Convert formData into an array of { key, value } objects
      const photoPriceArray = Object.entries(formData).map(([key, value]) => ({
        key: key,
        value: value,
      }));

      try {
        await updateDoc(userRef, {
          photoPrice: photoPriceArray,
        });
        console.log("Pricing updated successfully");
        closeModal();
      } catch (error) {
        console.error("Error updating pricing: ", error);
      }
    } else {
      console.log("No user is logged in");
    }
  };

  const calculateFinalPrice = () => {
    const basePrice = +formData.basePrice;
    const pricePerAddedPhoto = +formData.pricePerAddedPhoto;
    const pricePerAddedRevision = +formData.pricePerAddedRevision;
    const priceForFasterTurnaround = +formData.priceForFasterTurnaround;
    const priceForEditing = +formData.priceForEditing;

    const finalPrice =
      basePrice +
      pricePerAddedPhoto +
      pricePerAddedRevision +
      priceForFasterTurnaround +
      priceForEditing;

    return finalPrice;
  };

  return (
    <div className="photo-price-modal-overlay">
      <div className="photo-price-modal">
        <header className="modal-header">
          <h2>Photo Pricing</h2>
          <button className="close-button" onClick={closeModal}>
            &times;
          </button>
        </header>
        <form className="modal-form" onSubmit={handleSubmit}>
          <section className="basic-price-section">
            <div className="section-title-tooltip">
              <h3>Basic Price</h3>
              <InfoTooltip infoText="This is your entry-level offer. Aka, the minimum you offer any business willing to work with you !" />
            </div>
            <div className="form-group">
              <label htmlFor="photoOfferName">Give your offer a name</label>
              <input
                type="text"
                id="photoOfferName"
                name="photoOfferName"
                value={formData.photoOfferName}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="minimumPhotoQuantity">
                Minimum Photo Quantity
              </label>
              <input
                type="number"
                id="minimumPhotoQuantity"
                name="minimumPhotoQuantity"
                value={formData.minimumPhotoQuantity}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="freeRevisions">Free Revisions Included</label>
              <input
                type="number"
                id="freeRevisions"
                name="freeRevisions"
                value={formData.freeRevisions}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="turnaroundTime">Turnaround Time (days)</label>
              <input
                type="number"
                id="turnaroundTime"
                name="turnaroundTime"
                value={formData.turnaroundTime}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="basePrice">Base Price</label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                value={formData.basePrice || 0}
                onChange={handleFormChange}
              />
            </div>
          </section>

          <section className="basic-price-section">
            <div className="section-title-tooltip">
              <h3>Add-ons</h3>
              <InfoTooltip infoText="Some businesses just want more. This where you let them know how much they should expect to invest with ya! It's also your chance to straight up make more $$ !" />
            </div>{" "}
            <div className="form-group">
              <label htmlFor="pricePerAddedPhoto">Price per Added Photo</label>
              <input
                type="number"
                id="pricePerAddedPhoto"
                name="pricePerAddedPhoto"
                value={formData.pricePerAddedPhoto}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pricePerAddedRevision">
                Price per Added Revision
              </label>
              <input
                type="number"
                id="pricePerAddedRevision"
                name="pricePerAddedRevision"
                value={formData.pricePerAddedRevision}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceForFasterTurnaround">
                Price for Faster Turnaround Time
              </label>
              <input
                type="number"
                id="priceForFasterTurnaround"
                name="priceForFasterTurnaround"
                value={formData.priceForFasterTurnaround}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceForEditing">Price for Editing</label>
              <input
                type="number"
                id="priceForEditing"
                name="priceForEditing"
                value={formData.priceForEditing}
                onChange={handleFormChange}
              />
            </div>
          </section>

          <div className="final-price-display">
            <label>What you will earn (estimation)</label>
            <span className="final-price">
              {formData.basePrice} - {calculateFinalPrice()} €
            </span>
          </div>

          <button type="submit" className="save-button" onClick={handleSubmit}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhotoPriceModal;
