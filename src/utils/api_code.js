const API_CODE = {
    // Auth
    API_AUTH_001: '/authen/sign-in',
    API_AUTH_002: '/authen/verify-otp',
    API_AUTH_003: '/authen/reset-password',
    API_AUTH_004: '/authen/change-password',
    API_AUTH_005: '/authen/refresh',
    API_AUTH_006: '/authen/user-profile-detail',
    API_AUTH_007: '/authen/update-profile',

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
    API_PRJ_004: '/project/list-project-status',
    API_PRJ_005: '/project/delete',

    API_CTR_001: '/contract/save-contract',
    API_CTR_002: '/contract/list-contract',
    API_CTR_003: '/contract/detail',

    //User
    API_USER_001: '/admin/list-user',
    API_USER_002: '/admin/update-user',
    API_USER_003: '/admin/create-user',
    API_USER_004: '/admin/delete-user',

    //Site-survey
    API_SURVEY_001: '/survey/detail',
    API_SURVEY_002: '/survey/save',
    API_SURVEY_003: '/survey/delete',

    //Planning
    API_PLANNING_001: '/plans/search',
    API_PLANNING_002: '/plans/create',
    API_PLANNING_003: '/plans/detail',
    API_PLANNING_004: '/plans/update',
    API_PLANNING_005: '/plans',
    API_PLANNING_006: '/plans/approve',
    API_PLANNING_007: '/plans/reject',

    //Mobilization
    API_MOBILIZE_001: '/resourcereq/mobilization/list',
    API_MOBILIZE_002: '/resourcereq/mobilization/save',
    API_MOBILIZE_003: '/resourcereq/mobilization/delete',
    API_MOBILIZE_004: '/resourcereq/mobilization',
    API_MOBILIZE_005: '/resourcereq/mobilization/send',
    API_MOBILIZE_006: '/resourcereq/mobilization/approve',
    API_MOBILIZE_007: '/resourcereq/mobilization/reject',

    //Machine Resource
    API_MACHINE_001: '/vehicle/',
    API_MACHINE_002: '/vehicle/search',
    API_MACHINE_003: '/vehicle/create',
    API_MACHINE_004: '/vehicle/update',
    API_MACHINE_005: '/vehicle/delete',

    //Material Resource
    API_MATERIAL_001: '/material/detail',
    API_MATERIAL_002: '/material/search',
    API_MATERIAL_003: '/material/save',
    API_MATERIAL_004: '/material/delete',

    //Human Resource
    API_HUMAN_001: '/teams/detail',
    API_HUMAN_002: '/teams/search',
    API_HUMAN_003: '/teams/save',
    API_HUMAN_004: '/teams/delete',
    API_HUMAN_005: 'teams/remove-member-from-team',


    //Allocation
    API_ALLOCATION_001: '/resourcereq/allocation/list',
    API_ALLOCATION_002: '/resourcereq/allocation/save',
    API_ALLOCATION_003: '/resourcereq/allocation/',
    API_ALLOCATION_004: '/resourcereq/allocation',
    API_ALLOCATION_005: '/resourcereq/allocation/send',
    API_ALLOCATION_006: '/resourcereq/allocation/approve',
    API_ALLOCATION_007: '/resourcereq/allocation/reject',

    //Inventory
    API_INVENTORY_001: '/resourcereq/inventory/list',

    //Inspection Report
    API_INSPECTION_001: '/inspection-report/list',
    API_INSPECTION_002: '/inspection-report',
    API_INSPECTION_003: '/inspection-report/save',
    API_INSPECTION_004: '/inspection-report/',
    API_INSPECTION_005: '/inspection-report/project/',
    API_INSPECTION_006: '/inspection-report/',
    API_INSPECTION_007: '/inspection-report/reject',

  //Construction Log
  API_CONSTRUCT_LOG_001: '/construction-log/save',
  API_CONSTRUCT_LOG_002: '/construction-log/list',
  API_CONSTRUCT_LOG_003: '/construction-log',
  API_CONSTRUCT_LOG_004: '/construction-log/project',

    //Progress
    API_PROGRESS_001: '/construction-progress/get-by-project',

};

export default API_CODE;
