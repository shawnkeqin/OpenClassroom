import moment from "moment";

export default Object.freeze({
  date_format: s => new Date(s).toDateString().slice(0, 10),
  time_format: s => moment(s, "HH:mm+").format("HH:mm"),
  datetime_fromnow_format: s => moment(s).fromNow()
});
