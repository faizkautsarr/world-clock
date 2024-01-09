import axios from "axios";

const fetchLocalTime = async () => {
  try {
    const response = await axios.get(
      "https://worldtimeapi.org/api/Asia/Jakarta"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCityTime = async (city) => {
  try {
    const response = await axios.get(
      `https://worldtimeapi.org/api/timezone/${city}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { fetchLocalTime, fetchCityTime };
