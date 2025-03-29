import {get, postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const details = async ( params, success, error) => {
    await get(API_CODE.API_SURVEY_001 , success, error, params);
};

const save = async (formData, success, error) => {
    await postFormData(API_CODE.API_SURVEY_002, formData, success, error);
};

export const SiteSurveyAPI = {
    details,
    save,
};