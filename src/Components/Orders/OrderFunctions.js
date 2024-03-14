import { db } from "../../Context/firebase";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export const placeOrder = async ({
  creatorId,
  businessId,
  orderDetails,
  chatId,
}) => {
  const ordersCollectionRef = collection(db, "orders"); // Reference to the orders collection
  const newOrder = {
    chatId,
    creatorId,
    businessId,
    details: orderDetails, // Object containing order specifics
    status: "pending", // Initial status
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(ordersCollectionRef, newOrder);
    console.log("Order placed with ID: ", docRef.id);
    return docRef.id; // Firestore generates a unique ID for the new order
  } catch (error) {
    console.error("Error placing order: ", error);
    throw new Error("Failed to place order.");
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
    });
    console.log("Order updated to status: ", newStatus);
  } catch (error) {
    console.error("Error updating order: ", error);
  }
};

export const leaveReview = async ({
  chatId,
  businessId,
  creatorId,
  rating,
  text,
}) => {
  const reviewsCollection = collection(db, "reviews");
  const newReview = {
    chatId,
    businessId,
    creatorId,
    rating,
    text,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(reviewsCollection, newReview);
    console.log("Review left with ID: ", docRef.id);
    return docRef.id; // Return the review ID for further reference if needed
  } catch (error) {
    console.error("Error leaving review: ", error);
    throw new Error("Failed to leave review.");
  }
};
