const API_CODE = {
  // Auth
  API_AUTH_001: '/authen/sign-in',
  API_AUTH_002: '/authen/verify-otp',
  API_AUTH_003: '/authen/reset-password',
  API_AUTH_004: '/authen/change-password',
  API_AUTH_005: '/authen/refresh',

  //Customer
  API_CUS_001: '/customer/list-customer',
  API_CUS_002: '/customer/detail-customer',
  API_CUS_003: '/customer/update-customer',
  API_CUS_004: '/customer/create-customer',
  API_CUS_005: '/customer/delete-customer',

  //project
  API_PRJ_001: '/project/list',
  API_PRJ_002: '/project/save',
  API_PRJ_003: '/project/detail',

  //User
  API_USER_001: '/admin/list-user',
  API_USER_002: '/authen/user-profile-detail',
  API_USER_003: '/admin/update-user',
  API_USER_004: '/admin/create-user',
  API_USER_005: '/admin/delete-user',

  //Site-survey
  API_SURVEY_001: '/survey/search',
  API_SURVEY_002: '/survey/detail',
  API_SURVEY_003: '/admin/save',
  API_SURVEY_004: '/admin/delete',
};

export default API_CODE;
