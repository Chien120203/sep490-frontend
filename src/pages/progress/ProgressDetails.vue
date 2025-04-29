<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import ProgressGanttChart from "@/pages/progress/items/ProgressGanttChart.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";
import {usePersistenceStore} from "@/store/persistence.js";
import ProgressDetailsModal from "@/pages/progress/items/modal/ProgressDetailsModal.vue"
import {useProgressStore} from "@/store/progress.js";
import {useConstructLog} from "@/store/construct-log.js";
import {usePlanningStore} from "@/store/planning.js";
import ChangeRequestModal from "@/pages/change-request/item/modal/ChangeRequestModal.vue";
import {useHumanResourcesStore} from "@/store/human-resources.js";
import {useMachineResourcesStore} from "@/store/machine-resources.js";
import {useMaterialResourcesStore} from "@/store/material-resources.js";
import {useChangeRequestStore} from "@/store/change-request.js";
import {HUMAN_TYPE, MACHINE_TYPE, MATERIAL_TYPE} from "@/constants/resource.js";
import {PROJECT_TO_PROJECT, PROJECT_TO_TASK, TASK_TO_TASK} from "@/constants/allocation.js";
import {useInventoryStore} from "@/store/inventory.js";
import {TECHNICAL_MANAGER} from "@/constants/roles.js";
import {getProgressRules} from "@/rules/progress/index.js";

const router = useRouter();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();
const constructLogStore = useConstructLog();
const {
  progressDetails,
  selectedProgressItem,
  saveProgressItem,
  getProgressDetails
} = progressStore;

const {
  listLogsByTask,
  getListLogsByTask
} = constructLogStore;
const {
  projectId
} = persistenceStore;

const progressItem = ref(null);
const isShowModal = ref(false);
const isShowModalSave = ref(false);
const inventoryStore = useInventoryStore();
const {
  inventoryData,
  getListInventory
} = inventoryStore;
const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const progressRules = getProgressRules();

const tasks = ref(progressDetails.value.progressItems);
const allowEdit = computed(() => localStorage.getItem('role') === TECHNICAL_MANAGER);
watch(
    () => progressDetails.value,
    (newVal) => {
      tasks.value = newVal.progressItems;
    },
    { immediate: true, deep: true }
)

watch(
    () => selectedProgressItem.value.parentIndex,
    (newVal) => {
      if(newVal) {
        setTaskIndex();
      }
    },
    { immediate: true, deep: true }
)

onMounted(() => {
  getProgressDetails(projectId.value, true);
});

const setTaskIndex = () => {

}

const materials = computed(() => {
  return inventoryData.value.filter(item => item.resourceType === MATERIAL_TYPE).map(item => ({
    id: item.resourceId,
    quantity: item.quantity,
    unit: item.unit,
    name: item.name
  })) || [];
});
const listVehicles = computed(() => {
  return inventoryData.value.filter(item => item.resourceType === MACHINE_TYPE).map(item => ({
    id: item.resourceId,
    quantity: item.quantity,
    unit: item.unit,
    name: item.name
  })) || [];
});
const listEmployees = computed(() => inventoryData.value.filter(item => item.resourceType === HUMAN_TYPE));

const handleEditProgressItem = (item) => {
  isShowModal.value = true;
  getListLogsByTask(projectId.value, item[0]?.taskData.index);
  progressItem.value = item[0]?.taskData;
}

const handleSaveProgressItem = () => {
  isShowModalSave.value = false;
  saveProgressItem(selectedProgressItem.value);
}

const handleAddTask = async () => {
  await getListInventory({projectId: projectId.value, pageIndex: 1, pageSize: 50});
  isShowModalSave.value = true;
}

const handleDisplayModalSave = (show = false) => {
  isShowModalSave.value = show;
}

const handleCloseModal = () => {
  isShowModal.value = false;
}
</script>

<template>
  <div class="progress-block">
    <div class="progress progress-create progress-detail">
      <div class="progress-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            $t('progress.details.title')
          }}
        </h3>
      </div>
      <div v-if="!tasks"></div>
      <div v-else>
        <ProgressGanttChart
            :tasks="tasks"
            @handleSelectRow="handleEditProgressItem"
            @add-task="handleAddTask"
        />
      </div>
    </div>
    <ProgressDetailsModal
        :progressItems="progressDetails.value.progressItems"
        :progressDetails="progressItem"
        :listLogsByTask="listLogsByTask.value"
        :show="isShowModal"
        @close="handleCloseModal"
    />
    <ChangeRequestModal
        :selectedRow="selectedProgressItem.value"
        :show="isShowModalSave"
        :materials="materials"
        :vehicles="listVehicles"
        :tasks="progressDetails.value.progressItems"
        :users="listEmployees"
        :rules="progressRules"
        :allowEdit="allowEdit"
        @close="handleDisplayModalSave"
        @submit="handleSaveProgressItem"
    />
  </div>
</template>
