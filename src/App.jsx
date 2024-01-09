import { useState, useEffect } from "react";
import "./App.css";
import { fetchLocalTime, fetchCityTime } from "./services/api";
import { cities } from "./utils/constants";
import { formatTime, formatHoursDifference } from "./utils/formatter";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [localInfo, setLocalInfo] = useState({
    city: "",
    abbreviation: "",
    time: "",
    notes: "local time",
    offset: "",
  });
  const [otherCityItemsDetail, setOtherCityItemDetails] = useState([]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    const current = [...otherCityItemsDetail];

    const selectedIndex = current.findIndex(
      (item) => item.name === selectedValue
    );

    if (selectedIndex !== -1) {
      current[selectedIndex].isVisible = true;
      setOtherCityItemDetails(current);
    }
  };

  const handleDelete = (name) => {
    const current = [...otherCityItemsDetail];

    const selectedIndex = current.findIndex((item) => item.name === name);

    if (selectedIndex !== -1) {
      current[selectedIndex].isVisible = false;
      setOtherCityItemDetails(current);
    }
  };
  const initFunction = async () => {
    setIsLoading(true);
    await fetchTime();
    await fetchOtherCityTimes();
    setIsLoading(false);
  };
  const fetchTime = async () => {
    try {
      // fetch Jakarta Time
      const localData = await fetchLocalTime();
      const localCity = localData.timezone.split("/").pop();
      const localAbbreviation = localData.abbreviation;

      setLocalInfo({
        city: localCity,
        abbreviation: localAbbreviation,
        time: new Date(localData.datetime),
        timezone: localData.timezone,
        offset: localData.utc_offset,
      });
    } catch (error) {
      console.error("Error fetching local time:", error);
    }
  };

  const fetchOtherCityTimes = async () => {
    try {
      const promises = cities.map(async (city) => {
        try {
          const cityData = await fetchCityTime(city.name);

          return {
            name: city.name,
            city: city.name.split("/").pop().replace("_", " "),
            abbreviation: city.abbreviation,
            time: new Date(cityData.datetime),
            timezone: city.name,
            isVisible: city.isVisible,
            offset: cityData.utc_offset,
          };
        } catch (error) {
          console.error(`Error fetching ${city} time:`, error);
        }
      });

      const cityTimeResults = await Promise.all(promises);
      setOtherCityItemDetails(cityTimeResults);
    } catch (error) {
      console.error("Error fetching other city times:", error);
    }
  };

  useEffect(() => {
    initFunction();

    const intervalId = setInterval(() => {
      setLocalInfo((prevLocalInfo) => {
        try {
          const currentTime = new Date(prevLocalInfo.time);
          currentTime.setSeconds(currentTime.getSeconds() + 1);

          return { ...prevLocalInfo, time: currentTime };
        } catch (error) {
          console.error("Error updating local time:", error);
          return prevLocalInfo;
        }
      });

      setOtherCityItemDetails((prevOtherCityTimes) => {
        return prevOtherCityTimes.map((cityTime) => {
          try {
            const currentTime = new Date(cityTime.time);
            currentTime.setSeconds(currentTime.getSeconds() + 1);

            return { ...cityTime, time: currentTime };
          } catch (error) {
            console.error(`Error updating ${cityTime.city} time:`, error);
            return cityTime;
          }
        });
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {!isLoading && (
        <>
          <div className="flex w-full flex-col justify-center items-center my-12">
            <div
              className="w-52 h-52 flex flex-col justify-center items-center rounded-2xl"
              style={{ background: "#323232" }}
            >
              <div className="font-mono text-md text-white">
                {localInfo.city} ({localInfo.abbreviation})
              </div>
              <div
                className="font-mono text-xs mb-4"
                style={{ color: "#929292" }}
              >
                local time
              </div>
              <div
                className="text-white text-4xl"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "2px",
                }}
              >
                {formatTime(localInfo.time, localInfo.timezone)}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap justify-center">
            {otherCityItemsDetail
              .filter((city) => city.isVisible)
              .map((filteredCity) => (
                <div
                  className="flex justify-center mb-8 card"
                  key={filteredCity.city}
                >
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
                      <div
                        className="font-mono text-md"
                        style={{ color: "#a2a2a2" }}
                      >
                        {filteredCity.city}
                      </div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: "#929292" }}
                      >
                        notes (max 20)
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
                      <div
                        className="font-mono text-md"
                        style={{ color: "#a2a2a2" }}
                      >
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
              ))}
          </div>
        </>
      )}
    </div>
  );
}
