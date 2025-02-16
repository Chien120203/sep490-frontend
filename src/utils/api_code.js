const API_CODE = {
  // Auth
  API_001: '/authen/sign-in',
  API_002: '/auth/reset-password',
  API_003: '/auth/get-otp',
  API_004: '/auth/refreshtoken',

  //Customer
  API_005: '/customer/list-customer',
  API_006: '/customer/detail-customer',
  API_007: '/customer/update-customer',
  API_008: '/customer/create-customer',
  API_009: '/customer/delete-customer',

  //project
  API_PRJ_001: '/project/list-project',

  //User
  API_010: '/admin/list-user',
  API_011: '/authen/user-profile-detail',
  API_012: '/admin/update-user',
  API_013: '/admin/create-user',
  API_014: '/admin/delete-user',
};

export default API_CODE;
