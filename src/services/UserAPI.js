import {del, get, post, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
    await get(API_CODE.API_USER_001, success, error, params);
};

const details = async (params, success, error) => {
    await get(API_CODE.API_USER_002, success, error, params);
};

const update = async (params, success, error) => {
    await put(API_CODE.API_USER_003, params, success, error);
};

const create = async (params, success, error) => {
    await post(API_CODE.API_USER_004, params, success, error);
};

const deleteUser = async (id, success, error) => {
    await del(API_CODE.API_USER_005 + "?userId=" + id, {}, success, error);
};

export const UserAPI = {
    list,
    details,
    update,
    create,
    deleteUser
};