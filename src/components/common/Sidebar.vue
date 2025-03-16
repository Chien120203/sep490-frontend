<template>
  <div class="siderbar-block" v-if="isShowComponent">
    <div class="sidebar-logo">
      <a :href="homePath"
        ><img
          src="@/assets/image-removebg-preview.png"
          class="logo_zoom_in"
          alt="logo"
      /></a>
      <a :href="homePath">
        <img
          src="@/assets/image-removebg-preview.png"
          class="logo_zoom_out"
          alt="logo"
        />
      </a>
    </div>
    <div class="menu-box">
      <ul class="nav" v-if="listRouter.length">
        <li
          v-for="(route, index) in listRouter"
          :key="index"
          class="nav-list"
          style="border-bottom: 1px solid #d0d6da"
        >
          <div>
            <a
              v-if="route.isShow"
              href="#"
              @click.prevent="navigateChangeRoute(route)"
              :class="classActive(route)"
              class="js-sidenav-tooltip"
              style="display: flex; align-items: center"
            >
              <component
                :is="route.function_icon"
                class="icon_sidebar"
              ></component>
              <span class="sidebar-text sidebar-custom siderbar_name">{{
                route.function_name
              }}</span>
            </a>
          </div>
        </li>
      </ul>
      <ul class="nav" v-if="listRouterUsers.length">
        <li
            v-for="(route, index) in listRouterUsers"
            :key="index"
            class="nav-list"
            style="border-bottom: 1px solid #d0d6da"
        >
          <div>
            <a
                v-if="route.isShow"
                href="#"
                @click.prevent="navigateChangeRoute(route)"
                :class="classActive(route)"
                class="js-sidenav-tooltip"
                style="display: flex; align-items: center"
            >
              <component
                  :is="route.function_icon"
                  class="icon_sidebar"
              ></component>
              <span class="sidebar-text sidebar-custom siderbar_name">{{
                  route.function_name
                }}</span>
            </a>
          </div>
        </li>
      </ul>
<!--      <p class="nav_others" v-if="listRouter.length">-->
<!--        {{ $t("common.other") }}-->
<!--      </p>-->
      <ul class="nav">
        <li
          v-for="(route, index) in listRouterOthers"
          :key="index"
          style="border-bottom: 1px solid #d0d6da"
        >
          <a
            href="#"
            v-if="route.isShow"
            @click.prevent="navigateChangeRoute(route)"
            :class="classActive(route)"
            class="js-sidenav-tooltip"
            style="display: flex; align-items: center"
          >
            <component
              :is="route.function_icon"
              class="icon_sidebar"
            ></component>
            <span class="sidebar-text sidebar-custom siderbar_name">{{
              route.function_name
            }}</span>
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { ref, computed } from "vue";
import IconCart from "@/svg/IconCart.vue";
import IconUser from "@/svg/IconUser.vue";
import IconUserGroup from "@/svg/IconUserGroup.vue";
import IconContract from "@/svg/IconContract.vue";
import IconBill from "@/svg/IconBill.vue";
import ProjectIcon from "@/svg/ProjectIcon.vue";
import IconRoom from "@/svg/IconRoom.vue";
import IconUtility from "@/svg/IconUtility.vue";
import IconPlanning from "@/svg/IconPlanning.vue";
import PAGE_NAME from "@/constants/route-name.js";
import { useI18n } from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import PAGES from "@/utils/pages.js";
import {FRONT_END_URL} from "@/constants/application.js";

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
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const homePath = ref(`${FRONT_END_URL}${PAGES.HOME}`);
    const isShowComponent = ref(true);
    const isShowProjectSideBar = computed(() => {
      return !route.fullPath.includes(PAGES.PROJECT);
    });
    const menuOpen = ref("");
    const listRouter = computed(() => [
      {
        function_name: t("side_bar.label.customer"),
        function_page_name: PAGE_NAME.CUSTOMER.LIST,
        function_icon: "IconUserGroup",
        isShow: isShowProjectSideBar.value, // set later
      },
      {
        function_name: t("side_bar.label.project"),
        function_page_name: PAGE_NAME.PROJECT.LIST,
        function_icon: "ProjectIcon",
        isShow: isShowProjectSideBar.value, // set later
      },
      {
        function_name: t("side_bar.label.planning"),
        function_page_name: PAGE_NAME.PLANNING.LIST,
        function_icon: "IconPlanning",
        isShow: !isShowProjectSideBar.value, // set later
      }
    ]);

    const listRouterUsers = computed(() => [
      {
        function_name: t("side_bar.label.user"),
        function_page_name: PAGE_NAME.USER.LIST,
        function_icon: "IconUserGroup",
        isShow: isShowProjectSideBar.value, // set later
      }
    ]);

    const listRouterOthers = computed(() => [
      {
        function_name: t("side_bar.label.profile"),
        function_page_name: PAGE_NAME.PROFILE,
        function_icon: "IconUser",
        isShow: true,
      },
    ]);


    const currentPath = ref("");

    const navigateChangeRoute = async (route) => {
      currentPath.value = route.function_page_name;
      await router.push({ name: route.function_page_name });
    };

    const classActive = (route) => {
      return currentPath.value.includes(route.function_page_name)
        ? "active"
        : "";
    };

    return {
      isShowComponent,
      menuOpen,
      currentPath,
      homePath,
      listRouter,
      listRouterUsers,
      listRouterOthers,
      navigateChangeRoute,
      classActive,
    };
  },
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
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

.active-expander {
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

.vmo-name {
  color: #a6abc8;
  font-size: 14px;
  text-align: center;
}
</style>
