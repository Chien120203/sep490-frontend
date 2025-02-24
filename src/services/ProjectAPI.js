import {get, post, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
  await get(API_CODE.API_PRJ_001, success, error, params);
};

const save = async (params, success, error) => {
  await post(API_CODE.API_PRJ_002, params, success, error);
};

export const ProjectAPI = {
  list,
  save
};
