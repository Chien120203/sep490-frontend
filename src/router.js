import { createWebHistory, createRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import PAGES from "@/utils/pages";
import {ADMIN, BUSINESS_EMPLOYEE} from "@/constants/roles.js";
import {ADMIN_MIDDLEWARE, AUTHENTICATION_MIDDLEWARE, BUSINESS_MIDDLEWARE} from "@/constants/middleware.js";
import {usePersistanceStore} from "@/store/persistance.js";

// import pages
import Login from "@/pages/Login.vue";
import Home from "@/pages/Home.vue";
import Customer from  "@/pages/customer/Index.vue"
import User from  "@/pages/user/Index.vue"
import Project from  "@/pages/project/Index.vue"
import Contract from "@/pages/contract/Index.vue"
import CustomerList from "@/pages/customer/CustomerList.vue";
import CustomerDetails from "@/pages/customer/Save.vue";
import UserList from "@/pages/user/UserList.vue";
import UserDetails from "@/pages/user/Save.vue";
import Forbidden from "@/pages/Forbidden.vue";
import ProjectList from "@/pages/project/ProjectList.vue";
import ProjectDetails from "@/pages/project/ProjectDetails.vue";
import ProjectSave from "@/pages/project/Save.vue";
import ContractSave from "@/pages/contract/Save.vue"
import SiteSurveyDetails from "@/pages/site_survey/item/SiteSurveyDetails.vue";
import PlanningDetails from "@/pages/planning/Save.vue";
import PlanningList from "@/pages/planning/PlanningList.vue";
import Planning from "@/pages/planning/Index.vue";
import Progress from "@/pages/progress/Index.vue";
import ProgressDetails from "@/pages/progress/ProgressDetails.vue";
import ConstructLog from "@/pages/construction-log/Index.vue";
import ConstructLogDetails from "@/pages/construction-log/ConstructionLogView.vue";
import ConstructLogSave from "@/pages/construction-log/Save.vue";

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
    name: PAGE_NAME.PROFILE,
    path: PAGES.PROFILE,
    component: Home, // need to add later
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
      middleware: [AUTHENTICATION_MIDDLEWARE, BUSINESS_MIDDLEWARE],
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
    name: PAGE_NAME.PLANNING,
    path: PAGES.PLANNING,
    component: Planning,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.PLANNING_CREATE,
        name: PAGE_NAME.PLANNING.CREATE,
        component: PlanningDetails,
      },
      {
        path: PAGES.PLANNING,
        name: PAGE_NAME.PLANNING.LIST,
        component: PlanningList,
      },
      {
        path: PAGES.PLANNING_DETAILS,
        name: PAGE_NAME.PLANNING.DETAILS,
        component: PlanningDetails,
      }
    ]
  },
  {
    name: PAGE_NAME.PROGRESS,
    path: PAGES.PROGRESS,
    component: Progress,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.PROGRESS_DETAILS,
        name: PAGE_NAME.PROGRESS.DETAILS,
        component: ProgressDetails,
      }
    ]
  },
  {
    name: PAGE_NAME.CONSTRUCT_LOG,
    path: PAGES.CONSTRUCT_LOG,
    component: ConstructLog,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.CONSTRUCT_LOG,
        name: PAGE_NAME.CONSTRUCT_LOG.VIEW,
        component: ConstructLogDetails,
      },
      {
        path: PAGES.CONSTRUCT_LOG_DETAILS,
        name: PAGE_NAME.CONSTRUCT_LOG.DETAILS,
        component: ConstructLogSave,
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
        path: PAGES.PROJECT_CREATE,
        name: PAGE_NAME.PROJECT.CREATE,
        component: ProjectSave,
      },
      {
        path: PAGES.PROJECT_EDIT,
        name: PAGE_NAME.PROJECT.EDIT,
        component: ProjectSave,
      },
      {
        path: PAGES.PROJECT_DETAILS,
        name: PAGE_NAME.PROJECT.DETAILS,
        component: ProjectDetails,
      }
    ]
  },
  {
    name: PAGE_NAME.CONTRACT,
    path: PAGES.CONTRACT,
    component: Contract,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.CONTRACT_CREATE,
        name: PAGE_NAME.CONTRACT.CREATE,
        component: ContractSave,
      },
      {
        path: PAGES.CONTRACT_DETAILS,
        name: PAGE_NAME.CONTRACT.DETAILS,
        component: ContractSave,
      }
    ]
  },
  {
    name: PAGE_NAME.HOME,
    path: PAGES.HOME,
    component: Home,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    }
  },
  {
    name: PAGE_NAME.SITE_SURVEY.DETAILS,
    path: PAGES.SITE_SURVEY_DETAILS,
    component: SiteSurveyDetails,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
  },
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
  const persist = usePersistanceStore();
  const {loggedIn} = persist;

  // Check if middleware exists and includes 'authentication'
  if (middleware && middleware.includes(AUTHENTICATION_MIDDLEWARE) && !token) {
    loggedIn.value = false;
    return next(PAGES.LOGIN);
  }

  //middleware for pages
  if (middleware) {
    if (
      middleware.includes(BUSINESS_MIDDLEWARE) && role !== BUSINESS_EMPLOYEE ||
      middleware.includes(ADMIN_MIDDLEWARE) && role !== ADMIN
    ) {
      if (to.path !== PAGES.FORBIDDEN) return next(PAGES.FORBIDDEN);
    }
  }

  next();
});

export default router;
