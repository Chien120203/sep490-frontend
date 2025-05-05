import {del, get, post, postFormData, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details =  async (id, params, success, error) => {
  await get(API_CODE.API_PROGRESS_001 + "/" + id, success, error, params);
}

const saveItem =  async (params, success, error) => {
  await post(API_CODE.API_PROGRESS_002, params, success, error);
}

const clearCache =  async (params, success, error) => {
  await post(API_CODE.API_PROGRESS_004, params, success, error);
}

const updateItem =  async (params, success, error) => {
  await put(API_CODE.API_PROGRESS_003, params, success, error);
}

export const ProgressAPI = {
  details,
  saveItem,
  updateItem,
  clearCache
};
