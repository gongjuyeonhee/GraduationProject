export const formatTimeFromTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    let period = '오전';
    if (hours >= 12) {
      period = '오후';
    }
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${period} ${formattedHours}시 ${formattedMinutes}분`;
    return formattedTime;
  };
  