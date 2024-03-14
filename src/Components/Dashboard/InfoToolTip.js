import React, { useState } from "react";
import "./InfoToolTip.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const InfoTooltip = ({ infoText }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-container">
      <span
        className="info-icon"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <FontAwesomeIcon
          icon={faCircleInfo}
          size="xs"
          style={{ color: "#c9c9c9" }}
        />{" "}
      </span>
      {isVisible && <div className="info-modal">{infoText}</div>}
    </div>
  );
};

export default InfoTooltip;
