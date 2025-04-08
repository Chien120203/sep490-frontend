const PAGES = {
  HOME: "/",
  LOGIN: "/login",
  PROFILE: "/profile",

  //customer
  CUSTOMER: "/customer",
  CUSTOMER_CREATE: "/customer/create",
  CUSTOMER_DETAILS: "/customer/:id",

  //planning
  PLANNING: "/planning",
  PLANNING_CREATE: "/planning/create",
  PLANNING_DETAILS: "/planning/details/:id",

  //progress
  PROGRESS: "/progress",
  PROGRESS_DETAILS: "/progress/details",

  //project
  PROJECT: "/project",
  PROJECT_DETAILS: "/project/details/:id",
  PROJECT_CREATE: "/project/create",
  PROJECT_EDIT: "/project/edit/:id",

  //contract
  CONTRACT: "/contract",
  CONTRACT_CREATE: "/contract/create",
  CONTRACT_DETAILS: "/contract/details/:id",

  //user
  USER: "/user",
  USER_CREATE: "/user/create",
  USER_DETAILS: "/user/:id",
  FORBIDDEN: "/forbidden",

  //site_survey
  SITE_SURVEY: "/site-survey",
  SITE_SURVEY_CREATE: "/site-survey/create",
  SITE_SURVEY_DETAILS: "/site-survey/:id",

  //construction log
  CONSTRUCT_LOG: "/construct-log",
  CONSTRUCT_LOG_DETAILS: "/construct-log/details/:id",
  CONSTRUCT_LOG_CREATE: "/construct-log/create",

  MOBILIZATION: "/mobilization",

    //resource
    RESOURCE: "/resource",

    //resource machine
    MACHINE_RESOURCE: "/resource/machine-management",
    MACHINE_RESOURCE_LIST: "/resource/machine-management/list",
    MACHINE_RESOURCE_CREATE: "/resource/machine-management/create",
    MACHINE_RESOURCE_DETAILS: "/resource/machine-management/:id",

    //resource material
    MATERIAL_RESOURCE: "/resource/material-management",
    MATERIAL_RESOURCE_LIST: "/resource/material-management/list",
    MATERIAL_RESOURCE_CREATE: "/resource/material-management/create",
    MATERIAL_RESOURCE_DETAILS: "/resource/material-management/:id",

    //resource human
    HUMAN_RESOURCE: "/resource/human-management",
    HUMAN_RESOURCE_LIST: "/resource/human-management/list",
    HUMAN_RESOURCE_CREATE: "/resource/human-management/create",
    HUMAN_RESOURCE_DETAILS: "/resource/human-management/:id",
};

export default PAGES;
