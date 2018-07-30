export const isRecentMessage = (previousMessage, currentMessage) => {
  const RECENT_TIME = 15 * 60000;

  return (
    previousMessage.userId === currentMessage.userId &&
    currentMessage.timestamp - previousMessage.timestamp < RECENT_TIME
  );
};

export const isRecentDay = (previousMessage, currentMessage) => {
  const pDate = new Date(previousMessage.timestamp);
  const cDate = new Date(currentMessage.timestamp);

  return (
    pDate.getFullYear() < cDate.getFullYear() ||
    pDate.getMonth() < cDate.getMonth() ||
    pDate.getDate() < cDate.getDate()
  );
};

export const newDayString = date =>
  `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
