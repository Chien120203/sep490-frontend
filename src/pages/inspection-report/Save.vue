<template>
  <div class="log-block">
    <div class="log log-create log-detail">
      <div class="log-header">
        <div class="contract-save-title">
          <h3 class="page__ttl">
            <span class="btn-back" @click="handleBack"><IconBackMain/></span>
            {{
              $t('inspection.edit.title')
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
          <InspectionReportDetails
              ref="formLogDetailsRef"
              :rules="constructLogRules"
              :logDetails="constructLogDetails.value"
              @remove-resource="handleRemoveResource"
              @remove-task="handleRemoveTask"
          />
        </div>
        <div class="log-infor">
          <InspectionReportInfo
              ref="formLogInfoRef"
              :rules="constructLogRules"
              :logDetails="constructLogDetails.value"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {mixinMethods} from "@/utils/variables";
import {useConstructLog} from "@/store/construct-log.js";
import {getConstructLogRules} from "@/rules/construct-log/index.js";
import {useI18n} from "vue-i18n";
import InspectionReportDetails from "@/pages/inspection-report/item/InspectionReportDetails.vue";
import InspectionReportInfo from "@/pages/inspection-report/item/InspectionReportInfo.vue";

const constructLogRules = getConstructLogRules();
const constructLogStore = useConstructLog();

const {
  constructLogDetails
} = constructLogStore;

const {t} = useI18n();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
});

onUnmounted(() => {
});

const handleRemoveResource = (data) => {
  constructLogDetails.value.resources = constructLogDetails.value.resources.filter(resource =>
      !(
          resource.taskIndex === data.taskIndex &&
          resource.resourceId === data.resourceId &&
          resource.resourceType === data.resourceType
      )
  );
};

const handleRemoveTask = (taskIndex) => {
  constructLogDetails.value.resources = constructLogDetails.value.resources.filter(resource => resource.taskIndex !== taskIndex);
  constructLogDetails.value.workAmount = constructLogDetails.value.workAmount.filter(work => work.taskIndex !== taskIndex);
}


const handleBack = () => {
  router.push({name: PAGE_NAME.INSPECTION_REPORT.LIST});
};

const formLogDetailsRef = ref(null);
const formLogInfoRef = ref(null);

const submitForm = () => {
  const formRefs = [
    ...formLogDetailsRef.value?.machineForm,
    ...formLogDetailsRef.value?.materialForm,
    ...formLogDetailsRef.value?.humanForm,
    ...formLogDetailsRef.value?.workAmountForm,
    formLogInfoRef.value
  ];
  console.log(constructLogDetails.value)
  for (const form of formRefs) {
    if (form?.ruleFormRef) { // Access ruleFormRef
      const isValid = mixinMethods.validateForm(form.ruleFormRef);
      if (!isValid) {
        mixinMethods.notifyError(t('E-LOG-001'));
        return;
      }
    }
  }
}
</script>
<style scoped>
.log-container {
  display: flex;
}

.log-details {
  margin-right: 12px;
  width: 60%;
}

.log-infor {
  width: 40%;
}
</style>