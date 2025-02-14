import {del, get, post, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
    await get(API_CODE.API_010, success, error, params);
};

const details = async (params, success, error) => {
    await get(API_CODE.API_011, success, error, params);
};

const update = async (params, success, error) => {
    await put(API_CODE.API_012, params, success, error);
};

const create = async (params, success, error) => {
    await post(API_CODE.API_013, params, success, error);
};

const deleteUser = async (id, success, error) => {
    await del(API_CODE.API_014 + "?userId=" + id, {}, success, error);
};

export const UserAPI = {
    list,
    details,
    update,
    create,
    deleteUser
};
