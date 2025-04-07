import {del, get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details = async (id, params, success, error) => {
    await get(API_CODE.API_MATERIAL_001 + "/" + id, params, success, error);
};

const list = async (params, success, error) => {
    await get(API_CODE.API_MATERIAL_002, success, error, params);
};

const save = async (formData, success, error) => {
    await postFormData(API_CODE.API_MATERIAL_003, formData, success, error);
};

const deleteHuman = async (id, success, error) => {
    await del(API_CODE.API_MATERIAL_004 + "/" + id, {}, success, error);
};

export const HumanResourceAPI = {
    list,
    details,
    save,
    deleteHuman
};
