//Dialogs.js
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import React, { useContext } from "react";

export default function Dialogs({
  openFirstDialog,
  setOpenFirstDialog,
  openSecondDialog,
  setOpenSecondDialog,
  collections,
  selectedCollections,
  handleCheckboxChange,
  handleSaveAndClose,
  collectionName,
  setCollectionName,
  addToFavoritesList,
  selectedUser,
  handleCollectionNameChange,
  
}) {

  return (
    <>
      <Dialog
        open={openFirstDialog}
        onClose={() => setOpenFirstDialog(false)}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogContent className="DialogContent">
          <h2 className="dialog-title">Your Collections</h2>
          <div className="collections-list">
            {Object.keys(collections).map((collectionName) => (
              <div key={collectionName} className="collection-item">
                <label htmlFor={collectionName} className="checkbox-container">
                  <input
                    type="checkbox"
                    id={collectionName}
                    checked={selectedCollections.has(collectionName)}
                    onChange={() => handleCheckboxChange(collectionName)}
                  />
                  <span className="checkmark"></span>
                  {collectionName}
                </label>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setOpenSecondDialog(true)}
            className="DialogActions"
          >
            + New List
          </button>
          <button onClick={handleSaveAndClose} className="DialogActions">
            Save & Close
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSecondDialog}
        onClose={() => setOpenSecondDialog(false)}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogContent>
          <h2 className="dialog-title">Create a New Collection</h2>
          <input
            type="text"
            value={collectionName}
            className="collection-input"
            placeholder="Your favorite collection name"
            onChange={handleCollectionNameChange}
          />
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => {
              addToFavoritesList(collectionName, selectedUser);
              setOpenSecondDialog(false);
              setCollectionName("");
            }}
            className="DialogActions"
          >
            Confirm New Favs
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
