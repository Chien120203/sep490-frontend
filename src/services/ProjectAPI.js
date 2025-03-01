import {get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
  await get(API_CODE.API_PRJ_001, success, error, params);
};

const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_PRJ_002, formData, success, error);
};

const details =  async (id, params, success, error) => {
  await get(API_CODE.API_PRJ_003 + "/" + id, success, error, params);
}

export const ProjectAPI = {
  list,
  save,
  details
};
