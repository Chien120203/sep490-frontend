import {del, get, post, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details = async (id, params, success, error) => {
    await get(API_CODE.API_INSPECTION_002 + "/" + id, params, success, error);
};

const list = async (params, success, error) => {
    await get(API_CODE.API_INSPECTION_001, success, error, params);
};

const save = async (formData, success, error) => {
    await post(API_CODE.API_INSPECTION_003, formData, success, error);
};

const deleteInspectionReport = async (id, success, error) => {
    await del(API_CODE.API_INSPECTION_004 + "/" + id, {}, success, error);
};

export const InspectionReportAPI = {
    list,
    details,
    save,
    deleteInspectionReport
};
