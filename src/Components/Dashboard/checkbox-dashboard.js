import React from 'react';

function CheckboxDashboard({ title, options, selectedOptions, onChange }) {
  return (
    <div>
      <label className="label-title">{title}</label>
      <div className="checkbox-options-container">
        {options.map((option) => (
          <label className="checkbox-container-dash" key={option}>
            <input
              type="checkbox"
              name={title} 
              value={option}
              onChange={onChange}
              checked={selectedOptions?.includes(option)}
            />
            <span className="checkmark"></span> {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default CheckboxDashboard;
