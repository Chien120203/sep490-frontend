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

const isShowModalItemDtls = ref(false);
const title = ref("Dự Án ABC");

// Store Data
const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const userStore = useUserStore();
const contractStore = useContractStore();
const persistenceStore = usePersistenceStore();

const {
  contractDetails,
  getContractDetails,
} = contractStore;
const {listUsers, getListUsers} = userStore;
const {listCustomers, getListCustomers} = customerStore;
const {validation, projectDetails, saveProject, getProjectDetails, clearProjectDetails} = projectStore;
const {
  projectId
} = persistenceStore;

const route = useRoute();
const router = useRouter();

onMounted(async () => {
});

onUnmounted(() => {
  clearProjectDetails();
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const updateItems = (newItems) => {
  contractDetails.value.contractDetails = newItems;
};

const handleEditPlanDetails = (id) => {
  isShowModalItemDtls.value = true;
}

const handleCloseModal = () => {
  isShowModalItemDtls.value = false;
}

const ruleFormRef = ref(null);

const handleChooseDate = (date) => {
  router.push({name: PAGE_NAME.CONSTRUCT_LOG.DETAILS}, {id: 1, date: date.day});
}
</script>
