import moment_tz from "moment-timezone";
import moment from "moment";

const dateFormater = (dateString) => {
  if (!dateString) return null;
  let date = moment(dateString);
  const timeZone = moment_tz.tz.guess();
  return date.tz(timeZone).format("YYYY-MM-DD");
};

export default dateFormater;
