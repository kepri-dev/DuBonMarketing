// // DialogContext.js
// import React, { createContext, useContext, useState } from "react";

// const DialogContext = createContext();

// export const useDialog = () => useContext(DialogContext);

// export const DialogProvider = ({ children }) => {
//   const [openFirstDialog, setOpenFirstDialog] = useState(false);
//   const [openSecondDialog, setOpenSecondDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedCollections, setSelectedCollections] = useState(new Set());

//   const value = {
//     openFirstDialog,
//     setOpenFirstDialog,
//     openSecondDialog,
//     setOpenSecondDialog,
//     selectedUser,
//     setSelectedUser,
//     selectedCollections,
//     setSelectedCollections,
//   };

//   return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
// };
