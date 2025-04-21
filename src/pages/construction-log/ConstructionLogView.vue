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
      <div>
        <ConstructionLogTable
            :title="title"
            :dateRange="searchForm"
            :listLog="listConstructLog.value"
            @choose-date="handleChooseDate"
            @change-date="handleChangeDate"
        />
      </div>
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

// Store Data
const constructLog = useConstructLog();
const projectStore = useProjectStore();
const persistenceStore = usePersistenceStore();

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
const router = useRouter();
const now = dayjs();

const fromDate = now.startOf('month').format('YYYY-MM-DD');
const toDate = now.endOf('month').format('YYYY-MM-DD');

const searchForm = ref({
  projectId: projectId.value,
  fromDate: fromDate,
  toDate: toDate,
  pageSize: 100
});
onMounted(async () => {
  await getListProjectLogs(searchForm.value);
});

onUnmounted(() => {
});

const handleChangeDate = () => {
  getListProjectLogs(searchForm.value);
}

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const handleChooseDate = (date) => {
  if(date.day > dayjs()) {
    return;
  }
  let constructLog = listConstructLog.value.find(log => log.date === date.day);
  if(!constructLog) {
    router.push({name: PAGE_NAME.CONSTRUCT_LOG.CREATE, params:{date: date.day}});
  } else router.push({
    name: PAGE_NAME.CONSTRUCT_LOG.DETAILS,
    params: { id: constructLog.id }
  });
}
</script>
