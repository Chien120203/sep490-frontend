import {del, get, post, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details = async (id, params, success, error) => {
    await get(API_CODE.API_HUMAN_001 + "/" + id, success, error, params);
};

const list = async (params, success, error) => {
    await get(API_CODE.API_HUMAN_002, success, error, params);
};

const save = async (params, success, error) => {
    await post(API_CODE.API_HUMAN_003, params, success, error);
};

const deleteHuman = async (id, success, error) => {
    await del(API_CODE.API_HUMAN_004 + "/" + id, {}, success, error);
};

const removeMember = async (id, success, error) => {
    await del(API_CODE.API_HUMAN_005 + "/" + id, {}, success, error);
};

export const HumanResourceAPI = {
    list,
    details,
    save,
    deleteHuman,
    removeMember
};
