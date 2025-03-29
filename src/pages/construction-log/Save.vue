<template>
  <div class="log-block">
    <div class="log log-create log-detail">
      <div class="log-header">
        <div class="contract-save-title">
          <h3 class="page__ttl">
            <span class="btn-back" @click="handleBack"><IconBackMain/></span>
            {{
              $t('construct_log.edit.title')
            }}
          </h3>
        </div>
        <div class="contract-save-btn">
          <div class="item">
            <el-button class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="log-container">
        <div class="log-details">
          <ConstructLogWorkDetails/>
        </div>
        <div class="log-infor">
          <ConstructionLogInfor/>
        </div>
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
import ConstructLogWorkDetails from "@/pages/construction-log/items/ConstructLogWorkDetails.vue";
import ConstructionLogInfor from "@/pages/construction-log/items/ConstructionLogInfor.vue";

const isShowModalItemDtls = ref(false);
const title = ref("Dự Án ABC");

// Store Data
const projectStore = useProjectStore();
const customerStore = useCustomerStore();
const userStore = useUserStore();
const contractStore = useContractStore();

const {
  contractDetails,
  getContractDetails,
} = contractStore;
const {listUsers, getListUsers} = userStore;
const {listCustomers, getListCustomers} = customerStore;
const {validation, projectDetails, saveProject, getProjectDetails, clearProjectDetails} = projectStore;

const route = useRoute();
const router = useRouter();

onMounted(async () => {
});

onUnmounted(() => {
  clearProjectDetails();
});

const handleBack = () => {
  router.push({name: PAGE_NAME.CONSTRUCT_LOG.VIEW});
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

}

const submitForm = () => {

}
</script>
<style scoped>
.log-container{
  display: flex;
}

.log-details {
  margin-right: 12px;
  width: 65%;
}

.log-infor {
  width: 35%;
}
</style>