import {get, postFormData, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get(API_CODE.API_CONSTRUCT_LOG_002, success, error, params);
};

const details = async (id, params, success, error) => {
  await get(API_CODE.API_CONSTRUCT_LOG_003 + '/' + id, success, error, params);
};

const listLogsByTask = async (projectId, taskIndex, params, success, error) => {
  await get(API_CODE.API_CONSTRUCT_LOG_004 + '/' + projectId + '/task/' + taskIndex, success, error, params);
};

const approve = async (logId, params, success, error) => {
  await put(API_CODE.API_CONSTRUCT_LOG_003 + '/' + logId + '/approve', params, success, error);
};

const reject = async (logId, params, success, error) => {
  await put(API_CODE.API_CONSTRUCT_LOG_003 + '/' + logId + '/reject', params, success, error);
};


const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_CONSTRUCT_LOG_001, formData, success, error);
};

export const ConstructLogAPI = {
  list,
  details,
  listLogsByTask,
  reject,
  approve,
  save
};
