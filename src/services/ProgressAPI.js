import {del, get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details =  async (id, params, success, error) => {
  await get(API_CODE.API_PROGRESS_001 + "/" + id, success, error, params);
}

export const ProgressAPI = {
  details
};
