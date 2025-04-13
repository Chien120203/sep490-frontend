import {del, get, post, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
  await get(API_CODE.API_INVENTORY_001, success, error, params);
};

export const InventoryAPI = {
  list,
};
