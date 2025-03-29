<template>
  <div v-if="loggedIn.value" class="main">
    <div class="container-fluid" style="height: 100vh">
      <div class="row" style="height: 100%">
        <div
            id="remove_block"
            :class="{
            'col10-width-set px-0': true,
            'set-width__block': isMenu,
          }"
            style="height: 100%"
        >
          <div class="main-block">
            <div
                id="remove_class"
                :class="{
                'col2-width-set': true,
                'set-width__menu': isMenu,
                'is-sidebar-hover': isHovered && isWidth1025,
              }"
            >
              <div class="btn-menu">
                <button class="btn-close" @click="handleOpenClose">X</button>
                <button
                    @click="handleMenu"
                    class="btn-menu-item"
                    :class="{ active: isMenu }"
                >
                  <img src="@/assets/images/icon/ico_menu.svg" alt="" />
                </button>
              </div>
              <nav
                  class="sidebar sidebar-inverse sidebar-fixed-top-bs"
                  id="sidebar-general"
                  @mouseover="addHoverClass"
                  @mouseleave="removeHoverClass"
              >
                <Sidebar />
              </nav>
              <div @click="handleOpenClose" class="bg-menu"></div>
            </div>
            <Navbar />
            <div class="btn-box">
              <button class="btn-open" @click="handleOpen">
                <img src="@/assets/images/icon/ico_menu.svg" alt="" />
              </button>
            </div>
            <div class="main-layout">
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Navbar from "@/components/common/Navbar.vue";
import Sidebar from "@/components/common/Sidebar.vue";
import { usePersistenceStore } from "@/store/persistence.js";

export default {
  components: { Navbar, Sidebar },
  setup() {
    const persist = usePersistenceStore();
    const { loggedIn } = persist;
    const isMenu = ref(false);
    const isHovered = ref(false);
    const isWidth1025 = ref(window.innerWidth > 1025);

    const handleMenu = () => {
      isMenu.value = !isMenu.value;
    };

    const handleResize = () => {
      isWidth1025.value = window.innerWidth > 1025;
    };

    const handleOpen = () => {
      document.body.classList.add("hidden");
      document.querySelector("#remove_class").classList.add("active");
    };

    const handleOpenClose = () => {
      document.querySelector("#remove_class").classList.remove("active");
      document.body.classList.remove("hidden");
    };

    const addHoverClass = () => {
      isHovered.value = true;
    };

    const removeHoverClass = () => {
      isHovered.value = false;
    };

    onMounted(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    return {
      isMenu,
      isHovered,
      isWidth1025,
      loggedIn,
      handleMenu,
      handleOpen,
      handleOpenClose,
      addHoverClass,
      removeHoverClass,
    };
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";
@import "@/assets/styles/syncfusion.scss";
//@import url("https://cdn.syncfusion.com/ej2/material.css");

.main-layout {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 2px;
}

.footer {
  background: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: #6c757d;
  position: relative;
  bottom: 0;
  width: 100%;
}
</style>
