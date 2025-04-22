import {del, get, post, postFormData, put} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const list = async (params, success, error) => {
    await get(API_CODE.API_INSPECTION_001, success, error, params);
};

const details = async (id, params, success, error) => {
    await get(API_CODE.API_INSPECTION_002 + "/" + id, params, success, error);
};

const save = async (formData, success, error) => {
    await postFormData(API_CODE.API_INSPECTION_003, formData, success, error);
};

const deleteInspectionReport = async (id, success, error) => {
    await del(API_CODE.API_INSPECTION_004 + "/" + id, {}, success, error);
};

const approve = async (id, success, error) => {
    await put(API_CODE.API_INSPECTION_006 + '/' + id, success, error);
};

const reject = async (id, success, error) => {
    await put(API_CODE.API_INSPECTION_007 + '/' + id, success, error);
};

export const InspectionReportAPI = {
    list,
    details,
    save,
    deleteInspectionReport,
    approve,
    reject
};
