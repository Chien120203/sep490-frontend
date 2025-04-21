import {get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get(API_CODE.API_CONSTRUCT_LOG_002, success, error, params);
};

const details = async (id, params, success, error) => {
  await get(API_CODE.API_CONSTRUCT_LOG_003 + '/' + id, success, error, params);
};

const listLogsByTask = async (projectId, taskIndex, params, success, error) => {
  await get(API_CODE.API_CONSTRUCT_LOG_003 + '/' + projectId + '/task/' + taskIndex, success, error, params);
};

const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_CONSTRUCT_LOG_001, formData, success, error);
};

export const ConstructLogAPI = {
  list,
  details,
  listLogsByTask,
  save
};
