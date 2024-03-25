import React, { useContext, useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";
import Conversations from "./Conversations";
import StartConversation from "./StartConversation";
import OrderManagement from "../Orders/OrderManagement";
import OrderFormModal from "../Orders/OrderFormModal";
import { ChatContext } from "../../Context/ChatContext";
import "./Chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../Context/AuthContext";
import Sidebar from "./Sidebar";
import ConversationHeader from "./ConversationHeader";

const ChatContainer = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="chatLayout">
      <div className="chatApp">
        <div className="searchAndConversations">
          <StartConversation />

          <Sidebar />
        </div>
        <div className="conversationArea">
          {data && data.chatId ? (
            <>
              <div>
                <ConversationHeader data={data} />
              </div>
              <div className="messagesArea">
                <Messages />
              </div>
              <Input />
            </>
          ) : (
            <div className="conversationArea-div">
              <FontAwesomeIcon
                icon={faInbox}
                size="xl"
                style={{ color: "#040039" }}
              />
              <p> Please select a user to start chatting</p>
            </div>
          )}
        </div>

        <OrderFormModal chatId={data.chatId} creatorId={data?.user?.uid} />

        <div className="orderManagementArea">
          {data && data.chatId ? (
            <OrderManagement chatId={data.chatId} />
          ) : (
            <div>Select a conversation to manage orders.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
