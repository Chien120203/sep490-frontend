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
            <el-button v-if="allowEdit" class="btn btn-save" @click="submitForm()">
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
          <ConstructLogWorkDetails
              ref="formLogDetailsRef"
              :rules="constructLogRules"
              :allowEdit="allowEdit"
              :progressDtls="progressDetails.value"
              :logDetails="constructLogDetails.value"
              @remove-resource="handleRemoveResource"
              @remove-task="handleRemoveTask"
          />
        </div>
        <div class="log-infor">
          <ConstructionLogInfor
              ref="formLogInfoRef"
              :allowEdit="allowEdit"
              :rules="constructLogRules"
              :logDetails="constructLogDetails.value"
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
import { computed, onMounted, onUnmounted, ref } from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import PAGE_NAME from "@/constants/route-name.js";
import ConstructLogWorkDetails from "@/pages/construction-log/items/ConstructLogWorkDetails.vue";
import ConstructionLogInfor from "@/pages/construction-log/items/ConstructionLogInfor.vue";
import {useConstructLog} from "@/store/construct-log.js";
import {getConstructLogRules} from "@/rules/construct-log/index.js";
import {useI18n} from "vue-i18n";
import {usePersistenceStore} from "@/store/persistence.js";
import {useProgressStore} from "@/store/progress.js";
import {mixinMethods} from "@/utils/variables.js";
import {CONSTRUCTION_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {APPROVED_STATUS, REJECTED_STATUS, WAIT_FOR_APPROVE} from "@/constants/construct-log.js";
import ModalConfirm from "@/components/common/ModalConfirm.vue";

const constructLogRules = getConstructLogRules();
const constructLogStore = useConstructLog();
const persistenceStore = usePersistenceStore();
const progressStore = useProgressStore();

const {
  projectId
} = persistenceStore;
const {
  constructLogDetails,
  saveConstructLog,
  getConstructLogDetails,
  handleChangeLogStatus,
  clearConstructLog,
} = constructLogStore;
const {
  progressDetails,
  getProgressDetails
} = progressStore;

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const isShowModalConfirm = ref(null);
const changeStatus = ref(null);
onMounted(async () => {
  await getProgressDetails(projectId.value, false);
  if (route.params.date && !route.params.id) constructLogDetails.value.logDate = route.params.date;
  if (route.params.id) await getConstructLogDetails(route.params.id);
});

onUnmounted(() => {
  clearConstructLog();
  changeStatus.value = null;
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
  router.push({name: PAGE_NAME.CONSTRUCT_LOG.VIEW});
};

const handleChangeStatus = (status) => {
  changeStatus.value = status;
  isShowModalConfirm.value = true;
}

const handleConfirm = () => {
  isShowModalConfirm.value = false;
  switch (changeStatus.value) {
    case APPROVED_STATUS:
      handleChangeLogStatus(constructLogDetails.value.id, "approve");
      break;
    case REJECTED_STATUS:
      handleChangeLogStatus(constructLogDetails.value.id, "reject");
  }
}

const formLogDetailsRef = ref(null);
const formLogInfoRef = ref(null);
const allowEdit = computed(() => localStorage.getItem('role') === CONSTRUCTION_MANAGER && constructLogDetails.value.status === WAIT_FOR_APPROVE);
const allowApprove = computed(() => localStorage.getItem('role') === TECHNICAL_MANAGER && constructLogDetails.value.status === WAIT_FOR_APPROVE);
const submitForm = async () => {
  constructLogDetails.value.projectId = projectId.value;
  constructLogDetails.value.images = constructLogDetails.value.images.map(image => image.raw);
  const formRefs = [
    ...formLogDetailsRef.value?.machineForm,
    ...formLogDetailsRef.value?.materialForm,
    ...formLogDetailsRef.value?.humanForm,
    ...formLogDetailsRef.value?.workAmountForm,
    formLogInfoRef.value
  ];
  for (const form of formRefs) {
    const isValid = await new Promise((resolve) => {
      if (form.ruleFormRef) {
        form.ruleFormRef?.validate((valid) => resolve(valid));
      } else {
        form.validate((valid) => resolve(valid));
      }
    });
    if (!isValid) {
      mixinMethods.notifyError(
          t("Failed")
      );
      return; // stop here if one form is invalid
    }
  }
  await saveConstructLog(constructLogDetails.value);
}
</script>
<style scoped>
.log-container {
  display: flex;
}

.log-details {
  margin-right: 12px;
  width: 70%;
}

.log-infor {
  width: 30%;
}
</style>