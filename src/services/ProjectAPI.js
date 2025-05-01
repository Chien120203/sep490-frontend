import {del, get, postFormData, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const list = async (params, success, error) => {
  await get(API_CODE.API_PRJ_001, success, error, params);
};

const getChart = async (params, success, error) => {
  await get(API_CODE.API_PRJ_004, success, error, params);
};

const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_PRJ_002, formData, success, error);
};

const details =  async (id, params, success, error) => {
  await get(API_CODE.API_PRJ_003 + "/" + id, success, error, params);
}

const updateStatus =  async (params, success, error) => {
  await put(API_CODE.API_PRJ_006, params, success, error);
}

const deleteProject = async (id, success, error) => {
  await del(API_CODE.API_PRJ_005 + "/" + id, {}, success, error);
};

export const ProjectAPI = {
  list,
  save,
  updateStatus,
  getChart,
  deleteProject,
  details
};
