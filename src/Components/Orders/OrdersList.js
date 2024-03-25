import { db } from "../../Context/firebase";
import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import "./orders.css";
import { useNavigate } from "react-router-dom";

function OrdersList({}) {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const statusColors = {
    pending: "grey",
    rejected: "red",
    accepted: "lightblue",
    confirmed: "blue",
    delivered: "green",
    "order-closed": "black",
  };

  const [ordersByStatus, setOrdersByStatus] = useState({
    pending: [],
    rejected: [],
    accepted: [],
    confirmed: [],
    delivered: [],
    "order-closed": [],
  });

  const navigate = useNavigate();

  const handleOrderSelect = (order) => {
    dispatch({
      type: "CHANGE_CONVERSATION",
      payload: {
        chatId: order.chatId,
        user: order.otherUser,
      },
    });
    navigate(`/messages/${order.chatId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser || !currentUser.uid) {
        console.log("CurrentUser is not defined yet.");
        return;
      }
      const ordersCollectionRef = collection(db, "orders");
      const q = query(
        ordersCollectionRef,
        where("businessId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      const newOrdersByStatus = {
        pending: [],
        rejected: [],
        accepted: [],
        confirmed: [],
        delivered: [],
        "order-closed": [],
      };

      for (const docs of querySnapshot.docs) {
        const orderData = docs.data();
        let userRef, userId;

        if (orderData.businessId && orderData.businessId === currentUser.uid) {
          userRef = "newusers";
          userId = orderData.creatorId;
        } else if (
          orderData.creatorId &&
          orderData.creatorId === currentUser.uid
        ) {
          userRef = "business";
          userId = orderData.businessId;
        } else {
          continue;
        }

        // Fetch the user's data
        const userDocRef = doc(db, userRef, userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();

          const otherUser = {
            id: userId,
            userName: userData.userName,
            imgUrl: userData.imgUrl,
          };

          const orderWithDetails = {
            ...orderData,
            otherUser,
          };

          if (newOrdersByStatus.hasOwnProperty(orderData.status)) {
            newOrdersByStatus[orderData.status].push(orderWithDetails);
          }
        }
      }

      setOrdersByStatus(newOrdersByStatus);
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <div className="orders-container">
      {Object.entries(ordersByStatus).map(([status, ordersForStatus]) => (
        <div key={status} className="status-column">
          <h3 style={{ color: statusColors[status] }}>
            {status.toUpperCase()}
          </h3>
          <div className="orders-list">
            {ordersForStatus.map((order, index) => (
              <div
                key={index}
                className="order-item"
                onClick={() => handleOrderSelect(order)}
              >
                {" "}
                <img
                  src={order.otherUser.imgUrl}
                  alt={order.otherUser.userName}
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                  }}
                />
                <div className="orderDetails">
                  <h4 className="orderValue">{order.otherUser.userName}</h4>
                  <p>
                    <span className="orderKey">Budget:</span>{" "}
                    <span className="orderValue">
                      {order.details
                        ? order.details.budget ?? order.details.Budget
                          ? (order.details.budget ?? order.details.Budget)
                              .toString()
                              .toUpperCase()
                          : "N/A"
                        : "N/A"}
                      $
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersList;
