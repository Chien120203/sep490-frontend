<template>
  <div class="planning-block">
    <div class="planning planning-create planning-detail">
      <div>
        <div class="progress-details-nav">
          <TitleNavigation
              :listTabs="listTabs"
              :selectedTab="selectedTab"
              @tabChange="handleTabChange"
          />
        </div>

        <div v-if="selectedTab === 'statistic'">
          <StatisticTable :task="task" :listLogsByTask="listLogsByTask" />
        </div>

        <div v-if="selectedTab === 'dependency'">
          <DependencyTaskTable
              ref="dependentFormRef"
              :allowEdit="allowEditRelation"
              :rules="rules"
              :tasks="listTasks"
              :selectedRow="task"
          />
        </div>

        <div v-if="selectedTab === 'material'">
          <ItemList
              ref="tableMaterialFormRef"
              :rules="rules"
              :allowEdit="false"
              :selectedRow="task"
              :selectData="listSelectedMaterials"
              :resourceType="MATERIAL_TYPE"
              :tableData="listSelectedMaterials"
              :optionKeys="materialOptions"
          />
        </div>

        <div v-if="selectedTab === 'employee'">
          <ItemList
              ref="tableHumanFormRef"
              :rules="rules"
              :is-human="true"
              :allowEdit="false"
              :selectedRow="task"
              :selectData="listSelectedUsers"
              :resourceType="HUMAN_TYPE"
              :tableData="listSelectedUsers"
              :optionKeys="userOptions"
          />
        </div>

        <div v-if="selectedTab === 'machine'">
          <ItemList
              ref="tableMachineFormRef" :rules="rules"
              :allowEdit="false"
              :selectData="listSelectedMachines"
              :selectedRow="task"
              :resourceType="MACHINE_TYPE"
              :tableData="listSelectedMachines"
              :optionKeys="vehicleOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, onUnmounted, ref} from "vue";
import TitleNavigation from "@/components/common/TitleNavigation.vue";
import StatisticTable from "@/pages/progress/items/modal/items/progress-details/StatisticTable.vue";
import DependencyTaskTable from "@/pages/progress/items/modal/items/DependencyTaskTable.vue";
import ItemList from "@/pages/progress/items/modal/items/ItemList.vue";
import {HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE} from "@/constants/resource.js";
import dayjs from "dayjs";
import {usePersistenceStore} from "@/store/persistence.js";
import { useI18n } from "vue-i18n";

const props = defineProps({
  listLogsByTask: {
    type: Array,
    default: () => []
  },
  task: {
    type: Object,
    default: () => {}
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  listTasks: {
    type: Array,
    default: () => []
  },
  allowEdit: {
    type: Boolean,
    default: false
  },
  allowEditRelation: {
    type: Boolean,
    default: false
  }
});
const now = dayjs();

const persistenceStore = usePersistenceStore();
const { t } = useI18n();
const {
} = persistenceStore;
const selectedTab = ref("statistic"); // Default tab

//mock data
const listTabs = ref([
  { name: "statistic", label: t("progress.tabs.statistic") },
  { name: "dependency", label: t("progress.tabs.dependency") },
  { name: "employee", label: t("progress.tabs.employee") },
  { name: "material", label: t("progress.tabs.material") },
  { name: "machine", label: t("progress.tabs.machine") }
]);

const materialOptions = ref({id: "id", value: "materialName"});
const userOptions = ref({id: "id", value: "teamName"});
const vehicleOptions = ref({id: "id", value: "chassisNumber"});

const getListResourceByType = (list, type) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => item.resourceType === type);
};
const listSelectedMachines = computed(() => getListResourceByType(props.task?.details, MACHINE_TYPE));
const listSelectedMaterials = computed(() => getListResourceByType(props.task?.details, MATERIAL_TYPE));
const listSelectedUsers = computed(() => getListResourceByType(props.task?.details, HUMAN_TYPE));

onMounted(async () => {
});

onUnmounted(() => {
});

const handleTabChange = (tab) => {
  selectedTab.value = tab;
  if(tab === "dependency") {

  }
};
</script>

<style scoped>
.progress-details-nav {
  padding: 20px 0;
}
</style>
