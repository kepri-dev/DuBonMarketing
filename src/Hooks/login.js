import React, { useState } from "react";
import "./login.css";
import { getDoc, doc } from "firebase/firestore";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../Context/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmission = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(userCredential.user);

      let userDocRef = doc(db, "newusers", user.uid);
      let userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        userDocRef = doc(db, "business", user.uid);
        userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          navigate("/profils");
        }
      } else {
        navigate("/dashboard-creator");
      }
    } catch (error) {
      console.error("Error signing in with email and password", error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmission}>
        <h2>Log In</h2>
        <label> E-mail</label>
        <input
          type="email"
          placeholder="E-mail"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label> Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        No accounts yet? <NavLink to="/register">Register Now!</NavLink>
      </p>
    </div>
  );
};

export default Login;
