import React from "react";

const LocalTimeCard = ({ city, abbreviation, formattedTime }) => {
  return (
    <div className="flex w-full flex-col justify-center items-center my-12">
      <div
        className="w-52 h-52 flex flex-col justify-center items-center rounded-2xl"
        style={{ background: "#323232" }}
      >
        <div className="font-mono text-md text-white">
          {city} ({abbreviation})
        </div>
        <div className="font-mono text-xs mb-4" style={{ color: "#929292" }}>
          local time
        </div>
        <div
          className="text-white text-4xl"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "2px",
          }}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default LocalTimeCard;
