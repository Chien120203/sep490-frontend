import {get, post, postFormData, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get(API_CODE.API_PLANNING_001, success, error, params);
};

const details = async (id, params, success, error) => {
  await get(API_CODE.API_PLANNING_003 + '/' + id, success, error, params);
};

const create = async (params, success, error) => {
  await post(API_CODE.API_PLANNING_002, params, success, error);
};

const update = async (params, success, error) => {
  await put(API_CODE.API_PLANNING_004, params, success, error);
};

export const PlanningAPI = {
  list,
  details,
  create,
  update
};
