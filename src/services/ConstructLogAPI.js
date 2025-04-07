import {get} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get("", success, error, params);
};

export const ConstructLogAPI = {
  list,
};
