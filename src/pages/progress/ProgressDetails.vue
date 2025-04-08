<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import ProgressGanttChart from "@/pages/progress/items/ProgressGanttChart.vue";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";
import {usePersistenceStore} from "@/store/persistence.js";
import ProgressDetailsModal from "@/pages/progress/items/modal/ProgressDetailsModal.vue"
import {useProgressStore} from "@/store/progress.js";

const router = useRouter();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();

const {
  progressDetails,
  getProgressDetails
} = progressStore;
const {
  projectId
} = persistenceStore;

const progressItem = ref(null);
const isShowModal = ref(false);
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
  getProgressDetails();
});

const handleEditProgressItem = (item) => {
  isShowModal.value = true;
  progressItem.value = item[0]?.taskData;
}

const handleAddAllocation = () => {

}

const handleAddTask = () => {

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
        :show="isShowModal"
        @close="handleCloseModal"
    />
  </div>
</template>
