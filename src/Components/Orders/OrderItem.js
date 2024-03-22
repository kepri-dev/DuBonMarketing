import React, { useContext, useState, useEffect } from "react";
import { updateOrderStatus, leaveReview } from "./OrderFunctions";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import "./orders.css";
const OrderItem = ({
  order,
  toggleOpen,
  isOpen,
  handleAcceptReject,
  handleConfirm,
  handleFinish,
  handleRevision,
  isCreator,
  isBusiness,
}) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleReviewSubmit = async (e, orderId) => {
    e.preventDefault();
    const rating = e.target.rating.value;
    const text = e.target.review.value;
    const businessId = currentUser?.uid;
    const creatorId = data?.user?.id;
    console.log("creator ID:", creatorId); // Ensure this is not undefined
    await leaveReview({
      chatId: data.chatId,
      businessId: businessId,
      creatorId: creatorId, // This is coming as undefined
      rating,
      text,
    });

    try {
      // Leave a review
      await leaveReview({
        chatId: data.chatId,
        businessId: businessId,
        creatorId: creatorId,
        rating,
        text,
      });

      console.log("Updating status for order ID:", orderId);
      await updateOrderStatus(orderId, "order-closed");

      alert("Review submitted successfully and order closed!");
    } catch (error) {
      alert("Failed to submit review: " + error.message);
    }
  };
  const { id, status, createdAt, details } = order;
  const statusColors = {
    pending: "grey",
    rejected: "red",
    accepted: "lightblue",
    completed: "blue",
    delivered: "green",
  };
  return (
    <div
      className="order-listing"
      onClick={toggleOpen}
      style={{ cursor: "pointer" }}
    >
      <p
        className={`order-status ${order.status}`}
        style={{ color: statusColors[status] }}
      >
        <strong>Status:</strong> <strong>{order.status}</strong>
      </p>
      <p className="order-date-creation">
        <strong>Created on</strong>{" "}
        <strong>
          {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
        </strong>
      </p>
      {isCreator && order.status === "pending" && (
        <div className="status-pending-buttons">
          <button
            onClick={() => handleAcceptReject(id, "accepted")}
            className="accept-order"
          >
            Accept
          </button>
          <button
            onClick={() => handleAcceptReject(id, "rejected")}
            className="reject-order"
          >
            Reject
          </button>
        </div>
      )}
      {isCreator && order.status === "accepted" && (
        <div className="status-pending-buttons">
          <h3 className="pending-delivery">PENDING DELIVERY</h3>
          <button
            onClick={() => handleConfirm(id, "confirmed")}
            className="confirm-delivery"
          >
            Confirm Delivery
          </button>
        </div>
      )}

      {isCreator && order.status === "revision-accepted" && (
        <div className="status-pending-buttons">
          <h3 className="pending-delivery">PENDING DELIVERY</h3>
          <button
            onClick={() => handleConfirm(id, "confirmed")}
            className="confirm-delivery"
          >
            Confirm Delivery
          </button>
        </div>
      )}
      {isCreator && order.status === "confirmed" && (
        <div>
          <h3>PENDING CONFIRMATION</h3>
        </div>
      )}

      {isCreator && order.status === "pending-revision" && (
        <div className="status-pending-buttons">
          <h3>PENDING REVISION</h3>
          <button
            onClick={() => handleAcceptReject(id, "revision-accepted")}
            className="accept-order"
          >
            Accept Revision
          </button>
          <button
            onClick={() => handleAcceptReject(id, "revision-rejected")}
            className="reject-order"
          >
            Reject Revision
          </button>
        </div>
      )}
      {isBusiness && order.status === "accepted" && (
        <div className="status-pending-buttons">
          <h3 className="pending-delivery">PENDING DELIVERY</h3>
        </div>
      )}
      {isBusiness && order.status === "confirmed" && (
        <div className="status-confirmed-buttons">
          <div>
            <p>Need more revisions?</p>
            <button onClick={() => handleRevision(id, "pending-revision")}>
              Apply for a revision
            </button>
          </div>
          <div>
            <p>All good?</p>
            <button onClick={() => handleFinish(id, "delivered")}>
              Confirm & finish order
            </button>
            <p>
              PS: The order will automatically be confirmed and finish 7 days
              afteer its submission by the creator !
            </p>
          </div>
        </div>
      )}
      {isBusiness && order.status === "delivered" && (
        <div className="review-section">
          <h3 className="pending-delivery">LEAVE A REVIEW</h3>
          <form
            className="review-form"
            onSubmit={(e) => handleReviewSubmit(e, order.id)}
          >
            <div className="rating-section">
              <h3>Rating</h3>
              <label htmlFor="rating-select">Choose a rating:</label>
              <select id="rating-select" name="rating" required>
                <option value="">Rating / 5</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div className="review-textarea">
              <label htmlFor="review-text">Your Review:</label>
              <textarea
                id="review-text"
                name="review"
                rows="4"
                required
                placeholder="Share your experience with this order..."
              ></textarea>
            </div>
            <button type="submit" className="submit-review-btn">
              Leave My Review
            </button>
          </form>
        </div>
      )}

      {isBusiness && order.status === "order-closed" && <div></div>}

      {isOpen && (
        <>
          <ul>
            {Object.entries(order.details).map(([key, value]) => {
              if (typeof value === "string" && key === "addedServices") {
                value = value.split(" ").join(", ");
              }
              return (
                <li key={key}>
                  <span className="orderKey">{key}:</span>{" "}
                  <span className="orderValue">
                    {value.toString().toUpperCase()}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default OrderItem;
