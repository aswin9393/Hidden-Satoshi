export const formatDate = (date: Date, format: string) => {
  format = format.replace(/yyyy/g, String(date.getFullYear()));
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3));
  return format;
};

export const setStartTimeOfDate = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  return date;
};

export const setEndTimeOfDate = (date: Date) => {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);

  return date;
};

export const getUnixTimestamp = (date: Date) => {
  return Math.round(date.getTime() / 1000);
};
