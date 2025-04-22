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
              ref="formInspectionReportDetailsRef"
              :rules="inspectionRules"
              :progressDtls="progressDetails.value"
              :inspectionReportDetails="inspectionReportDetails.value"
          />
        </div>
        <div class="log-infor">
          <InspectionReportInfo
              ref="formInspectionReportRef"
              :rules="inspectionRules"
              :inspectionReportDetails="inspectionReportDetails.value"
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
import {useI18n} from "vue-i18n";
import InspectionReportDetails from "@/pages/inspection-report/item/InspectionReportDetails.vue";
import InspectionReportInfo from "@/pages/inspection-report/item/InspectionReportInfo.vue";
import {useInspectionReportStore} from "@/store/inspection.js";
import {getInspectionRules} from "@/rules/inspection-report/index.js";
import {usePersistenceStore} from "@/store/persistence.js";
import {useProgressStore} from "@/store/progress.js";

const inspectionRules = getInspectionRules();
const inspectionStore = useInspectionReportStore();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();

const {
  inspectionReportDetails,
  saveInspectionReport,
  getInspectionReportDetails
} = inspectionStore;
const {
  projectId
} = persistenceStore;
const {
  progressDetails,
  getProgressDetails
} = progressStore;

const {t} = useI18n();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await getProgressDetails(projectId.value, false);
  if(route.params.date && !route.params.id) inspectionReportDetails.value.logDate = route.params.date;
  if(route.params.id) await getInspectionReportDetails(route.params.id);
});

onUnmounted(() => {
});

const handleBack = () => {
  router.push({name: PAGE_NAME.INSPECTION_REPORT.LIST});
};

const formInspectionReportDetailsRef = ref(null);
const formInspectionReportRef = ref(null);

const submitForm = async () => {
  inspectionReportDetails.value.projectId = projectId.value;
  await saveInspectionReport(inspectionReportDetails.value);
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