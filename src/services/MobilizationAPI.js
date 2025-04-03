import {del, get, post} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get(API_CODE.API_MOBILIZE_001, success, error, params);
};

const details = async (id, params, success, error) => {
  await get(API_CODE.API_MOBILIZE_004 + '/' + id, success, error, params);
};

const save = async (data, success, error) => {
  await post(API_CODE.API_MOBILIZE_002, data, success, error);
};

const deleteMobilization = async (id, success, error) => {
  await del(API_CODE.API_MOBILIZE_003 + "/" + id, {}, success, error);
};

export const MobilizationAPI = {
  list,
  details,
  deleteMobilization,
  save,
};
