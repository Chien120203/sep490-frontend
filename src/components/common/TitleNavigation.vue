<template>
  <div class="title-navigation">
    <!-- Tabs Navigation -->
    <el-tabs v-model="choosedTab" @tab-change="selectTab">
      <el-tab-pane
          v-for="tab in listTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import {ref, defineEmits, computed} from "vue";

const emit = defineEmits(["tabChange"]);
const props = defineProps(
    {
      selectedTab: {
        type: String,
        default: ""
      },
      listTabs: {
        type: Array,
        default: () => []
      }
    }
);
const choosedTab = computed(() => props.selectedTab);
const selectTab = (tab) => {
  emit("tabChange", tab);
};
</script>
