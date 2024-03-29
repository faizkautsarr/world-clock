import { useState, useEffect } from "react";
import "./App.css";
import { fetchLocalTime, fetchCityTime } from "./services/api";
import { cities } from "./utils/constants";
import { formatTime } from "./utils/formatter";
import LocalTimeCard from "./views/components/LocalTimeCard";
import OtherTimeCard from "./views/components/OtherTimeCard";
import AddCityModalContent from "./views/components/AddCityModalContent";
import Modal from "./views/components/Modal";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [cityInput, setCityInput] = useState("");

  const [localInfo, setLocalInfo] = useState({
    city: "",
    abbreviation: "",
    time: "",
    offset: "",
  });
  const [otherCityItemsDetail, setOtherCityItemDetails] = useState([]);

  const handleOverlayClick = (event) => {
    // Close the modal only if the click is on the overlay and not on the modal content
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };
  const closeModal = () => {
    document.body.style.overflow = "visible";
    setShowModal(false);
  };
  const openModal = () => {
    document.body.style.overflow = "hidden";
    setShowModal(true);
  };

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

  const handleSubmitAddCity = () => {
    const input =
      cityInput === ""
        ? otherCityItemsDetail.filter((city) => !city.isVisible)[0].name
        : cityInput;
    const current = [...otherCityItemsDetail];
    const selectedIndex = current.findIndex((item) => item.name === input);

    if (selectedIndex !== -1) {
      current[selectedIndex].isVisible = true;
      current[selectedIndex].notes = notesInput;
      setOtherCityItemDetails(current);
    }
    closeModal();
    setNotesInput("");
  };

  const handleDelete = (name) => {
    const current = [...otherCityItemsDetail];

    const selectedIndex = current.findIndex((item) => item.name === name);

    if (selectedIndex !== -1) {
      current[selectedIndex].isVisible = false;
      setOtherCityItemDetails(current);
    }
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
            notes: city.notes,
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

  const initFunction = async () => {
    setIsLoading(true);
    await fetchTime();
    await fetchOtherCityTimes();
    setIsLoading(false);
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
          <div className="text-3xl text-white text-center font-mono mt-8">
            World Clock
          </div>
          <LocalTimeCard
            city={localInfo.city}
            abbreviation={localInfo.abbreviation}
            formattedTime={formatTime(localInfo.time, localInfo.timezone)}
          />

          <div className="w-full flex flex-wrap justify-center">
            {otherCityItemsDetail
              .filter((city) => city.isVisible)
              .map((filteredCity) => (
                <OtherTimeCard
                  key={filteredCity.name}
                  filteredCity={filteredCity}
                  localInfo={localInfo}
                  handleDelete={handleDelete}
                />
              ))}
          </div>

          <div
            onClick={() => {
              if (
                otherCityItemsDetail.filter((city) => city.isVisible).length < 4
              ) {
                openModal();
              }
            }}
            className={` ${
              otherCityItemsDetail.filter((city) => city.isVisible).length < 4
                ? ""
                : "opacity-30"
            } text-sm flex justify-center items-center text-white text-center font-mono mt-8 fixed bottom-4 left-0 right-0 bg-blue-600 p-2 w-40 rounded-2xl mx-auto`}
          >
            <i className="material-icons w-6 mr-2">add_circle</i>
            <div> add city </div>
          </div>

          {showModal && (
            <Modal
              closeModal={closeModal}
              handleOverlayClick={handleOverlayClick}
            >
              <AddCityModalContent
                otherCityItemsDetail={otherCityItemsDetail}
                setNotesInput={setNotesInput}
                setCityInput={setCityInput}
                handleSubmitAddCity={handleSubmitAddCity}
                notesInput={notesInput}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
