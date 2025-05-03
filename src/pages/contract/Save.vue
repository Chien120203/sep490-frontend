<template>
  <div class="contract-create">
    <div class="contract-save-title">
      <span class="btn-back" @click="handleBack"><IconBackMain/></span>
      <h3 class="page__ttl">{{ isUpdate ? $t("contract.detail.title") : $t("contract.create.title") }}</h3>
    </div>
    <div class="contract-save-btn">
      <div class="item">
        <el-button v-if="isAllowUpdate" class="btn btn-save" @click="submitForm()">
          {{ $t("common.save") }}
        </el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="survey-financial-overview">
          <h3>{{ $t('survey.financial') }}</h3>
          <div class="financial-container">
            <div class="financial-item" :class="{ 'warning': isTotalPriceExceedingEstimatedExpenses }">
              <div class="financial-label">{{ $t('survey.details.estimatedExpenses') }}:</div>
              <div class="financial-value">{{ formatCurrency(siteSurveyDetails.value?.estimatedExpenses) }}</div>
              <div v-if="isTotalPriceExceedingEstimatedExpenses" class="warning-message">
                <i class="el-icon-warning"></i> {{ $t('survey.warning.expensesExceeded') }}
              </div>
            </div>
            <div class="financial-item" :class="{ 'warning': isTotalPriceExceedingProjectCost }">
              <div class="financial-label">{{ $t('survey.details.projectCost') }}:</div>
              <div class="financial-value">{{ formatCurrency(siteSurveyDetails.value?.projectCost) }}</div>
              <div v-if="isTotalPriceExceedingProjectCost" class="warning-message">
                <i class="el-icon-warning"></i> {{ $t('survey.warning.projectCostExceeded') }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <ContractItems :contractInfo="contractDetails.value" :actualBudget="actualBudget" :isAllowUpdate="isAllowUpdate" :items="contractDetails.value.contractDetails"  :isUpdate="isUpdate" @update:items="updateItems"/>
      </el-col>
      <el-col :span="7">
        <ContractInformation
            ref="childFormRef"
            :rules="CONTRACT_RULES"
            :isAllowUpdate="isAllowUpdate"
            :projectId="projectId.value"
            :listProjects="[projectDetails.value]"
            :contractInfo="contractDetails.value"
            :validation="validation.value"
            @fileUpload="updateContractAttachments"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {useProjectStore} from "@/store/project.js";
import ContractItems from "@/pages/contract/item/ContractItems.vue";
import ContractInformation from "@/pages/contract/item/ContractInformation.vue";
import {useContractStore} from "@/store/contract.js";
import {getContractRules} from "@/rules/contract/index.js";
import IconBackMain from "@/svg/IconBackMain.vue";
import {usePersistenceStore} from "@/store/persistence.js";
import {BUSINESS_EMPLOYEE} from "@/constants/roles.js";
import {RECEIVE_STATUS} from "@/constants/project.js";
import {useSiteSurveyStore} from "@/store/site-survey.js";
import {mixinMethods} from "@/utils/variables.js";
import {CURRENCY} from "@/constants/application.js";

const projectStore = useProjectStore();
const contractStore = useContractStore();
const persist = usePersistenceStore();
const surveyStore = useSiteSurveyStore();

const {
  listProjects,
  projectDetails,
  getProjectDetails,
} = projectStore;
const {
  validation,
  contractDetails,
  getContractDetails,
  saveContract
} = contractStore;
const {
  siteSurveyDetails,
  getSurveyDetails
} = surveyStore;
const {
  projectId
} = persist;

const CONTRACT_RULES = getContractRules();

const route = useRoute();
const isAllowUpdate = computed(() => localStorage.getItem("role") === BUSINESS_EMPLOYEE && projectDetails.value.status === RECEIVE_STATUS);
const isUpdate = computed(() => !!route.params.id);
const router = useRouter();

onMounted(async () => {
  if(isUpdate.value) await getContractDetails(projectId.value);
  await getSurveyDetails(projectId.value, false);
  contractDetails.value.projectId = Number(projectId.value) || 0;
  await getProjectDetails(projectId.value, false);
  contractDetails.value.startDate = projectDetails.value.startDate;
  contractDetails.value.endDate = projectDetails.value.endDate;
});

onUnmounted(() => {
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const updateItems = (newItems) => {
  contractDetails.value.contractDetails = newItems;
};

const updateContractAttachments = (newContractAttachments) => {
  contractDetails.value.attachments = newContractAttachments;
}

const childFormRef = ref(null);

const submitForm = () => {
  if (childFormRef.value?.ruleFormRef) {
    childFormRef.value.ruleFormRef.validate((valid) => {
      if (valid) {
        saveContract(contractDetails.value);
      }
    });
  } else {
    console.error("Form reference is not available.");
  }
};

const hasChildren = (task) => contractDetails.value.contractDetails.some(child => child.parentIndex === task.index);

const actualBudget = computed(() => contractDetails.value.contractDetails.reduce((sum, item) => {
  return sum + (hasChildren(item) ? 0 : item.total);
}, 0));

const isTotalPriceExceedingEstimatedExpenses = computed(() => {

  if (!siteSurveyDetails.value?.estimatedExpenses || !actualBudget.value) return false;
  return parseFloat(actualBudget.value) > parseFloat(siteSurveyDetails.value.estimatedExpenses);
});

const isTotalPriceExceedingProjectCost = computed(() => {
  if (!siteSurveyDetails.value?.projectCost || !actualBudget.value) return false;
  return parseFloat(actualBudget.value) > parseFloat(siteSurveyDetails.value.projectCost);
});

const formatCurrency = (value) => {
  return `${mixinMethods.formatInputCurrency(value)} ${CURRENCY}`;
};

</script>
<style lang="scss" scoped>
.contract-save-title {
  display: flex;
  span {
    cursor: pointer;
  }
}
.survey-financial-overview {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e6e6e6;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 16px;
  }

  .financial-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .financial-item {
    flex: 1;
    padding: 12px;
    background-color: white;
    border-radius: 6px;
    border: 1px solid #eaeaea;
    transition: all 0.3s ease;

    &.warning {
      border-color: #E6A23C;
      background-color: #FDF6EC;
    }
  }

  .financial-label {
    font-weight: 600;
    margin-bottom: 5px;
    color: #606266;
  }

  .financial-value {
    font-size: 16px;
    color: #303133;
    font-weight: 500;
  }

  .warning-message {
    margin-top: 8px;
    color: #E6A23C;
    font-size: 12px;
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
    }
  }
}
</style>
