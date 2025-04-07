import {del, get, post, postFormData, put, putFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details = async (id, params, success, error) => {
    await get(API_CODE.API_MACHINE_001 + "/" + id, success, error, params);
};

const list = async (params, success, error) => {
    await get(API_CODE.API_MACHINE_002, success, error, params);
};

const create = async (formData, success, error) => {
    await postFormData(API_CODE.API_MACHINE_003, formData, success, error);
};

const update = async (formData, success, error) => {
    await putFormData(API_CODE.API_MACHINE_004, formData, success, error);
};

const deleteMachine = async (id, success, error) => {
    await del(API_CODE.API_MACHINE_005 + "/" + id, {}, success, error);
};

export const MachineResourceAPI = {
    list,
    details,
    update,
    create,
    deleteMachine
};
