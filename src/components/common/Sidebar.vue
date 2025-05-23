<template>
  <div class="siderbar-block" v-if="isShowComponent">
    <div class="sidebar-logo">
      <a :href="homePath">
        <img src="@/assets/image-removebg-preview.png" class="logo_zoom_in" alt="logo" />
      </a>
      <a :href="homePath">
        <img src="@/assets/image-removebg-preview.png" class="logo_zoom_out" alt="logo" />
      </a>
    </div>
    <div class="menu-box">
      <el-menu class="menu-box" :router="true">
        <template v-for="(route, index) in listRouter" :key="index">
          <el-sub-menu v-if="route.children?.length && route.isShow" :index="route.function_page_name" :unique-opened="true">
            <template #title>
              <component :is="route.function_icon" class="icon_sidebar"/>
              <span class="sidebar-text">{{ route.function_name }}</span>
            </template>
            <template v-for="(routeChild) in route.children" >
              <el-menu-item
                  v-if="routeChild.isShow"
                  :class="classActive(routeChild)"
                  :index="routeChild.function_page_name"
                  @click="navigateChangeRoute(routeChild)"
              >
                <component :is="routeChild.function_icon" class="icon_sidebar"/>
                <span class="sidebar-text">{{ routeChild.function_name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item :class="classActive(route)" v-else-if="route.isShow" :index="route.function_page_name" @click="navigateChangeRoute(route)">
            <component :is="route.function_icon" class="icon_sidebar"/>
            <span class="sidebar-text">{{ route.function_name }}</span>
          </el-menu-item>
        </template>
      </el-menu>

      <el-menu>
        <el-menu-item :class="classActive(route)" v-for="(route, index) in listRouterOthers" :key="index"
                      :index="route.function_page_name" @click="navigateChangeRoute(route)">
          <component :is="route.function_icon" class="icon_sidebar"/>
          <span class="sidebar-text">{{ route.function_name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import IconCart from "@/svg/IconCart.vue";
import IconUser from "@/svg/IconUser.vue";
import IconUserGroup from "@/svg/IconUserGroup.vue";
import IconContract from "@/svg/IconContract.vue";
import IconBill from "@/svg/IconBill.vue";
import ProjectIcon from "@/svg/ProjectIcon.vue";
import IconRoom from "@/svg/IconRoom.vue";
import IconUtility from "@/svg/IconUtility.vue";
import IconPlanning from "@/svg/IconPlanning.vue";
import IconProgress from "@/svg/IconProgress.vue";
import IconChangeRequest from "@/svg/IconChangeRequest.vue";
import IconRequestMobilization from "@/svg/IconRequestMobilization.vue";
import IconRequestAllocation from "@/svg/IconRequestAllocation.vue";
import IconResource from "@/svg/IconResource.vue";
import IconMachine from "@/svg/IconMachine.vue";
import IconMaterial from "@/svg/IconMaterial.vue";
import IconHuman from "@/svg/IconHuman.vue";
import IconLog from "@/svg/IconLog.vue";
import IconInventory from "@/svg/IconInventory.vue";
import IconInspection from "@/svg/IconInspection.vue";
import IconProgressChange from "@/svg/IconProgressChange.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import PAGES from "@/utils/pages.js";
import {FRONT_END_URL} from "@/constants/application.js";
import {PROJECT_SIDEBARS, REQUEST_SIDEBAR} from "@/constants/project.js";
import {
  ADMIN_MIDDLEWARE,
  BUSINESS_EMPLOYEE_MIDDLEWARE, CONSTRUCTION_EMPLOYEE_MIDDLEWARE,
  CONSTRUCTION_MANAGER_MIDDLEWARE,
  EXECUTIVE_BOARD_MIDDLEWARE,
  QUALITY_ASSURANCE_MIDDLEWARE,
  RESOURCE_MANAGER_MIDDLEWARE,
  TECHNICAL_MANAGER_MIDDLEWARE
} from "@/constants/middleware.js";
import {ADMIN, EXECUTIVE_BOARD, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {usePersistenceStore} from "@/store/persistence.js";

export default {
  name: "Sidebar",
  components: {
    IconCart,
    IconRoom,
    IconUser,
    IconBill,
    IconUserGroup,
    IconUtility,
    IconContract,
    ProjectIcon,
    IconPlanning,
    IconProgressChange,
    IconProgress,
    IconLog,
    IconRequestMobilization,
    IconChangeRequest,
    IconInventory,
    IconResource,
    IconMachine,
    IconMaterial,
    IconHuman,
    IconRequestAllocation,
    IconInspection
  },
  setup() {
    const {t} = useI18n();
    const router = useRouter();
    const route = useRoute();
    const homePath = ref(`${FRONT_END_URL}${PAGES.HOME}`);
    const isShowComponent = ref(true);
    const currentPath = ref("");
    const role = computed(() => localStorage.getItem("role"));
    const persist = usePersistenceStore();
    const {
      projectId
    } = persist;
    const setIsShowForMenu = (list) => {
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

      const allowedRoutes = roleMiddlewareMap[role.value] || [];

      const processItems = (items) => {
        return items.map(item => {
          const newItem = {...item};

          if (projectId.value) {
            newItem.isShow = PROJECT_SIDEBARS.includes(newItem.function_page_name) && allowedRoutes.includes(newItem.function_page_name);
          } else {
            newItem.isShow = role.value === ADMIN ? allowedRoutes.includes(newItem.function_page_name) : (allowedRoutes.includes(newItem.function_page_name) && !PROJECT_SIDEBARS.includes(newItem.function_page_name));
            if(role.value === EXECUTIVE_BOARD || role.value === TECHNICAL_MANAGER || role.value === RESOURCE_MANAGER) {
              if(REQUEST_SIDEBAR.includes(newItem.function_page_name)) newItem.isShow = true;
            }
          }

          if (newItem.children) {
            newItem.children = processItems(newItem.children);

            if (newItem.children.some(child => child.isShow)) {
              newItem.isShow = true;
            }
          }

          return newItem;
        });
      };

      return processItems(list);
    };

    const listRouter = computed(() => setIsShowForMenu([
      {
        function_name: t("side_bar.label.customer"),
        function_page_name: PAGE_NAME.CUSTOMER.LIST,
        function_icon: "IconUserGroup",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.project"),
        function_page_name: PAGE_NAME.PROJECT.DETAILS,
        function_icon: "ProjectIcon",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.planning"),
        function_page_name: PAGE_NAME.PLANNING.LIST,
        function_icon: "IconPlanning",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.progress"),
        function_page_name: PAGE_NAME.PROGRESS.DETAILS,
        function_icon: "IconProgress",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.construct_log"),
        function_page_name: PAGE_NAME.CONSTRUCT_LOG.VIEW,
        function_icon: "IconLog",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.inventory"),
        function_page_name: PAGE_NAME.INVENTORY.LIST,
        function_icon: "IconInventory",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.change_request"),
        function_page_name: "",
        function_icon: "IconChangeRequest",
        isShow: false,
        children: [
          {
            function_name: t("side_bar.label.resource_mobilization"),
            function_page_name: PAGE_NAME.RESOURCE_MOBILIZATION.LIST,
            function_icon: "IconRequestMobilization",
            isShow: false,
          },
          {
            function_name: t("side_bar.label.resource_allocation"),
            function_page_name: PAGE_NAME.RESOURCE_ALLOCATION.LIST,
            function_icon: "IconRequestAllocation",
            isShow: false,
          },
        ],
      },
      {
        function_name: t("side_bar.label.resource.title"),
        function_page_name: "",
        function_icon: "IconResource",
        isShow: false,
        children: [
          {
            function_name: t("side_bar.label.resource.machine"),
            function_page_name: PAGE_NAME.RESOURCE.MACHINE.LIST,
            function_icon: "IconMachine",
            isShow: false,
          },
          {
            function_name: t("side_bar.label.resource.material"),
            function_page_name: PAGE_NAME.RESOURCE.MATERIAL.LIST,
            function_icon: "IconMaterial",
            isShow: false,
          },
          {
            function_name: t("side_bar.label.resource.human"),
            function_page_name: PAGE_NAME.RESOURCE.HUMAN.LIST,
            function_icon: "IconHuman",
            isShow: false,
          },
        ],
      },
      {
        function_name: t("side_bar.label.inspector_report"),
        function_page_name: PAGE_NAME.INSPECTION_REPORT.LIST,
        function_icon: "IconInspection",
        isShow: false, // set later
      },
      {
        function_name: t("side_bar.label.user"),
        function_page_name: PAGE_NAME.USER.LIST,
        function_icon: "IconUserGroup",
        isShow: false, // set later
      }
    ]));

    const listRouterOthers = computed(() => [
      {
        function_name: t("side_bar.label.profile"),
        function_page_name: PAGE_NAME.PROFILE,
        function_icon: "IconUser",
        isShow: true,
      },
    ]);


    const navigateChangeRoute = async (route) => {
      currentPath.value = route.function_page_name;
      if(route.function_page_name === PAGE_NAME.PROJECT.DETAILS) {
        if(projectId.value) {
          await router.push({name: route.function_page_name, params: {id: projectId.value}});
        } else await router.push({name: PAGE_NAME.PROJECT.LIST});
        return;
      }
      await router.push({name: route.function_page_name});
    };

    const classActive = (route) => {
      return currentPath.value.includes(route.function_page_name)
          ? "active"
          : "";
    };


    return {
      isShowComponent,
      currentPath,
      homePath,
      listRouter,
      listRouterOthers,
      navigateChangeRoute,
      classActive,
    };
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

:deep(.el-menu) {
  background-color: #ebeeff !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #dfe3fc !important;
  color: #5a6acf !important;
}

:deep(.el-sub-menu__title) {
  padding: 11px 24px !important;
}

:deep(.el-sub-menu) {
  .el-menu-item {
    padding: 11px 32px !important;
  }
}

:deep(.el-menu-item) {
  font-size: 14px;
  color: #333 !important;
  padding: 11px 24px !important;
}

:deep(.el-menu-item:hover) {
  background-color: #dfe3fc !important;
  color: #5a6acf !important;
}


.nav_others {
  font-size: 12px;
  color: #7a8998;
  padding-left: 70px;
  font-family: "Poppins", sans-serif;
  margin: 23px 0 3px;
}

.sidebar-text {
  width: 100%;
}

.sidebar-text:hover {
  color: #5a6acf !important;
}

.active {
  background-color: #dfe3fc;
  border-radius: 4px;

  span {
    color: #5a6acf !important;
  }
}

.menu-box {
  max-height: 90vh;
  overflow-y: auto;
  flex-grow: 1;
}

.icon_sidebar {
  min-width: 18px; /* Prevent shifting */
  margin-right: 18px; /* Space between icon and text */
}

.el-menu--collapse .sidebar-text {
  display: none;
}

.el-menu--collapse .el-sub-menu__icon-arrow {
  display: none;
}

</style>