const PAGES = {
  HOME: "/",
  LOGIN: "/login",

  //customer
  CUSTOMER: "/customer",
  CUSTOMER_CREATE: "/customer/create",
  CUSTOMER_DETAILS: "/customer/:id",

  //project
  PROJECT: "/project",
  PROJECT_DETAILS: "/project/details/:id",
  PROJECT_CREATE: "/project/create",
  PROJECT_EDIT: "/project/edit/:id",

  //contract
  CONTRACT: "/contract",
  CONTRACT_CREATE: "/contract/create",

  //user
  USER: "/user",
  USER_CREATE: "/user/create",
  USER_DETAILS: "/user/:id",
  FORBIDDEN: "/forbidden",
};

export default PAGES;
