import React from "react";
import "./dashboard-creator.css";
function PreviousWorkUploadDisplay({
  currentUser,
  handlePreviousWorkUpload,
  handleDeletePreviousWork,
  isUploading,
}) {
  const handleFileChangeWithSizeCheck = (event, originalHandler) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const files = Array.from(event.target.files);
    const filesExceedingLimit = files.filter((file) => file.size > MAX_SIZE);

    if (filesExceedingLimit.length > 0) {
      alert("Some files exceed the maximum size of 5MB.");
    } else {
      originalHandler(event);
    }
  };
  return (
    <div>
      <div className="media-showcase-section-dash">
        <label className="label-title">Previous Work </label>
        <div className="previous-work-slide">
          {currentUser &&
          currentUser.previousWork &&
          currentUser.previousWork.length > 0 ? (
            currentUser.previousWork.map((workData, index) => {
              const workUrl =
                typeof workData === "string" ? workData : workData.url;
              return (
                <div key={index} className="previous-work-container">
                  <img src={workUrl} alt={`Previous work ${index + 1}`} />
                  <button
                    type="button"
                    className="delete-previous-work-button"
                    onClick={() => handleDeletePreviousWork(index)}
                    aria-label="Delete work"
                  >
                    ×
                  </button>
                </div>
              );
            })
          ) : (
            <p>What about your work? Show the people what that face do!</p>
          )}
        </div>
        {isUploading && <div>Upload in progress, please wait...</div>}{" "}
        <input
          type="file"
          name="previousWork"
          id="previousWork"
          onChange={(e) => handlePreviousWorkUpload(e.target.files)}
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

export default PreviousWorkUploadDisplay;
