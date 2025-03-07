import {get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get(API_CODE.API_CTR_002, success, error, params);
};

const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_CTR_001, formData, success, error);
};

export const ContractAPI = {
  list,
  save,
};
