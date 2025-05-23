import {del, get, post, postFormData, put} from '@/services/BaseService';
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

const approve = async (params, success, error) => {
  await post(API_CODE.API_PLANNING_006, params, success, error);
};

const reject = async (params, success, error) => {
  await post(API_CODE.API_PLANNING_007, params, success, error);
};

const deletePlan = async (id, success, error) => {
  await del(API_CODE.API_PLANNING_005 + "/" + id, {}, success, error);
};

const update = async (params, success, error) => {
  await put(API_CODE.API_PLANNING_004, params, success, error);
};

const acquireLock = async (params, success, error) => {
  await post(API_CODE.API_PLANNING_008, params, success, error);
};

const releaseLock = async (params, success, error) => {
  await post(API_CODE.API_PLANNING_009, params, success, error);
};

const getLockStatus = async (planId, success, error) => {
  await get(`/plans/locks/status/${planId}`, success, error);
};

const extendLock = async (params, success, error) => {
  await post(API_CODE.API_PLANNING_011, params, success, error);
};

export const PlanningAPI = {
  list,
  details,
  reject,
  approve,
  create,
  deletePlan,
  update,
  acquireLock,
  releaseLock,
  getLockStatus,
  extendLock
};
