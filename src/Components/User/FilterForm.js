import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function FilterForm({
  uniqueGenders,
  selectedGender,
  handleGenderChange,
  ageRange,
  handleAgeChange,
  newMinAge,
  newMaxAge,
  predefinedIndustries,
  selectedIndustry,
  handleIndustryChange,
  predefinedCountries,
  selectedCountry,
  handleCountryChange,
  predefinedLanguages,
  selectedLanguage,
  handleLanguageChange,
  photoPriceRange,
  handlePhotoPriceChange,
  videoPriceRange,
  handleVideoPriceChange,
  deleteFilters,
  minPhotoPrice,
  maxPhotoPrice,
  maxVideoPrice,
  minVideoPrice,
  gender,
}) {
  return (
    <form className="filter-users">
      <div className="filter-header">
        <h2>Filter Searches</h2>
        <button onClick={(event) => deleteFilters(event)}>Clear Filters</button>
      </div>

      <div className="filter-gender">
        <h2>Gender</h2>
        {uniqueGenders.map((gender) => (
          <label className="checkbox-container" key={gender}>
            <input
              type="checkbox"
              name="genders"
              value={gender}
              checked={selectedGender.includes(gender)}
              onChange={handleGenderChange}
            />
            <span className="checkmark"></span>
            {gender}
          </label>
        ))}
      </div>

      <div className="filter-age">
        <h2>Age</h2>
        <Box sx={{ width: 300 }}>
          <Slider
            className="slider-age"
            getAriaLabel={() => "Minimum distance shift"}
            value={ageRange}
            onChange={handleAgeChange}
            valueLabelDisplay="auto"
            min={newMinAge}
            max={newMaxAge}
            sx={{ color: "#040039" }}
            disableSwap
          />
        </Box>
      </div>

      <div className="filter-industry" style={{ whiteSpace: "pre-line" }}>
        <h2>Industries</h2>
        {predefinedIndustries.map((industry) => (
          <label className="checkbox-container" key={industry}>
            <input
              type="checkbox"
              name="industry"
              value={industry}
              checked={selectedIndustry.includes(industry)}
              onChange={handleIndustryChange}
            />
            <span className="checkmark"></span>
            {industry}
          </label>
        ))}
      </div>

      <div className="filter-country">
        <h2>Countries</h2>
        {predefinedCountries.map((country) => (
          <label className="checkbox-container" key={country}>
            <input
              type="checkbox"
              name="country"
              value={country}
              checked={selectedCountry.includes(country)}
              onChange={handleCountryChange}
            />
            <span className="checkmark"></span>
            {country}
          </label>
        ))}
      </div>

      <div className="filter-language" style={{ whiteSpace: "pre-line" }}>
        <h2>Languages</h2>
        {predefinedLanguages.map((language) => (
          <label className="checkbox-container" key={language}>
            <input
              type="checkbox"
              name="language"
              value={language}
              checked={selectedLanguage.includes(language)}
              onChange={handleLanguageChange}
            />
            <span className="checkmark"></span>
            {language}
          </label>
        ))}
      </div>

      <div className="filter-photo-price">
        <h2>Photo Price</h2>
        <Box sx={{ width: 300 }}>
          <Slider
            className="slider-photo"
            value={photoPriceRange}
            onChange={handlePhotoPriceChange}
            valueLabelDisplay="auto"
            min={minPhotoPrice}
            max={maxPhotoPrice}
            sx={{ color: "#040039" }}
          />
        </Box>
      </div>

      <div className="filter-video-price">
        <h2>Video Price</h2>
        <Box sx={{ width: 300 }}>
          <Slider
            className="slider-video"
            value={videoPriceRange}
            onChange={handleVideoPriceChange}
            valueLabelDisplay="auto"
            min={minVideoPrice}
            max={maxVideoPrice}
            sx={{ color: "#040039" }}
          />
        </Box>
      </div>
    </form>
  );
}
