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
            <div class="item" style="display: flex;">
              <el-button v-if="allowApprove" class="btn btn-refuse" @click="handleChangeStatus(REJECTED_STATUS)">
                {{ $t("common.reject") }}
              </el-button>
              <el-button v-if="allowApprove" class="btn btn-save" @click="handleChangeStatus(APPROVED_STATUS)">
                {{ $t("common.approve") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="log-container">
        <div class="log-details">
          <InspectionReportDetails
              ref="formInspectionReportDetailsRef"
              :rules="inspectionRules"
              :allowEdit="false"
              :progressDtls="progressDetails.value"
              :inspectionReportDetails="inspectionReportDetails.value"
          />
        </div>
        <div class="log-infor">
          <InspectionReportInfo
              ref="formInspectionReportRef"
              :rules="inspectionRules"
              :allowEdit="allowEdit"
              :inspectionReportDetails="inspectionReportDetails.value"
          />
        </div>
      </div>
    </div>
    <ModalConfirm
        :isShowModal="isShowModalConfirm"
        @close-modal="() => isShowModalConfirm = false"
        @confirmAction="handleConfirm"
        :message="$t('construct_log.modal_confirm.message')"
        :title="$t('construct_log.modal_confirm.title')"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
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
import {EXECUTIVE_BOARD, QUALITY_ASSURANCE, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {WAIT_FOR_APPROVE} from "@/constants/inspection.js";
import {APPROVED_STATUS, REJECTED_STATUS} from "@/constants/construct-log.js";
import ModalConfirm from "@/components/common/ModalConfirm.vue";

const inspectionRules = getInspectionRules();
const inspectionStore = useInspectionReportStore();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();

const {
  inspectionReportDetails,
  saveInspectionReport,
  handleInspectStatus,
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
const allowEdit = computed(() => localStorage.getItem('role') === QUALITY_ASSURANCE && inspectionReportDetails.value.status === WAIT_FOR_APPROVE);
const allowApprove = computed(() => localStorage.getItem('role') === EXECUTIVE_BOARD && inspectionReportDetails.value.status === WAIT_FOR_APPROVE);
const isShowModalConfirm = ref(null);
const changeStatus = ref(null);

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

const handleChangeStatus = (status) => {
  changeStatus.value = status;
  isShowModalConfirm.value = true;
}

const handleConfirm = () => {
  isShowModalConfirm.value = false;
  switch (changeStatus.value) {
    case APPROVED_STATUS:
      handleInspectStatus(inspectionReportDetails.value.id, "approve");
      break;
    case REJECTED_STATUS:
      handleInspectStatus(inspectionReportDetails.value.id, "reject");
  }
}

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