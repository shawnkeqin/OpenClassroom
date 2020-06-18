import moment from "moment";

export default Object.freeze({
  dateFormatStr: "DD/MM/YY",
  isNonEmptyArray: o => Array.isArray(o) && o.length,
  date_format: s => moment(s).format("d MMM"),
  time_format: s => moment(s, "HH:mm+").format("HH:mm"),
  datetime_fromnow_format: s => moment(s).fromNow()
});
