import React, { useState } from "react";
import "./register.css";
import { doc, setDoc } from "firebase/firestore";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../Context/firebase";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const roles = [{ role: "For Brands" }, { role: "For Creators" }];

  const defaultProfilePic =
    "https://firebasestorage.googleapis.com/v0/b/test-firebase-9badc.appspot.com/o/mockProfilePic%2FDALL%C2%B7E%202024-02-26%2018.11.43%20-%20Create%20a%20gender-neutral%20and%20featureless%20default%20profile%20picture%20representing%20a%20silhouette%20of%20a%20face%20and%20upper%20torso.%20Use%20abstract%20shapes%20like%20circles%20%20(1).png?alt=media&token=a71bd835-6b0a-41c6-9fae-f4f201c28ff2";
  const defaultCoverPic =
    "https://firebasestorage.googleapis.com/v0/b/test-firebase-9badc.appspot.com/o/mockCoverPic%2FDALL%C2%B7E%202024-02-26%2018.08.07%20-%20Design%20a%20sophisticated%20and%20stylish%20default%20cover%20picture%20for%20an%20app%20named%20DuBonMarketing%2C%20which%20is%20used%20by%20content%20creators%20to%20sell%20UGC%20services.%20The%20%20(1).png?alt=media&token=7803ef9b-0d5b-4ea1-af4b-5ba0ff331725";
  const onSub = async (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const collectionName =
          role === "For Creators" ? "newusers" : "business";

        try {
          const userRef = doc(db, collectionName, user.uid);

          const updateData = {
            uid: user.uid,
            userName,
            userNameLower: userName.toLowerCase(),
            email: user.email,
            role: role,
            imgUrl: defaultProfilePic,
            coverUrl: defaultCoverPic,
            profileComplete: false,
          };

          await setDoc(userRef, updateData);
          // await setDoc(doc(db, "messages", user.uid), {});

          const navigatePath =
            role === "For Creators" ? "/dashboard-creator" : "/profils";
          navigate(navigatePath);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        alert(errorCode);
      });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={onSub}>
        <h2>Register</h2>
        <label>Your full name</label>

        <input
          type="text"
          placeholder="Your full Name"
          name="username"
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
        <div className="role-pick-register">
          <h1>Please pick your role</h1>
          <h3>
            If you are a business looking for creators, select 'For brands'. In
            case you are a creator, please select 'For Creators'
          </h3>
          {roles.map((item, index) => (
            <label className="checkbox-container" key={index}>
              <input
                type="radio"
                name="role"
                value={item.role}
                checked={role === item.role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <span
                className={role === item.role ? "checkmark" : "radio-custom"}
              ></span>
              {item.role}
            </label>
          ))}
        </div>

        {/* <label className="checkbox-container">
          <input type="checkbox" name="terms" required />{" "}
          <span className="checkmark"></span>I accept the Terms and Conditions
        </label> */}
        <button type="submit" onClick={onSub}>
          Register
        </button>
      </form>
      <p>
        Already have an account? <NavLink to="/login">Sign in</NavLink>
      </p>
    </div>
  );
};

export default Register;
