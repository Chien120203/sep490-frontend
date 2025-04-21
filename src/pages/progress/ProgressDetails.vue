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

const router = useRouter();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();
const constructLogStore = useConstructLog();
const {
  progressDetails,
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
const humanStore = useHumanResourcesStore();
const machineStore = useMachineResourcesStore();
const changeRequestStore = useChangeRequestStore();
const materialStore = useMaterialResourcesStore();
const {listHumanResources, getListHumanResources} = humanStore;
const {listMachineResources, getListMachineResources} = machineStore;
const {listMaterialResources, getListMaterialResources} = materialStore;
const {
  changeRequestDetails,
  saveChangeRequest
} =changeRequestStore;
const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const tasks = ref(progressDetails.value.progressItems);

watch(
    () => progressDetails.value,
    (newVal) => {
      tasks.value = newVal.progressItems;
    },
    { immediate: true, deep: true } // `immediate` handles initial assignment; `deep` tracks nested changes
)

onMounted(() => {
  getProgressDetails(projectId.value, true);
});

const handleEditProgressItem = (item) => {
  isShowModal.value = true;
  getListLogsByTask(projectId.value, item[0]?.taskData.index);
  progressItem.value = item[0]?.taskData;
}

const handleAddAllocation = () => {

}

const handleAddTask = async () => {
  await getListHumanResources({pageIndex: 1}, false);
  await getListMachineResources({pageIndex: 1}, false);
  await getListMaterialResources({pageIndex: 1}, false);
  isShowModalSave.value = true;
}

const handleDisplayModalSave = (show = false) => {
  isShowModalSave.value = show;
}

const handleSearch = (data) => {
  switch (data.type) {
    case MACHINE_TYPE:
      getListMachineResources({licensePlate: data.value, pageIndex: 1}, false);
      break;
    case HUMAN_TYPE:
      getListHumanResources({teamName: data.value, pageIndex: 1}, false);
      break;
    case MATERIAL_TYPE:
      getListMaterialResources({materialName: data.value, pageIndex: 1}, false);
  }
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
            @add-allocation="handleAddAllocation"
        />
      </div>
    </div>
    <ProgressDetailsModal
        :progressDetails="progressItem"
        :listLogsByTask="listLogsByTask.value"
        :show="isShowModal"
        @close="handleCloseModal"
    />
    <ChangeRequestModal
        :show="isShowModalSave"
        :materials="listMaterialResources.value"
        :vehicles="listMachineResources.value"
        :users="listHumanResources.value"
        :data="changeRequestDetails.value"
        @close="handleDisplayModalSave"
        @search="handleSearch"
        @submit="saveChangeRequest"
    />
  </div>
</template>
