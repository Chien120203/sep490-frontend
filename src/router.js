import { createWebHistory, createRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import PAGES from "@/utils/pages";
import { ADMIN, LANDLORD } from "@/constants/roles.js";
import Cookies from "js-cookie";

// import pages
import Login from "@/pages/Login.vue";
import Home from "@/pages/Home.vue";
import Customer from  "@/pages/customer/Index.vue"
import CustomerList from "@/pages/customer/CustomerList.vue";

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
      middleware: [""],
    },
  },
  {
    name: PAGE_NAME.CUSTOMER,
    path: PAGES.CUSTOMER,
    component: Customer,
    meta: {
      middleware: [""],
    },
    children: [
      {
        path: "",
        name: PAGE_NAME.CUSTOMER.LIST,
        component: CustomerList,
      },
    ]
  },
  {
    name: PAGE_NAME.HOME,
    path: PAGES.HOME,
    component: Home,
    meta: {
      middleware: ["authentication"],
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
  const token = Cookies.get("access_token");
  const highest_role = Cookies.get("highest_role");

  // Check if middleware exists and includes 'authentication'
  if (middleware && middleware.includes("authentication") && !token) {
    // return next(PAGES.LOGIN);
  }

  if (
    middleware &&
    middleware.includes("admin-role") &&
    highest_role !== ADMIN
  ) {
    return next(PAGES.FORBIDDEN);
  }

  if (middleware && middleware.includes("manager-role")) {
    if (highest_role !== ADMIN && highest_role !== LANDLORD)
      return next(PAGES.FORBIDDEN);
  }

  next();
});

export default router;
