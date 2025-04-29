import {del, get, post, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details =  async (id, params, success, error) => {
  await get(API_CODE.API_PROGRESS_001 + "/" + id, success, error, params);
}

const saveItem =  async (id, params, success, error) => {
  await post(API_CODE.API_PROGRESS_002, params, success, error);
}

export const ProgressAPI = {
  details,
  saveItem
};
