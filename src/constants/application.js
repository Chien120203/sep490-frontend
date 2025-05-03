export const VI_LOCALE = 'vi';
export const EN_LOCALE = 'en';

export const RULES_VALIDATION = {
    EMAIL_FORMAT: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PHONE_FORMAT: /^\+?\d[\d()\-\s]*$/,
    FLOAT_FORMAT: /^\d+(\.\d+)?$/,
    ALLOWED_FILE_SIZE_2MB: 2 * 1024 * 1024,
    ALLOWED_FILE_SIZE_10MB: 10 * 1024 * 1024,
}

export const MODAL_TITLE = {
    ADD: 'add',
    UPDATE: 'update',
}

export const COOKIE_EXPIRE_TIME = import.meta.env.VITE_COOKIE_EXPIRE_TIME || 365;
export const FRONT_END_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:9999";
export const DATE_FORMAT = import.meta.env.VITE_APP_FORMATDATE || "YYYY-MM-DD";
export const DATE_TIME_FORMAT = import.meta.env.VITE_APP_FORMATDATE || "YYYY-MM-DD HH:mm:ss";
export const CURRENCY = "VND"
export const DEPARTMENT_ACTIVE = 1;

export const MIN_CHARACTER = 1;
export const TAX_CODE = "^\\d{10}(-\\d{3})?$";
export const PHONE_NUMBER = "^(0|\\+84)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])\\d{7}$";
export const FAX_NUMBER = "^(0|\\+84)(2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]8[0-9])\\d{8}$";
export const MAX_CHARACTER = 255;
export const MAX_SHORT_NUMBER = 20;
export const MAX_LENGTH_TEXT = 32000;
export const MAX_DESCRIPTION = 2000;
export const MAX_CAPACITY = 50;
export const MAX_AREA = 100;
export const TEXT_CONFIRM_DELETE="Delete"
export const DEFAULT_EXCHANGE_RATE = 1;
export const TEXT_CONFIRM_TERMINATE="Terminate"
export const TEXT_CONFIRM_INACTIVE="Deactivate"
export const PAYPAL_SUCCESS_STATUS="COMPLETED"
export const MONTH_DAY_FORMAT = "MM-DD"
export const IMPORT_VALID_EXTENSIONS = [".xlsx"];
export const PDF_CONTENT_TYPE = /^application\/pdf/;
export const NUMBER_FORMAT = 2;
export const HTTP_NOT_FOUND = 404;
export const HTTP_FORBIDDEN = 403;
export const OFFSET = 0;
export const LIMIT = 20;
export const ENTER_KEY_CODE = 13;
export const MAX_MONTH = 12;
export const MIN_MONTH = 1;
export const MIN_NUMBER = 0;
export const MAX_NUMBER = 1000000;
export const MIN_PRICE = 0;
export const MAX_PRICE = 100000000000000;
export const GENDERS = [
    {value: true, label: 'user.gender.male'},
    {value: false, label: 'user.gender.female'},
];
