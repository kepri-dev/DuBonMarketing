import React, { useContext } from "react";
import Header from "./Components/common/header.js";
import Footer from "./Components/common/Footer.js";
import UsersOnApp from "./Components/User/users.js";
import "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Hooks/register.js";
import Login from "./Hooks/login.js";
import DashboardCreator from "./Components/Dashboard/dashboard-creator.js";
import Favorites from "./Components/User/Favorites.js";
import Homepagebrands from "./Pages/Homepage-brands.js";
import AllChats from "./Components/Chat/AllChats.js";
import ChatContainer from "./Components/Chat/Chatcontainer.js";
import UserProfilePage from "./Components/User/UserProfilePage.js";
import HirerAccount from "./Components/User/HirerAccount.js";
import OrdersList from "./Components/Orders/OrdersList.js";
import { AuthContext } from "./Context/AuthContext.js";
import "./App.css";

function App() {
  const ProtectedRoute = ({ component: Component }) => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return <Component />;
  };

  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          <Route index element={<Homepagebrands />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard-creator"
            element={<ProtectedRoute component={DashboardCreator} />}
          />
          <Route
            path="/profils"
            element={<ProtectedRoute component={UsersOnApp} />}
          />
          <Route
            path="/favorites"
            element={<ProtectedRoute component={Favorites} />}
          />
          <Route
            path="/messages"
            element={<ProtectedRoute component={AllChats} />}
          />

          <Route
            path="/account"
            element={<ProtectedRoute component={HirerAccount} />}
          />

          <Route
            path="/messages/:conversationId"
            element={<ProtectedRoute component={ChatContainer} />}
          />
          
          <Route
            path="/profile/:userId"
            element={<ProtectedRoute component={UserProfilePage} />}
          />

          <Route
            path="/orders"
            element={<ProtectedRoute component={OrdersList} />}
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
export default App;
