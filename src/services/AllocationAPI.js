import {del, get, post, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
  await get(API_CODE.API_ALLOCATION_001, success, error, params);
};

const details = async (id, params, success, error) => {
  await get(API_CODE.API_ALLOCATION_003 + '/' + id, success, error, params);
};

const save = async (data, success, error) => {
  await post(API_CODE.API_ALLOCATION_002, data, success, error);
};

const deleteAllocation = async (id, success, error) => {
  await del(API_CODE.API_ALLOCATION_004 + "/" + id, {}, success, error);
};

const send = async (id, success, error) => {
  await put(API_CODE.API_ALLOCATION_005 + '/' + id, {}, success, error);
};

const approve = async (id, params, success, error) => {
  await put(API_CODE.API_ALLOCATION_006 + '/' + id, params, success, error);
};


const reject = async (id, params, success, error) => {
  await put(API_CODE.API_ALLOCATION_007 + '/' + id, params, success, error);
};

export const AllocationAPI = {
  list,
  details,
  deleteAllocation,
  send,
  approve,
  reject,
  save,
};
