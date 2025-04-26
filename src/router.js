import { createWebHistory, createRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import PAGES from "@/utils/pages";
import {
  ADMIN,
  BUSINESS_EMPLOYEE, CONSTRUCTION_EMPLOYEE,
  CONSTRUCTION_MANAGER, EXECUTIVE_BOARD,
  QUALITY_ASSURANCE, RESOURCE_MANAGER,
  TECHNICAL_MANAGER
} from "@/constants/roles.js";
import {
  ADMIN_MIDDLEWARE,
  AUTHENTICATION_MIDDLEWARE,
  BUSINESS_EMPLOYEE_MIDDLEWARE, CONSTRUCTION_EMPLOYEE_MIDDLEWARE,
  CONSTRUCTION_MANAGER_MIDDLEWARE,
  EXECUTIVE_BOARD_MIDDLEWARE,
  QUALITY_ASSURANCE_MIDDLEWARE,
  RESOURCE_MANAGER_MIDDLEWARE,
  TECHNICAL_MANAGER_MIDDLEWARE,
  USER_MIDDLEWARE,
} from "@/constants/middleware.js";
import {usePersistenceStore} from "@/store/persistence.js";

// import pages
import Login from "@/pages/Login.vue";
import Home from "@/pages/Home.vue";
import Customer from  "@/pages/customer/Index.vue"
import User from  "@/pages/user/Index.vue"
import Project from  "@/pages/project/Index.vue"
import Contract from "@/pages/contract/Index.vue"
import SiteSurvey from "@/pages/site-survey/Index.vue"
import CustomerList from "@/pages/customer/CustomerList.vue";
import CustomerDetails from "@/pages/customer/Save.vue";
import UserList from "@/pages/user/UserList.vue";
import UserDetails from "@/pages/user/Save.vue";
import Forbidden from "@/pages/Forbidden.vue";
import ProjectList from "@/pages/project/ProjectList.vue";
import ProjectDetails from "@/pages/project/ProjectDetails.vue";
import ProjectSave from "@/pages/project/Save.vue";
import ContractSave from "@/pages/contract/Save.vue"
import SiteSurveySave from "@/pages/site-survey/Save.vue"
import PlanningDetails from "@/pages/planning/Save.vue";
import PlanningList from "@/pages/planning/PlanningList.vue";
import Planning from "@/pages/planning/Index.vue";
import Progress from "@/pages/progress/Index.vue";
import ProgressDetails from "@/pages/progress/ProgressDetails.vue";
import ConstructLog from "@/pages/construction-log/Index.vue";
import ConstructLogDetails from "@/pages/construction-log/ConstructionLogView.vue";
import ConstructLogSave from "@/pages/construction-log/Save.vue";
import Mobilization from "@/pages/resource-mobilization/Index.vue";
import MobilizationList from "@/pages/resource-mobilization/MobilizationList.vue";
import MachineResources from "@/pages/resource/machine-management/Index.vue";
import MachineResourcesSave from "@/pages/resource/machine-management/Save.vue";
import MachineResourceList from "@/pages/resource/machine-management/MachineResourceList.vue";
import MaterialResources from "@/pages/resource/material-management/Index.vue";
import MaterialResourcesSave from "@/pages/resource/material-management/Save.vue";
import MaterialResourceList from "@/pages/resource/material-management/MaterialResourceList.vue";
import HumanResources from "@/pages/resource/human-management/Index.vue";
import HumanResourceList from "@/pages/resource/human-management/HumanResourceList.vue";
import UserProfile from "@/pages/profile/UserProfile.vue";
import Allocation from "@/pages/resource-allocation/Index.vue";
import AllocationList from "@/pages/resource-allocation/AllocationList.vue";
import Inventory from "@/pages/inventory/Index.vue";
import InventoryList from "@/pages/inventory/InventoryList.vue";
import InspectionReport from "@/pages/inspection-report/Index.vue";
import InspectionReportList from "@/pages/inspection-report/InspectionReportList.vue";
import InspectionReportSave from "@/pages/inspection-report/Save.vue";
import ProgressChange from "@/pages/change-request/Index.vue";
import ProgressChangeList from "@/pages/change-request/ChangeRequestList.vue"

const routes = [
  {
    name: PAGE_NAME.LOGIN,
    path: PAGES.LOGIN,
    component: Login,
    meta: {
      middleware: [],
    },
  },
  {
    name: PAGE_NAME.HOME,
    path: PAGES.HOME,
    component: ProjectList,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
  },
  {
    name: PAGE_NAME.PROFILE,
    path: PAGES.PROFILE,
    component: UserProfile,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
  },
  {
    name: PAGE_NAME.FORBIDDEN,
    path: PAGES.FORBIDDEN,
    component: Forbidden,
    meta: {
      middleware: [],
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
    name: PAGE_NAME.RESOURCE_MOBILIZATION,
    path: PAGES.MOBILIZATION,
    component: Mobilization,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.MOBILIZATION,
        name: PAGE_NAME.RESOURCE_MOBILIZATION.LIST,
        component: MobilizationList,
      }
    ]
  },
  {
    name: PAGE_NAME.PROGRESS_CHANGE,
    path: PAGES.PROGRESS_CHANGE,
    component: ProgressChange,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.PROGRESS_CHANGE_LIST,
        name: PAGE_NAME.PROGRESS_CHANGE.LIST,
        component: ProgressChangeList,
      }
    ]
  },
  {
    name: PAGE_NAME.RESOURCE_ALLOCATION,
    path: PAGES.ALLOCATION,
    component: Allocation,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.ALLOCATION,
        name: PAGE_NAME.RESOURCE_ALLOCATION.LIST,
        component: AllocationList,
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
      },
      {
        path: PAGES.CONSTRUCT_LOG_CREATE,
        name: PAGE_NAME.CONSTRUCT_LOG.CREATE,
        component: ConstructLogSave,
      }
    ]
  },
  {
    name: PAGE_NAME.USER,
    path: PAGES.USER,
    component: User,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
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
    name: PAGE_NAME.SITE_SURVEY,
    path: PAGES.SITE_SURVEY,
    component: SiteSurvey,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.SITE_SURVEY_DETAILS,
        name: PAGE_NAME.SITE_SURVEY.DETAILS,
        component: SiteSurveySave,
      },
      {
        path: PAGES.SITE_SURVEY_CREATE,
        name: PAGE_NAME.SITE_SURVEY.CREATE,
        component: SiteSurveySave,
      },
    ]
  },
  {
    name: PAGE_NAME.RESOURCE.MACHINE,
    path: PAGES.MACHINE_RESOURCE,
    component: MachineResources,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        name: PAGE_NAME.RESOURCE.MACHINE.LIST,
        path: PAGES.MACHINE_RESOURCE_LIST,
        component: MachineResourceList,
      },
      {
        name: PAGE_NAME.RESOURCE.MACHINE.DETAILS,
        path: PAGES.MACHINE_RESOURCE_DETAILS,
        component: MachineResourcesSave,
      },
      {
        name: PAGE_NAME.RESOURCE.MACHINE.CREATE,
        path: PAGES.MACHINE_RESOURCE_CREATE,
        component: MachineResourcesSave,
      },
    ]
  },
  {
    name: PAGE_NAME.RESOURCE.MATERIAL,
    path: PAGES.MATERIAL_RESOURCE,
    component: MaterialResources,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        name: PAGE_NAME.RESOURCE.MATERIAL.LIST,
        path: PAGES.MATERIAL_RESOURCE_LIST,
        component: MaterialResourceList,
      },
      {
        name: PAGE_NAME.RESOURCE.MATERIAL.DETAILS,
        path: PAGES.MATERIAL_RESOURCE_DETAILS,
        component: MaterialResourcesSave,
      },
      {
        name: PAGE_NAME.RESOURCE.MATERIAL.CREATE,
        path: PAGES.MATERIAL_RESOURCE_CREATE,
        component: MaterialResourcesSave,
      },
    ]
  },
  {
    name: PAGE_NAME.RESOURCE.HUMAN,
    path: PAGES.HUMAN_RESOURCE,
    component: HumanResources,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        name: PAGE_NAME.RESOURCE.HUMAN.LIST,
        path: PAGES.HUMAN_RESOURCE_LIST,
        component: HumanResourceList,
      },
    ]
  },
  {
    name: PAGE_NAME.INVENTORY,
    path: PAGES.INVENTORY,
    component: Inventory,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        path: PAGES.INVENTORY_LIST,
        name: PAGE_NAME.INVENTORY.LIST,
        component: InventoryList,
      }
    ]
  },
  {
    name: PAGE_NAME.INSPECTION_REPORT,
    path: PAGES.INSPECTION_REPORT,
    component: InspectionReport,
    meta: {
      middleware: [AUTHENTICATION_MIDDLEWARE],
    },
    children: [
      {
        name: PAGE_NAME.INSPECTION_REPORT.LIST,
        path: PAGES.INSPECTION_REPORT_LIST,
        component: InspectionReportList,
      },
      {
        name: PAGE_NAME.INSPECTION_REPORT.DETAILS,
        path: PAGES.INSPECTION_REPORT_DETAILS,
        component: InspectionReportSave,
      },
      {
        name: PAGE_NAME.INSPECTION_REPORT.CREATE,
        path: PAGES.INSPECTION_REPORT_CREATE,
        component: InspectionReportSave,
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);

  const { middleware } = to.meta || {};
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const persist = usePersistenceStore();
  const { loggedIn } = persist;

  // Cho phép truy cập vào login/forbidden mà không cần token
  if ([PAGES.LOGIN, PAGES.FORBIDDEN].includes(to.path)) {
    return next();
  }

  // Kiểm tra xác thực
  if (middleware?.includes(AUTHENTICATION_MIDDLEWARE) && !token) {
    loggedIn.value = false;
    return next(PAGES.LOGIN);
  }

  // Kiểm tra phân quyền
  if (USER_MIDDLEWARE.includes(to.name)) {
    next();
  } else {
    const roleMiddlewareMap = {
      "Business Employee": BUSINESS_EMPLOYEE_MIDDLEWARE,
      "Construction Manager": CONSTRUCTION_MANAGER_MIDDLEWARE,
      "Technical Manager": TECHNICAL_MANAGER_MIDDLEWARE,
      "Quality Assurance": QUALITY_ASSURANCE_MIDDLEWARE,
      "Executive Board": EXECUTIVE_BOARD_MIDDLEWARE,
      "Resource Manager": RESOURCE_MANAGER_MIDDLEWARE,
      "Construction Employee": CONSTRUCTION_EMPLOYEE_MIDDLEWARE,
      "Administrator": ADMIN_MIDDLEWARE,
    };
    const allowedRoutes = roleMiddlewareMap[role];

    if (allowedRoutes?.includes(to.name)) {
      next();
    } else {
      return next(PAGES.FORBIDDEN);
    }
  }
});

export default router;
