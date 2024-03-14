import React, { useState, useEffect, useContext } from "react";
import { db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import "./orders.css";
import { updateOrderStatus } from "./OrderFunctions";
import OrderItem from "./OrderItem";

const OrderManagement = ({ chatId }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [isOpen, setIsOpen] = useState({});
  const [isCreator, setIsCreator] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [orderStatus, setOrderStatus] = useState(orders?.status);

  useEffect(() => {
    setLoading(true); // Ensure loading state is true when starting a new fetch
    setOrders([]); // Reset orders state
    const fetchOrder = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("chatId", "==", chatId));
        const querySnapshot = await getDocs(q);

        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (ordersData.length > 0) {
          // Now ordersData is an array of orders
          console.log("Orders found:", ordersData);
          setOrders(ordersData); // Assuming setOrders is designed to handle an array of orders
          const newIsOpen = ordersData.reduce((acc, order) => {
            acc[order.id] = false; // Initialize all as closed
            return acc;
          }, {});
          setIsOpen(newIsOpen);
          // Check if the current user is the creator of any of these orders
          const isCreatorOfAnyOrder = ordersData.some(
            (order) => currentUser?.uid === order.creatorId
          );
          setIsCreator(isCreatorOfAnyOrder);
          const isBusinessOfAnyOrder = ordersData.some(
            (order) => currentUser?.uid === order.businessId
          );
          setIsBusiness(isBusinessOfAnyOrder);
        } else {
          console.log("No such order!");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchOrder();
    } else {
      console.log("No chatId provided");
      setLoading(false);
      setOrders([]);
    }
  }, [chatId, currentUser]);

  const toggleOpen = (orderId) => {
    setIsOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleAcceptReject = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Order ${newStatus}.`);
      // Update the specific order's status in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert(`Failed to ${newStatus} order. Please try again.`);
      console.error(`Error ${newStatus}ing order: `, error);
    }
  };

  const handleConfirm = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Order ${newStatus}.`);
      // Update the specific order's status in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert(`Failed to ${newStatus} order. Please try again.`);
      console.error(`Error ${newStatus}ing order: `, error);
    }
  };

  const handleFinish = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Order ${newStatus}.`);
      // Update the specific order's status in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert(`Failed to ${newStatus} order. Please try again.`);
      console.error(`Error ${newStatus}ing order: `, error);
    }
  };

  const handleRevision = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Order ${newStatus}.`);
      // Update the specific order's status in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert(`Failed to ${newStatus} order. Please try again.`);
      console.error(`Error ${newStatus}ing order: `, error);
    }
  };


  if (loading) return <div>Loading order details...</div>;

  return (
    <div>
      <h3>Order History</h3>
      {orders && orders.length > 0 ? (
        orders
          .sort((a, b) => b.createdAt - a.createdAt) // Sorting orders in descending order by createdAt
          .map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              isOpen={isOpen[order.id]}
              toggleOpen={() => toggleOpen(order.id)}
              handleAcceptReject={handleAcceptReject}
              handleConfirm={handleConfirm}
              handleFinish={handleFinish}
              handleRevision={handleRevision}
              isCreator={isCreator}
              isBusiness={isBusiness}
            />
          ))
      ) : (
        <div>
          {isBusiness ? (
            <p>
              No orders found. Start by creating a new order to engage with
              creators!
            </p>
          ) : (
            <p>
              You have no orders with this business. Check back later or
              initiate a conversation!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
