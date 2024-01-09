import React from "react";
import { formatTime, formatHoursDifference } from "../../utils/formatter";

const OtherTimeCard = ({ filteredCity, localInfo, handleDelete }) => {
  return (
    <div className="flex justify-center mb-8 card">
      <div
        className="w-52 h-52 flex flex-col justify-around items-center rounded-2xl"
        style={{ background: "#323232" }}
      >
        <div className="w-full flex flex-col items-center relative">
          <i
            onClick={() => handleDelete(filteredCity.name)}
            className="material-icons text-md w-4 mr-2 text-red-600 absolute right-2"
          >
            delete
          </i>
          <div className="font-mono text-md" style={{ color: "#a2a2a2" }}>
            {filteredCity.city}
          </div>
          <div className="font-mono text-xs" style={{ color: "#929292" }}>
            {filteredCity.notes}
          </div>
        </div>

        <div
          className="text-white text-4xl"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "2px",
          }}
        >
          {formatTime(filteredCity.time, filteredCity.timezone)}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="font-mono text-md" style={{ color: "#a2a2a2" }}>
            {filteredCity.abbreviation}
          </div>
          <div
            className="font-mono text-xs text-center"
            style={{ color: "#a2a2a2" }}
          >
            {formatHoursDifference(
              filteredCity.offset,
              localInfo.offset,
              localInfo.city
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherTimeCard;
