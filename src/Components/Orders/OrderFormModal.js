import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { placeOrder } from "./OrderFunctions";
import { ChatContext } from "../../Context/ChatContext";

const OrderFormModal = ({ isOpen, onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [productCategory, setProductCategory] = useState("");
  const [contentType, setContentType] = useState("");
  const [intentOfUse, setIntentOfUse] = useState("");
  const [quantity, setQuantity] = useState("");
  const [includedRevisions, setIncludedRevisions] = useState("");
  const [turnoverTime, setTurnoverTime] = useState("");
  const [addedServices, setAddedServices] = useState([]);
  const [budget, setBudget] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { data } = useContext(ChatContext);

  const businessId = currentUser?.uid;
  const creatorId = data?.user?.uid;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderDetails = {
      "Category of product": productCategory,
      "Type of content": contentType,
      "Intent of use": intentOfUse,
      Quantity: quantity,
      "Included revisions": includedRevisions,
      "Turnover time": turnoverTime,
      "Added services": addedServices,
      Budget: budget,
    };

    if (
      !orderDetails["Category of product"] ||
      !orderDetails["Type of content"] ||
      !orderDetails["Intent of use"] ||
      !orderDetails["Quantity"]
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await placeOrder({
        chatId: data.chatId,
        creatorId: creatorId,
        businessId: businessId,
        orderDetails: orderDetails,
      });
      setOrderPlaced(true);
      onClose();
      alert("Order successfully placed.");
    } catch (error) {
      console.error("Failed to place order:Subimit", error);
      alert("Failed to place order. Please try again.");
    }
    setOrderPlaced(false);
  };

  if (orderPlaced) {
    return <div>Order has been placed. Waiting for confirmation.</div>;
  }

  const handleServiceChange = (e) => {
    const service = e.target.value;
    if (e.target.checked) {
      setAddedServices([...addedServices, service]);
    } else {
      setAddedServices(addedServices.filter((s) => s !== service));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button onClick={onClose} className="modal-close-btn">
          X
        </button>
        <h2>Place Order</h2>
        <form onSubmit={handleSubmit}>
          {/* Existing fields */}
          <label>
            Product Category:
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
          </label>
          <label>
            Type of Content:
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="video">Video</option>
              <option value="photo">Photo</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>
            Intent of Use:
            <select
              value={intentOfUse}
              onChange={(e) => setIntentOfUse(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="organic posting">Organic Posting</option>
              <option value="advertising">Advertising</option>
            </select>
          </label>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <label>
            Included Revisions:
            <input
              type="number"
              value={includedRevisions}
              onChange={(e) => setIncludedRevisions(e.target.value)}
            />
          </label>
          <label>
            Turnover Time (days):
            <input
              type="number"
              value={turnoverTime}
              onChange={(e) => setTurnoverTime(e.target.value)}
            />
          </label>
          <fieldset>
            <legend>Added Services:</legend>
            <label>
              <input
                type="checkbox"
                value="Script creation"
                onChange={handleServiceChange}
              />{" "}
              Script creation
            </label>
            <label>
              <input
                type="checkbox"
                value="Editing"
                onChange={handleServiceChange}
              />{" "}
              Editing
            </label>
            <label>
              <input
                type="checkbox"
                value="Voiceover"
                onChange={handleServiceChange}
              />{" "}
              Voiceover
            </label>
            <label>
              <input
                type="checkbox"
                value="Video rush"
                onChange={handleServiceChange}
              />{" "}
              Video rush
            </label>
          </fieldset>
          <label>
            Budget ($):
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>
          <button className="submit-order-modal" type="submit">
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;
