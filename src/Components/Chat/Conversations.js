import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../Context/firebase";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";

const Conversations = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const [activeConversationId, setActiveConversationId] = useState(null);

  const defaultProfilePic =
    "https://firebasestorage.googleapis.com/v0/b/test-firebase-9badc.appspot.com/o/mockProfilePic%2FDALL%C2%B7E%202024-02-26%2018.11.43%20-%20Create%20a%20gender-neutral%20and%20featureless%20default%20profile%20picture%20representing%20a%20silhouette%20of%20a%20face%20and%20upper%20torso.%20Use%20abstract%20shapes%20like%20circles%20%20(1).png?alt=media&token=a71bd835-6b0a-41c6-9fae-f4f201c28ff2";

  const getUserDetails = async (userId) => {
    
    let userDocSnap = await getDoc(doc(db, "newusers", userId));
    if (!userDocSnap.exists()) {
      userDocSnap = await getDoc(doc(db, "business", userId));
    }
    if (userDocSnap.exists()) {
      return { ...userDocSnap.data(), uid: userId };
    } else {
      console.error("No user found for ID:", userId);
      return null; // Handle this scenario appropriately in your UI
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentUser?.uid) {
      const conversationsQuery = query(
        collection(db, "chats"),
        where("userIds", "array-contains", currentUser.uid)
      );

      unsubscribe = onSnapshot(conversationsQuery, async (querySnapshot) => {
        const docPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const otherUserId = data.userIds.find((id) => id !== currentUser.uid);
          const otherUserDetails = await getUserDetails(otherUserId);
          return {
            id: docSnapshot.id,
            ...data,
            otherUser: otherUserDetails || {
              imgUrl: defaultProfilePic,
              userName: "Unknown User",
            },
          };
        });
        const fetchedConversations = await Promise.all(docPromises);
        setConversations(fetchedConversations);
      });
    }

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleConversationSelect = (conversation) => {
    const isCurrentUserSender = conversation.sender?.uid === currentUser.uid;

    const otherUser = isCurrentUserSender
      ? conversation.recipient
      : conversation.sender;

    dispatch({
      type: "CHANGE_CONVERSATION",
      payload: {
        chatId: conversation.id,
        user: conversation.otherUser,
      },
    });
    navigate(`/messages/${conversation.id}`);
    setActiveConversationId(conversation.id);
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="conversations">
      {conversations.length > 0 ? (
        conversations
          .sort(
            (a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)
          )
          .map((conversation) => {
            const isCurrentUserLastSender =
              conversation.lastMessage.senderId === currentUser.uid;

            const isCurrentUserSender =
              conversation.userIds[0] === currentUser.uid;

            const otherUser = isCurrentUserSender
              ? conversation.recipient
              : conversation.sender;

            return (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`conversationItem ${
                  conversation.id === activeConversationId ? "selected" : ""
                }`}
              >
                <div className="conversation">
                  <div className="conversationID">
                    <img
                      src={conversation.otherUser?.imgUrl || defaultProfilePic}
                      alt={conversation.otherUser?.userName || "User"}
                    />
                    <h3>
                      {conversation.otherUser?.userName || "Unknown User"}
                    </h3>
                  </div>
                  <div className="conversationLastmessage">
                    <p>
                      {isCurrentUserLastSender
                        ? `You: ${truncateText(
                            conversation.lastMessage.text,
                            25
                          )}`
                        : truncateText(conversation.lastMessage.text, 25)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        <p>No active conversations, yet.</p>
      )}
    </div>
  );
};

export default Conversations;
