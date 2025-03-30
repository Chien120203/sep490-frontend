import {post, get} from '@/services/BaseService';
import API_CODE from '@/utils/api_code';

// Function to handle login
const login = async (params, success, error) => {
  await post(API_CODE.API_AUTH_001, params, success, error);
};

const getOTP = async (params, success, error) => {
  await post(API_CODE.API_AUTH_002, params, success, error);
}

const resetPassword = async (params, success, error) => {
  await post(API_CODE.API_AUTH_003, params, success, error);
};

const changePassword = async (params, success, error) => {
  await post(API_CODE.API_AUTH_004, params, success, error);
};

const updateUserProfile = async (params, success, error) => {
  await post(API_CODE.API_AUTH_007, params, success, error);
};

export const AuthenticationAPI = {
  login,
  resetPassword,
  getOTP,
  changePassword,
  updateUserProfile
};
