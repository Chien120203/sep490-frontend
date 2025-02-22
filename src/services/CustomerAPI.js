import {del, get, post, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
  await get(API_CODE.API_CUS_001, success, error, params);
};

const details = async (params, success, error) => {
  await get(API_CODE.API_CUS_002, success, error, params);
};

const update = async (params, success, error) => {
  await put(API_CODE.API_CUS_003, params, success, error);
};

const create = async (params, success, error) => {
  await post(API_CODE.API_CUS_004, params, success, error);
};

const deleteCustomer = async (id, success, error) => {
  await del(API_CODE.API_CUS_005 + "/" + id, {}, success, error);
};

export const CustomerAPI = {
  list,
  details,
  update,
  create,
  deleteCustomer
};
