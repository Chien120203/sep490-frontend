import {FRONT_END_URL, HTTP_FORBIDDEN} from "@/constants/application.js";
import {ref} from "vue";
import PAGES from "@/utils/pages.js";
import PAGE_NAME from "@/constants/route-name.js";

let api = null;
let prefix = '';
let router = null;
const homePath = ref(`${FRONT_END_URL}${PAGES.FORBIDDEN}`);
// Initializes the service with an axios instance and prefix
const initializeService = (axiosInstance, prefixValue, routerValue) => {
    api = axiosInstance.axiosInstance;
    prefix = prefixValue;
    router = routerValue;
};

// Processes the response, returning the 'data' property if it exists
const processResponse = (response) => {
    if (response?.data.code !== 200) {
        const error = new Error('API Error');
        error.response = response; // Attach full response for later use
        throw error;
    }
    return response.data;
};

// Logs and handles errors, specifically handling 401 unauthorized status
const logError = (e, error) => {
    if (error && e.response) {
        if (e.response.hasOwnProperty('status')) {
            const errors = e.response.data.errors
                ? Object.fromEntries(
                    Object.entries(e.response.data.errors).map(([key, value]) => [key, value[0]])
                )
                : [];
            error({
                code: e.response.status,
                error: errors,
                responseCode: e.response.data,
            });
        }
    }
};

// Performs a GET request
const get = async (endpoint, success, error, params = {}) => {
    await api
        .get(prefix + endpoint, {params})
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};

// Performs a POST request
const post = async (endpoint, params = {}, success, error, config = {}) => {
    await api
        .post(prefix + endpoint, params, config)
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};

const postFormData = async (endpoint, formData, success, error, config = {}) => {
    await api
        .post(prefix + endpoint, formData, {
            ...config,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};

const putFormData = async (endpoint, formData, success, error, config = {}) => {
    await api
        .put(prefix + endpoint, formData, {
            ...config,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};


// Performs a PUT request
const put = async (endpoint, params = {}, success, error) => {
    await api
        .put(prefix + endpoint, params)
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};

// Performs a DELETE request
const del = async (endpoint, data = {}, success, error) => {
    await api
        .delete(prefix + endpoint, {data})
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};

// Performs a PATCH request
const patch = async (endpoint, params = {}, success, error) => {
    await api
        .patch(prefix + endpoint, params)
        .then(processResponse)
        .then(success)
        .catch((e) => logError(e, error));
};

// Parses an object into a URL query string
const urlParse = (obj, query = false) => {
    const str = Object.entries(obj)
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => {
            if (value === true) value = 1;
            if (value === false) value = 0;
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        });

    return query ? `?${str.join('&')}&${query}` : `?${str.join('&')}`;
};

export {
    initializeService,
    get,
    post,
    put,
    postFormData,
    putFormData,
    del,
    patch,
    urlParse
};