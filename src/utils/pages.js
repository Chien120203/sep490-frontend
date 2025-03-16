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
  CONSTRUCT_LOG_DETAILS: "/construct-log/details",

  MOBILIZATION: "/mobilization",

  //resources
  RESOURCES: "/resources",
  MACHINE_RESOURCES: "/resources/list-machine",
  MATERIAL_RESOURCES: "/resources/list-material",
  HUMAN_RESOURCES: "/resources/list-human",
};

export default PAGES;
