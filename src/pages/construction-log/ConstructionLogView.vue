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
import {useCustomerStore} from "@/store/customer.js";
import {useUserStore} from "@/store/user.js";
import {mixinMethods} from "@/utils/variables";
import {useContractStore} from "@/store/contract.js";
import ConstructionLogTable from "@/pages/construction-log/items/ConstructionLogTable.vue";
import {usePersistenceStore} from "@/store/persistence.js";
import {useConstructLog} from "@/store/construct-log.js";

const isShowModalItemDtls = ref(false);
const title = ref("Dự Án ABC");

// Store Data
const projectStore = useProjectStore();
const constructLog = useConstructLog();
const customerStore = useCustomerStore();
const userStore = useUserStore();
const contractStore = useContractStore();
const persistenceStore = usePersistenceStore();

const {
  getListProjectLogs,
  listConstructLog
} = constructLog;
const {
  projectId
} = persistenceStore;

const route = useRoute();
const router = useRouter();
const searchForm = ref({
  startDate: "2025-04-01",
  endDate: "2025-04-30"
})
onMounted(async () => {
  // await getListProjectLogs(searchForm.value);
});

onUnmounted(() => {
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const handleChooseDate = (date) => {
  let constructLog = listConstructLog.value.find(log => log.date === date.day);
  if(!constructLog) {
    router.push({name: PAGE_NAME.CONSTRUCT_LOG.CREATE});
  } else router.push({
    name: PAGE_NAME.CONSTRUCT_LOG.DETAILS,
    params: { id: constructLog.id }
  });
}
</script>
