import { createWebHistory, createRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import PAGES from "@/utils/pages";
import { ADMIN } from "@/constants/roles.js";
import {ADMIN_MIDDLEWARE, AUTHENTICATION_MIDDLEWARE} from "@/constants/middleware.js";

// import pages
import Login from "@/pages/Login.vue";
import Home from "@/pages/Home.vue";
import Customer from  "@/pages/customer/Index.vue"
import User from  "@/pages/user/Index.vue"
import Project from  "@/pages/project/Index.vue"
import CustomerList from "@/pages/customer/CustomerList.vue";
import CustomerDetails from "@/pages/customer/Save.vue";
import UserList from "@/pages/user/UserList.vue";
import UserDetails from "@/pages/user/Save.vue";
import Forbidden from "@/pages/Forbidden.vue";
import ProjectList from "@/pages/project/ProjectList.vue";
import ProjectDetails from "@/pages/project/ProjectDetails.vue";

const routes = [
  {
    name: PAGE_NAME.LOGIN,
    path: PAGES.LOGIN,
    component: Login,
  },
  {
    name: PAGE_NAME.HOME,
    path: PAGES.HOME,
    component: Home,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
  },
  {
    name: PAGE_NAME.FORBIDDEN,
    path: PAGES.FORBIDDEN,
    component: Forbidden,
    meta: {
      middleware: [""],
    },
  },
  {
    name: PAGE_NAME.CUSTOMER,
    path: PAGES.CUSTOMER,
    component: Customer,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.CUSTOMER,
        name: PAGE_NAME.CUSTOMER.LIST,
        component: CustomerList,
      },
      {
        path: PAGES.CUSTOMER_CREATE,
        name: PAGE_NAME.CUSTOMER.CREATE,
        component: CustomerDetails,
      },
      {
        path: PAGES.CUSTOMER_DETAILS,
        name: PAGE_NAME.CUSTOMER.DETAILS,
        component: CustomerDetails,
      }
    ]
  },
  {
    name: PAGE_NAME.USER,
    path: PAGES.USER,
    component: User,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE, ADMIN_MIDDLEWARE],
    },
    children: [
      {
        path: "",
        name: PAGE_NAME.USER.LIST,
        component: UserList,
      },
      {
        path: PAGES.USER_CREATE,
        name: PAGE_NAME.USER.CREATE,
        component: UserDetails,
      },
      {
        path: PAGES.USER_DETAILS,
        name: PAGE_NAME.USER.DETAILS,
        component: UserDetails,
      }
    ]
  },
  {
    name: PAGE_NAME.PROJECT,
    path: PAGES.PROJECT,
    component: Project,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.PROJECT,
        name: PAGE_NAME.PROJECT.LIST,
        component: ProjectList,
      },
      {
        path: PAGES.PROJECT_DETAILS,
        name: PAGE_NAME.PROJECT.DETAILS,
        component: ProjectDetails,
      }
    ]
  },
  {
    name: PAGE_NAME.HOME,
    path: PAGES.HOME,
    component: Home,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);

  const { middleware } = to.meta || {}; // Safely access meta.middleware
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // Check if middleware exists and includes 'authentication'
  if (middleware && middleware.includes(AUTHENTICATION_MIDDLEWARE) && !token) {
    return next(PAGES.LOGIN);
  }

  // define middleware for user role here
    if (
    middleware &&
    middleware.includes(ADMIN_MIDDLEWARE) &&
      role !== ADMIN
  ) {
    return next(PAGES.FORBIDDEN);
  }

  next();
});

export default router;
