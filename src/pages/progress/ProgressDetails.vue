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
import ChangeRequestModal from "@/pages/change-request/item/modal/ChangeRequestModal.vue";
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
  isShowModal,
  clearSelectedProgressItem,
  saveProgressItem,
  updateItem,
  getProgressDetails
} = progressStore;

const {
  listLogsByTask,
  getListLogsByTask
} = constructLogStore;
const {
  projectId
} = persistenceStore;

const isShowModalSave = ref(false);
const inventoryStore = useInventoryStore();
const {
  getListInventory
} = inventoryStore;
const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const tasks = ref(progressDetails.value.progressItems);
const allowCreate = computed(() => localStorage.getItem('role') === TECHNICAL_MANAGER);
watch(
    () => progressDetails.value,
    (newVal) => {
      tasks.value = newVal.progressItems;
    },
    {immediate: true, deep: true}
)
onMounted(() => {
  getProgressDetails(projectId.value, true);
});

const handleEditProgressItem = (item) => {
  isShowModal.value = true;
  getListLogsByTask(projectId.value, item[0]?.taskData.index);
  selectedProgressItem.value = item[0]?.taskData;
}

const handleSaveProgressItem = async () => {
  isShowModalSave.value = false;
  selectedProgressItem.value.progressId = progressDetails.value.id;
  await saveProgressItem(selectedProgressItem.value);
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
}

const handleAddTask = async () => {
  await getListInventory({projectId: projectId.value, pageIndex: 1, pageSize: 50});
  isShowModalSave.value = true;
}

const handleDisplayModalSave = (show = false) => {
  isShowModalSave.value = show;
  if(show) clearSelectedProgressItem();
}

const handleCloseModal = () => {
  isShowModal.value = false;
  clearSelectedProgressItem();
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
        :listLogsByTask="listLogsByTask.value"
        :show="isShowModal.value"
        @close="handleCloseModal"
        @submit="handleUpdateProgressItem"
    />
    <ChangeRequestModal
        :selectedRow="selectedProgressItem.value"
        :show="isShowModalSave"
        :tasks="progressDetails.value.progressItems"
        :allowEdit="allowCreate"
        @close="handleDisplayModalSave"
        @submit="handleSaveProgressItem"
    />
  </div>
</template>
