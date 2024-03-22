import React from "react";
import "./dashboard-creator.css";
function LogoUploadDisplay({
  currentUser,
  handleBrandsLogosUpload,
  handleDeleteBrandLogo,
  isUploading,
}) {
  const handleFileChangeWithSizeCheck = (event, originalHandler) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const files = Array.from(event.target.files);
    const filesExceedingLimit = files.filter((file) => file.size > MAX_SIZE);

    if (filesExceedingLimit.length > 0) {
      alert("Some files exceed the maximum size of 5MB.");
      // You might want to remove the files from the input or handle this differently
    } else {
      // If all files are within the limit, call the original file change handler
      originalHandler(event);
    }
  };
  return (
    <div>
      <div className="logos-dash">
        <label className="label-title">Brands Logos </label>
        <div className="logos-slide-preview">
          {currentUser &&
          currentUser.brandsLogos &&
          currentUser.brandsLogos.length > 0 ? (
            currentUser.brandsLogos.map((logoData, index) => {
              // Determine if logoData is a string or an object and extract the URL accordingly
              const logoUrl =
                typeof logoData === "string" ? logoData : logoData.url;
              return (
                <div key={index} className="logo-container">
                  <img src={logoUrl} alt={`Brand logo ${index + 1}`} />
                  <button
                    type="button"
                    className="delete-logo-button"
                    onClick={(event) => handleDeleteBrandLogo(index, event)}
                    aria-label="Delete logo"
                  >
                    ×
                  </button>
                </div>
              );
            })
          ) : (
            <p>Got companies you made UGCs for? Upload their logos up!</p>
          )}
        </div>
        {isUploading && <div>Upload in progress, please wait...</div>}{" "}
        <input
          type="file"
          name="brandsLogos"
          onChange={(e) => handleBrandsLogosUpload(e.target.files)}
          className="file-input"
          multiple
          accept="image/*,video/*"
        />
        <div className="file-upload-instructions">
          <p>
            Consider using{" "}
            <a
              href="https://tinypng.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              TinyPNG
            </a>{" "}
            to reduce the size of your PNG files.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogoUploadDisplay;
