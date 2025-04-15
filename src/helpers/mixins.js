import {ref} from "vue";
import {ElLoading} from "element-plus";
import moment from "moment";
import {RULES_VALIDATION} from "@/constants/application";
import {ElNotification} from "element-plus";

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
  if (!value) return isEmpty ? "" : "";
  let stringValue = String(value).replace(/[^0-9.+-]/g, "");
  if (withoutComma) return Math.round(parseFloat(stringValue) * 100) / 100;
  const decimalIndex = stringValue.indexOf(".");
  if (decimalIndex !== -1) stringValue = stringValue.slice(0, decimalIndex + 3);
  if (stringValue.indexOf(".00") !== -1)
    stringValue = stringValue.replace(".00", "");

  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatInputMoney = (value) => {
  if (value === null || value === undefined) return "";

  const numericValue = Number(value); // Convert to number for validation
  if (isNaN(numericValue) || numericValue < 0) return ""; // Return "0" for negative values

  const stringValue = String(numericValue); // Convert back to string for formatting
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseInputCurrency = (value, allowNegative = false) => {
  if (!value) return;

  // Extract negative sign if allowed and present at the beginning
  let isNegative = false;
  if (allowNegative && value.trim().startsWith('-')) {
    isNegative = true;
  }

  // Remove everything except digits and decimal point
  const cleaned = value.replace(/[^\d.]/g, '');

  // Handle multiple decimals
  const parts = cleaned.split('.');
  const normalized = parts.length > 2
    ? parts[0] + '.' + parts.slice(1).join('')
    : cleaned;

  // Reattach negative sign if applicable
  return isNegative ? `-${normalized}` : normalized;
};

const formatNumberVietnam = (number) => {
  if (number === null || number === undefined) return "";
  return new Intl.NumberFormat("vi-VN").format(number);
};

const base64ToFile = (base64String, fileName) => {
  if(!base64String) return "";
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};


const handleErrorResponse = (error) => {
  return error.errors?.reduce((acc, { field, message }) => {
    field.split(",").map(f => f.trim()).forEach(f => {
      acc[f] = message;
    });
    return acc;
  }, {});
};

const createFormData = (params, skipArray = []) => {
  const formData = new FormData();

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (Array.isArray(value) && !skipArray.includes(key)) {
      // Check if the array contains only File or Blob objects
      const isArrayOfFiles = value.every(item => item instanceof File || item instanceof Blob);

      if (isArrayOfFiles) {
        // If it's an array of File/Blob, append them directly
        value.forEach(item => {
          formData.append(key, item);
        });
      } else {
        // If it's a regular array, convert items to JSON
        value.forEach(item => {
          formData.append(key, JSON.stringify(item));
        });
      }
    } else {
      formData.append(key, value);
    }

  });

  return formData;
};

const validateForm = (formRef) => {
  try {
    if (!formRef || typeof formRef.validate !== 'function') {
      console.warn("Invalid formRef:", formRef);
      return false;
    }
    let result = true;
    formRef.validate((valid) => {
      result = !!valid;
    });
    return result;
  } catch (error) {
    return false;
  }
};
const validateField = (index, field, rules, item, validationErrors) => {
  const fieldRules = rules[field];
  const fieldValue = item[field];

  fieldRules.forEach((rule) => {
    if (rule.required && !fieldValue) {
      validationErrors[`${
        field}-${index
      }`] = rule.message;
    }

    if (rule.min !== undefined && fieldValue < rule.min) {
      validationErrors[`${field}-${index}`] = rule.message
    }

    if (rule.max !== undefined && fieldValue > rule.max) {
      validationErrors[`${field}-${index}`] = rule.message;
    }

    if (rule.validator) {
      rule.validator(rule, fieldValue, (error) => {
        if (error) {
          validationErrors[`${
            field}-${index
          }`] = error.message;
        }
      });
    }
  });
};

export const mixins = {
  screenLoading,
  startLoading,
  validateForm,
  createFormData,
  endLoading,
  checkEmptyWithOutZero,
  checkEmpty,
  formatCurrency,
  formatNumberVietnam,
  formatInputCurrency,
  parseInputCurrency,
  formatInputMoney,
  handleErrorResponse,
  arrayChunk,
  notifyError,
  handleChangeNumber,
  notifySuccess,
  validateInvalidEmail,
  showDateTime,
  base64ToFile,
  validateField,
};
