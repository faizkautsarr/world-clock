export const formatTime = (date, timezone) => {
  const time = new Date(date).toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });

  return time;
};

export const formatHoursDifference = (offset1, offset2, city) => {
  console.log(offset1, offset2);
  const parseOffset = (offset) => {
    const hours = parseInt(offset, 10);
    return hours;
  };

  const parsedOffset1 = parseOffset(offset1);
  const parsedOffset2 = parseOffset(offset2);

  const result = parsedOffset2 - parsedOffset1;

  if (result < 0) {
    return `${Math.abs(result)} hours ahead of ${city}`;
  } else if (result === 0) {
    return `same with ${city}`;
  } else {
    return `${Math.abs(result)} behind ${city}`;
  }
};
