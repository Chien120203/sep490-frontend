<template>
  <div class="container-fluid nav-bar">
    <div class="row">
      <div class="col-lg-12 nav-bar-width">
        <div class="logo_nav">
          <a href="/">
            <img
                src="@/assets/image-removebg-preview.png"
                class="logo_zoom_in"
                alt="logo"
            />
          </a>
        </div>
        <el-menu class="with-sidebar nav-bar-list" mode="horizontal">
          <el-sub-menu index="1" mode="vertical">
            <template #title>
              <img
                  src="@/assets/images/avatar/avatar_001.png"
                  alt="logo"
                  class="avatar__img"
              />
              {{ username }}
            </template>
            <el-menu-item @click="logout" index="1-1">
              {{ $t("common.logout") }}
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              {{
                selectedLanguage === EN_LOCALE ? "English" : "Tiếng Việt"
              }}</template
            >
            <el-menu-item @click="changeLocale(EN_LOCALE)" index="3-1"
            >English</el-menu-item
            >
            <el-menu-item @click="changeLocale(VI_LOCALE)" index="3-2"
            >Tiếng Việt</el-menu-item
            >
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import vClickOutside from "click-outside-vue3";
import { VI_LOCALE, EN_LOCALE } from "@/constants/application";
import { i18n } from "@/utils/i18n";
import { $globalLocale } from "@/utils/variables";
import { useAuthStore } from "@/store/auth.js";

export default {
  name: "Navbar",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup() {
    const selectedLanguage = ref(
        localStorage.getItem("CurrentLanguage") || EN_LOCALE
    );
    const username = ref(localStorage.getItem("username"));

    const changeLocale = (val) => {
      selectedLanguage.value = val;
      localStorage.setItem("CurrentLanguage", val);
      $globalLocale.update(val);
      i18n.global.locale.value = val;
    };

    const authStore = useAuthStore();


    const logout = () => {
      authStore.handleLogout();
    };

    onMounted(() => {
      const storedLanguage = localStorage.getItem("CurrentLanguage");
      if (storedLanguage) {
        selectedLanguage.value = storedLanguage;
        $globalLocale.update(storedLanguage);
        i18n.global.locale.value = storedLanguage;
      }
    });

    return {
      selectedLanguage,
      VI_LOCALE,
      EN_LOCALE,
      username,
      $globalLocale,
      changeLocale,
      logout,
    };
  },
};
</script>

<style lang="scss" scoped>
.logo_zoom_in {
  width: 60px;
}
</style>
