import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./Context/AuthContext";
import { ChatContextProvider } from "./Context/ChatContext";
import { FavoritesProvider } from "./Context/FavoritesContext"; // Ensure this path is correct
import { DialogProvider } from "./Context/DialogContext";
import { UserDataProvider } from "./Context/UserDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
