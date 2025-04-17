import {get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get("", success, error, params);
};

const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_CONSTRUCT_LOG_001, formData, success, error);
};

export const ConstructLogAPI = {
  list,
  save
};
