import React from "react";

function RatesDisplay({ pricingType, pricingData, toggleModal }) {
  const basePackageAttributes = new Set([
    "minimumPhotoQuantity",
    "freeRevisions",
    "turnaroundTime",
    "minimumVideoQuantity",
    "freeRevisionsVideo",
    "turnaroundTimeVideo",
  ]);

  function formatServiceName(key) {
    const replacements = {
      pricePerAddedVideo: "Additional Video",
      pricePerAddedRevisionVideo: "Additional Revision",
      priceForFasterTurnaroundVideo: "Faster Turnaround",
      priceForEditingVideo: "Video Editing",
      priceForBriefCreation: "Brief Creation",
      priceforAddedVoiceOver: "Voice-Over",
      priceForAddedHooks: "Added Hooks",
      pricePerAddedPhoto: "Additional Photo",
      pricePerAddedRevision: "Additional Revision",
      priceForFasterTurnaround: "Faster Turnaround",
      priceForEditing: "Video Editing",
    };

    return (
      replacements[key] ||
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    );
  }

  return (
    <div className="pricing-plan">
      <div className="pricing-details">
        <h2>
          {pricingType === "photo"
            ? Array.isArray(pricingData)
              ? pricingData.find((v) => v.key === "photoOfferName")?.value ||
                "N/A"
              : pricingData || "N/A"
            : Array.isArray(pricingData)
            ? pricingData.find((v) => v.key === "videoOfferName")?.value ||
              "N/A"
            : pricingData || "N/A"}
        </h2>
        <p>
          from{" "}
          {Array.isArray(pricingData)
            ? pricingData.find((p) => p.key.includes("basePrice"))?.value ||
              "N/A"
            : pricingData || "N/A"}{" "}
          €
        </p>
      </div>

      <div>
        <ul>
          {Array.isArray(pricingData) &&
            pricingData.map((item) => {
              if (!basePackageAttributes.has(item.key)) return null;

              const value =
                item.key === "turnaroundTime" ||
                item.key === "turnaroundTimeVideo"
                  ? `Delivered in ${item.value} days`
                  : `${item.value} ${item.key
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`;

              return <li key={item.key}>{value}</li>;
            })}
        </ul>
      </div>
      <div className="add-ons">
        <h3>Add-ons</h3>
        <ul>
          {Array.isArray(pricingData) &&
            pricingData.map((item) => {
              if (
                basePackageAttributes.has(item.key) ||
                item.key.includes("basePrice") ||
                item.key.includes("videoOfferName") ||
                item.key.includes("photoOfferName")
              )
                return null;

              return (
                <li key={item.key}>
                  <span className="description">
                    {formatServiceName(item.key)}
                  </span>{" "}
                  <span className="price">
                    {typeof item.value === "object"
                      ? item.value.someProperty
                      : item.value}
                    €
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
      <button onClick={toggleModal} className="edit-rates-button" type="button">
        Set {pricingType === "photo" ? "Photo" : "Video"} Price
      </button> 
      <p className="please-refresh">Please save & refresh to see the updated rates !</p>
    </div>
  );
}

export default RatesDisplay;
