import { i18n } from '@/utils/i18n.js';

export function validateMinMax(rule, value, callback, min, max, minMessage, maxMessage) {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    callback(new Error("Value must be a number"));
  } else if (numValue < min) {
    callback(new Error(minMessage));
  } else if (numValue > max) {
    callback(new Error(maxMessage));
  } else {
    callback(); // Validation passed
  }
}

export function validateStartBeforeEnd(rule, value, callback, startDate, endDate, message) {
  if (!startDate || !endDate) {
    callback();
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    callback(new Error(i18n.global.t(message))); // Customize the error message key
  } else {
    callback();
  }
}
