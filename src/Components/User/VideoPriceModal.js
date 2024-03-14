import React, { useState, useEffect } from "react";
import "./pricemodal.css";
import { auth, storage, db } from "../../Context/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import InfoTooltip from "../Dashboard/InfoToolTip";

const VideoPriceModal = ({ closeModal }) => {
  const defaultFormData = {
    videoOfferName: "Name your offer here",
    minimumVideoQuantity: 1,
    freeRevisionsVideo: 0,
    turnaroundTimeVideo: 1,
    pricePerAddedVideo: 0,
    pricePerAddedRevisionVideo: 0,
    priceForFasterTurnaroundVideo: 0,
    priceForEditingVideo: 0,
    priceForBriefCreation: 0,
    priceforAddedVoiceOver: 0,
    priceForAddedHooks: 0,
    basePriceVideo: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchFormData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "newusers", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().videoPrice) {
            // Convert the array to an object
            const videoPriceData = docSnap
              .data()
              .videoPrice.reduce((obj, item) => {
                obj[item.key] = item.value;
                return obj;
              }, {});

            // Set the form data, using the fetched values or default values as fallback
            setFormData({ ...defaultFormData, ...videoPriceData });
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
    // Convert the value to a number before setting it in the state
    // const numericalValue = value === "" ? "" : Number(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "newusers", user.uid);
      // Convert formData into an array of { key, value } objects
      const videoPriceArray = Object.entries(formData).map(([key, value]) => ({
        key: key,
        value: value,
      }));

      try {
        // Update Firestore document with photoPriceArray
        await updateDoc(userRef, {
          videoPrice: videoPriceArray,
        });
        console.log("video Pricing updated successfully");
        closeModal(); // Close modal on success
      } catch (error) {
        console.error("Error updating pricing: ", error);
      }
    } else {
      console.log("No user is logged in");
    }
  };

  const calculateFinalPrice = () => {
    const basePriceVideo = +formData.basePriceVideo;
    const pricePerAddedVideo = +formData.pricePerAddedVideo;
    const pricePerAddedRevisionVideo = +formData.pricePerAddedRevisionVideo;
    const priceForFasterTurnaroundVideo =
      +formData.priceForFasterTurnaroundVideo;
    const priceForEditingVideo = +formData.priceForEditingVideo;
    const priceForBriefCreation = +formData.priceForBriefCreation;
    const priceForAddedHooks = +formData.priceForAddedHooks;
    const priceforAddedVoiceOver = +formData.priceforAddedVoiceOver;

    const finalPriceVideo =
      basePriceVideo +
      pricePerAddedVideo +
      pricePerAddedRevisionVideo +
      priceForFasterTurnaroundVideo +
      priceForEditingVideo +
      priceForBriefCreation +
      priceForAddedHooks +
      priceforAddedVoiceOver;

    return finalPriceVideo;
  };

  return (
    <div className="photo-price-modal-overlay">
      <div className="photo-price-modal">
        <header className="modal-header">
          <h2>Video Pricing</h2>
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
              <label htmlFor="videoOfferName">Give your offer a name</label>
              <input
                type="text"
                id="videoOfferName"
                name="videoOfferName"
                value={formData.videoOfferName}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="minimumVideoQuantity">
                Minimum Video Quantity
              </label>
              <input
                type="number"
                id="minimumVideoQuantity"
                name="minimumVideoQuantity"
                value={formData.minimumVideoQuantity}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="freeRevisionsVideo">
                Free Revisions Included
              </label>
              <input
                type="number"
                id="freeRevisionsVideo"
                name="freeRevisionsVideo"
                value={formData.freeRevisionsVideo}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="turnaroundTimeVideo">
                Turnaround Time (days)
              </label>
              <input
                type="number"
                id="turnaroundTimeVideo"
                name="turnaroundTimeVideo"
                value={formData.turnaroundTimeVideo}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="basePriceVideo">Base Price</label>
              <input
                type="number"
                id="basePriceVideo"
                name="basePriceVideo"
                value={formData.basePriceVideo}
                onChange={handleFormChange}
                required
              />
            </div>
          </section>

          <section className="basic-price-section">
            <div className="section-title-tooltip">
              <h3>Add-ons</h3>
              <InfoTooltip infoText="Some businesses just want more. This where you let them know how much they should expect to invest with ya! It's also your chance to straight up make more $$ !" />
            </div>{" "}
            <div className="form-group">
              <label htmlFor="pricePerAddedVideo">Price per Added Video</label>
              <input
                type="number"
                id="pricePerAddedVideo"
                name="pricePerAddedVideo"
                value={formData.pricePerAddedVideo}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pricePerAddedRevisionVideo">
                Price per Added Revision
              </label>
              <input
                type="number"
                id="pricePerAddedRevisionVideo"
                name="pricePerAddedRevisionVideo"
                value={formData.pricePerAddedRevisionVideo}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceForFasterTurnaroundVideo">
                Price for Faster Turnaround Time
              </label>
              <input
                type="number"
                id="priceForFasterTurnaroundVideo"
                name="priceForFasterTurnaroundVideo"
                value={formData.priceForFasterTurnaroundVideo}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceForEditingVideo">Price for Editing</label>
              <input
                type="number"
                id="priceForEditingVideo"
                name="priceForEditingVideo"
                value={formData.priceForEditingVideo}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceForBriefCreation">
                Price for Brief Creation
              </label>
              <input
                type="number"
                id="priceForBriefCreation"
                name="priceForBriefCreation"
                value={formData.priceForBriefCreation}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceForAddedHooks">Price Per New Hook</label>
              <input
                type="number"
                id="priceForAddedHooks"
                name="priceForAddedHooks"
                value={formData.priceForAddedHooks}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceforAddedVoiceOver">
                Price for Voice Over
              </label>
              <input
                type="number"
                id="priceforAddedVoiceOver"
                name="priceforAddedVoiceOver"
                value={formData.priceforAddedVoiceOver}
                onChange={handleFormChange}
              />
            </div>
          </section>

          <div className="final-price-display">
            <label>What you will earn (estimation)</label>
            <span className="final-price">
              {formData.basePriceVideo} - {calculateFinalPrice()} €
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

export default VideoPriceModal;
