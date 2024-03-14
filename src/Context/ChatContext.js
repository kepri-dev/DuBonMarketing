import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: null,
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        if (!currentUser.uid || !action.payload.uid) {
          console.error("User IDs not found.");
          return state;
        }

        const newChatId =
          currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid;

        return {
          ...state,
          user: {
            ...action.payload,
            userType: action.payload.userType || "defaultType", // Provide a default value if undefined
          },
          chatId: newChatId,
        };

      case "CHANGE_CONVERSATION":
        return {
          ...state,
          chatId: action.payload.chatId,
          user: action.payload.user,
        };

      case "UPDATE_USER_DATA":
        // Ensure the chatId matches before updating user data
        if (state.chatId.includes(action.payload.uid)) {
          return {
            ...state,
            user: {
              ...state.user,
              ...action.payload,
            },
          };
        } else {
          return state;
        }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

