<template>
  <div class="log-block">
    <div class="log log-create log-detail">
      <div class="log-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
           $t('construct_log.view.title')
          }}
        </h3>
      </div>
      <SingleOptionSelect
          class="select-item"
          :optionKeys="{ id: 'index', value: 'workName' }"
          :listData="listProgressItems"
          :isRemote="true"
          :showClearable="true"
          :placeholder="'Chọn công việc'"
          @handleSelectedParams="handleSelectTask"
      />
      <div>
        <ConstructionLogTable
            :dateRange="searchForm"
            :listLog="listConstructLog.value"
            @choose-date="handleChooseDate"
            @change-date="handleChangeDate"
        />
      </div>
      <ListLogsModal
          :show="showLogModal"
          :data="constructLogs"
          @details="handleGetLogDetails"
          @close="handleCloseModal"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useProjectStore} from "@/store/project.js";
import ConstructionLogTable from "@/pages/construction-log/items/ConstructionLogTable.vue";
import {usePersistenceStore} from "@/store/persistence.js";
import {useConstructLog} from "@/store/construct-log.js";
import dayjs from 'dayjs';
import {DATE_FORMAT} from "@/constants/application.js";
import ListLogsModal from "@/pages/construction-log/items/modal/ListLogsModal.vue";
import {mixinMethods} from "@/utils/variables.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {useProgressStore} from "@/store/progress.js";
import {useI18n} from "vue-i18n";

// Store Data
const constructLog = useConstructLog();
const projectStore = useProjectStore();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();
const {
  progressDetails,
  getProgressDetails
} = progressStore;
const {
  getListProjectLogs,
  listConstructLog
} = constructLog;
const {

} = projectStore;
const {
  projectId
} = persistenceStore;

const route = useRoute();
const {t} = useI18n();
const router = useRouter();
const now = dayjs();
const listProgressItems = computed(() => {
  const filteredItems = progressDetails.value.progressItems?.filter(item => item.progress !== 100) || [];
  return [{ index: "all", workName: t('common.all') }, ...filteredItems];
});
const fromDate = now.startOf('month').format('YYYY-MM-DD');
const toDate = now.endOf('month').format('YYYY-MM-DD');

const searchForm = ref({
  projectId: projectId.value,
  fromDate: fromDate,
  toDate: toDate,
  pageSize: 100,
  taskIndex: "",
});
const constructLogs = ref([]);
const showLogModal = ref(false);
onMounted(async () => {
  await getListProjectLogs(searchForm.value);
  await getProgressDetails(projectId.value, true);
});

onUnmounted(() => {
});

const handleChangeDate = () => {
  getProgressDetails(projectId.value, true);
  getListProjectLogs(searchForm.value);
}

const handleSelectTask = (taskIndex) => {
  searchForm.value.taskIndex = taskIndex === "all" ? "" : taskIndex;
  getListProjectLogs(searchForm.value);
}

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const handleCloseModal = () => {
  constructLogs.value = [];
  showLogModal.value = false;
}

const handleGetLogDetails = (id) => {
  router.push({
    name: PAGE_NAME.CONSTRUCT_LOG.DETAILS,
    params: { id: id }
  });
  handleCloseModal();
}

const handleChooseDate = (date) => {
  if(date.day > dayjs().format(DATE_FORMAT)) {
    mixinMethods.notifyWarning("Cannot create log in the future");
    return;
  }
  constructLogs.value = listConstructLog.value.filter(log => dayjs(log.logDate).format(DATE_FORMAT) === date.day);
  if(constructLogs.value.length === 0) {
    router.push({name: PAGE_NAME.CONSTRUCT_LOG.CREATE, params:{date: date.day}});
  } else showLogModal.value = true;
}
</script>

<style scoped>
.select-item {
  width: 40%;
}
</style>
