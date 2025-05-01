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
  updateItem,
  clearSelectedProgressItem,
  getProgressDetails
} = progressStore;

const {
  listLogsByTask,
  getListLogsByTask
} = constructLogStore;
const {
  projectId
} = persistenceStore;

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
onMounted(() => {
  getProgressDetails(projectId.value, true);
});

const setTaskIndex = () => {
  const items = progressDetails.value.progressItems;
  const parentIndex = selectedProgressItem.value.parentIndex;

  let newIndex;

  if (!parentIndex) {
    // Case 1: Top-level task (no parentIndex)
    const topLevelTasks = items.filter(item => !item.parentIndex);
    const maxTopIndex = topLevelTasks.reduce((max, item) => {
      const idx = parseInt(item.index, 10);
      return idx > max ? idx : max;
    }, 0);
    newIndex = (maxTopIndex + 1).toString();
  } else {
    // Case 2: Child task (has parentIndex)
    const childTasks = items.filter(item => item.parentIndex === parentIndex);
    const lastChildIndex = childTasks.reduce((max, item) => {
      const parts = item.index.split('.');
      const last = parseInt(parts[parts.length - 1], 10);
      return last > max ? last : max;
    }, 0);

    newIndex = `${parentIndex}.${lastChildIndex + 1}`;
  }

  return newIndex;
};


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
  selectedProgressItem.value = item[0]?.taskData;
}

const handleSaveProgressItem = async () => {
  isShowModalSave.value = false;
  selectedProgressItem.value.index = await setTaskIndex();
  selectedProgressItem.value.progressId = progressDetails.value.id;
  await saveProgressItem(selectedProgressItem.value);
  clearSelectedProgressItem();
}

const handleUpdateProgressItem = async () => {
  let params = {
    progressId: progressDetails.value.id,
    progress: selectedProgressItem.value.progress,
    id: selectedProgressItem.value.id,
    status: selectedProgressItem.value.status,
    planStartDate: selectedProgressItem.value.planStartDate,
    planEndDate: selectedProgressItem.value.planEndDate,
    actualStartDate: selectedProgressItem.value.actualStartDate,
    actualEndDate: selectedProgressItem.value.actualEndDate,
    itemRelations: selectedProgressItem.value.itemRelations,
  }
  await updateItem(params);
  await clearSelectedProgressItem();
  handleCloseModal();
}

const handleAddTask = async () => {
  await getListInventory({projectId: projectId.value, pageIndex: 1, pageSize: 50});
  isShowModalSave.value = true;
}

const handleDisplayModalSave = (show = false) => {
  isShowModalSave.value = show;
  if(!show) clearSelectedProgressItem();
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
        :progressDetails="selectedProgressItem.value"
        :allowEdit="allowEdit"
        :listLogsByTask="listLogsByTask.value"
        :show="isShowModal"
        @close="handleCloseModal"
        @submit="handleUpdateProgressItem"
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
