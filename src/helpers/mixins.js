import { ref } from "vue";
import { ElLoading } from "element-plus";
import moment from "moment";
import { RULES_VALIDATION } from "@/constants/application";
import { ElNotification } from "element-plus";

const screenLoading = ref(false);
let loadingInstance = null;

const startLoading = () => {
  screenLoading.value = true;
  loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
};

const endLoading = async () => {
  if (!checkEmpty(loadingInstance)) {
    await loadingInstance.close();
    loadingInstance = null;
  }
  screenLoading.value = false;
};

const checkEmpty = (value) => value === null || value === undefined;

const checkEmptyWithOutZero = (value) => {
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === "object" && value.constructor === Object)
    return Object.keys(value).length === 0;
  if (typeof value === "string" || value instanceof String)
    return value.trim().length === 0;
  return value === null || typeof value === "undefined" || value === "";
};

const arrayChunk = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunkedArr[chunkedArr.length - 1];
    if (!last || last.length === size) {
      chunkedArr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunkedArr;
};

const notifyError = (messages, useHTML = false, notify = null) => {
  let message = "";

  if (useHTML && Array.isArray(messages)) {
    messages.forEach((item) => (message += `<p>${item}</p>`));
  } else if (useHTML && typeof messages === "object") {
    for (let key in messages) message += `<p>${messages[key]}</p>`;
  } else {
    message = messages;
  }

  const notifyObj = notify ?? ElNotification;
  notifyObj.error({
    message,
    duration: 2000,
    position: "top-right",
    dangerouslyUseHTMLString: useHTML,
    showClose: false,
  });
};

const notifySuccess = (messages, useHTML = false, notify = null) => {
  let message = "";

  if (useHTML && Array.isArray(messages)) {
    messages.forEach((item) => (message += `<p>${item}</p>`));
  } else {
    message = messages;
  }

  const notifyObj = notify ?? ElNotification;
  notifyObj.success({
    message,
    duration: 2000,
    position: "top-right",
    dangerouslyUseHTMLString: useHTML,
    showClose: false,
  });
};

const validateInvalidEmail = (email) =>
  RULES_VALIDATION.EMAIL_FORMAT.test(email);

const showDateTime = (dateTime, formatString = undefined) => {
  if (checkEmptyWithOutZero(dateTime)) return;

  formatString = formatString || import.meta.env.VITE_APP_FORMATDATE;

  return moment(dateTime, [
    "YYYY/MM",
    "YYYY/MM/DD",
    "YYYY-MM-DD",
    "YYYY-MM-DD HH:mm:ss",
    "YYYY/MM/DD HH:mm:ss",
    "YYYY-MM-DD HH:mm",
    "YYYY/MM/DD HH:mm",
  ]).format(formatString);
};

const formatCurrency = (money, s_delimiter = ".") => {
  if (!money) return "";

  const currencySymbol = "₫";
  const convertedMoney = Math.floor(money); // Ensure no decimals

  const formattedMoney = convertedMoney
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, s_delimiter); // Proper regex for thousand separator

  return formattedMoney + " " + currencySymbol;
};

const handleChangeNumber = (number) => number.toString().replaceAll(",", "");

const formatInputCurrency = (value, isEmpty = false, withoutComma = false) => {
  if (!value) return isEmpty ? "" : 0;
  let stringValue = String(value).replace(/[^0-9.+-]/g, "");
  if (withoutComma) return Math.round(parseFloat(stringValue) * 100) / 100;
  const decimalIndex = stringValue.indexOf(".");
  if (decimalIndex !== -1) stringValue = stringValue.slice(0, decimalIndex + 3);
  if (stringValue.indexOf(".00") !== -1)
    stringValue = stringValue.replace(".00", "");

  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const handleErrorResponse = (error) => {
  return error.errors.reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {});
};

export const mixins = {
  screenLoading,
  startLoading,
  endLoading,
  checkEmptyWithOutZero,
  checkEmpty,
  formatCurrency,
  formatInputCurrency,
  handleErrorResponse,
  arrayChunk,
  notifyError,
  handleChangeNumber,
  notifySuccess,
  validateInvalidEmail,
  showDateTime,
};
