<template>
  <div class="title-navigation">
    <!-- Tabs Navigation -->
    <el-tabs v-model="selectedTab" @tab-change="selectTab">
      <el-tab-pane label="Thông tin" name="info"></el-tab-pane>
      <el-tab-pane label="Hoạt động" name="activity"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const selectedTab = ref("info");
const emit = defineEmits(["save", "delete", "close", "tabChange"]);

const selectTab = (tab) => {
  selectedTab.value = tab;
  emit("tabChange", tab);
};
</script>
