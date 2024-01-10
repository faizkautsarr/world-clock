import React, { useState } from "react";

const AddCityModalContent = ({
  otherCityItemsDetail,
  handleSubmitAddCity,
  notesInput,
  setNotesInput,
  setCityInput,
}) => {
  return (
    <div className="flex items-center flex-col mt-12 h-full">
      <input
        spellCheck={false}
        maxLength={20}
        type="text"
        className="w-full bg-white rounded p-2 mb-4 text-xs form-input  border-gray-500 border"
        placeholder="Input notes"
        value={notesInput}
        onChange={(e) => setNotesInput(e.target.value)}
      />

      <div className="w-full p-1 bg-white rounded  border-gray-500 border">
        <select
          value={otherCityItemsDetail.filter((city) => !city.isVisible)[0].name}
          className="w-full text-xs form-input"
          onChange={(event) => setCityInput(event.target.value)}
        >
          {otherCityItemsDetail
            .filter((city) => !city.isVisible)
            .map((filtered) => (
              <option key={filtered.name} value={filtered.name}>
                {filtered.name}
              </option>
            ))}
        </select>
      </div>

      <div
        onClick={handleSubmitAddCity}
        className="w-32 bg-blue-600 text-white text-center text-xs font-mono rounded-2xl p-2 mt-24"
      >
        Add
      </div>
    </div>
  );
};

export default AddCityModalContent;
