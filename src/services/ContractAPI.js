import {postFormData} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

const save = async (formData, success, error) => {
  await postFormData(API_CODE.API_CTR_001, formData, success, error);
};

export const ContractAPI = {
  save,
};
