// import React, { useContext, useState } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   setDoc,
//   doc,
//   updateDoc,
//   serverTimestamp,
//   getDoc,
// } from "firebase/firestore";
// import { AuthContext } from "../../Context/AuthContext";
// import { ChatContext } from "../../Context/ChatContext";
// import { useNavigate } from "react-router-dom";
// import { db } from "../../Context/firebase";

// const Search = () => {
//   const [username, setUsername] = useState("");
//   const [user, setUser] = useState(null);
//   const [err, setErr] = useState(false);
//   const [activeConversationId, setActiveConversationId] = useState(null);
//   const navigate = useNavigate();
//   const { currentUser } = useContext(AuthContext);
//   const { dispatch } = useContext(ChatContext);

//   const handleSearch = async () => {
//     const q = query(
//       collection(db, "newusers"),
//       where("userName", "==", username)
//     );

//     try {
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         setUser(doc.data());
//       });
//     } catch (err) {
//       setErr(true);
//     }
//   };

//   const handleKey = (e) => {
//     e.code === "Enter" && handleSearch();
//   };

//   const handleSelect = async () => {
//     const combinedId =
//       currentUser.uid > user.uid
//         ? currentUser.uid + user.uid
//         : user.uid + currentUser.uid;

//     try {
//       const res = await getDoc(doc(db, "chats", combinedId));

//       if (!res.exists()) {
//         await setDoc(doc(db, "chats", combinedId), { messages: [] });

//         await updateDoc(doc(db, "messages", currentUser.uid), {
//           [combinedId + ".userInfo"]: {
//             uid: user.uid,
//             userName: user.userName,
//             imgUrl: user.imgUrl,
//           },
//           [combinedId + ".date"]: serverTimestamp(),
//         });

//         await updateDoc(doc(db, "messages", user.uid), {
//           [combinedId + ".userInfo"]: {
//             uid: currentUser.uid,
//             userName: currentUser.userName,
//             imgUrl: currentUser.imgUrl,
//           },
//           [combinedId + ".date"]: serverTimestamp(),
//         });
//         dispatch({
//           type: "CHANGE_CONVERSATION",
//           payload: {
//             chatId: combinedId,
//             user: user,
//           },
//         });
//         navigate(`/messages/${combinedId}`);
//         setActiveConversationId(combinedId);
//       }
//     } catch (err) {}

//     setUser(null);
//     setUsername("");
//   };
//   return (
//     <div className="search">
//       <div className="searchForm">
//         <input
//           type="text"
//           placeholder="Find a user"
//           onKeyDown={handleKey}
//           onChange={(e) => setUsername(e.target.value)}
//           value={username}
//         />
//       </div>
//       {err && <span>User not found!</span>}
//       {user && (
//         <div onClick={() => handleSelect()}>
//           <img src={user.imgUrl} alt="" />
//           <div className="userChatInfo">
//             <span>{user.userName}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;
