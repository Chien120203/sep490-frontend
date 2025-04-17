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
          <ConstructLogWorkDetails
              ref="formLogDetailsRef"
              :rules="constructLogRules"
              :logDetails="constructLogDetails.value"
              @remove-resource="handleRemoveResource"
              @remove-task="handleRemoveTask"
          />
        </div>
        <div class="log-infor">
          <ConstructionLogInfor
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
import ConstructLogWorkDetails from "@/pages/construction-log/items/ConstructLogWorkDetails.vue";
import ConstructionLogInfor from "@/pages/construction-log/items/ConstructionLogInfor.vue";
import {useConstructLog} from "@/store/construct-log.js";
import {getConstructLogRules} from "@/rules/construct-log/index.js";
import {useI18n} from "vue-i18n";
import {usePersistenceStore} from "@/store/persistence.js";

const constructLogRules = getConstructLogRules();
const constructLogStore = useConstructLog();
const persistenceStore = usePersistenceStore();

const {
  projectId
} = persistenceStore;
const {
  constructLogDetails,
  saveConstructLog
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
  router.push({name: PAGE_NAME.CONSTRUCT_LOG.VIEW});
};

const formLogDetailsRef = ref(null);
const formLogInfoRef = ref(null);

const submitForm = async () => {
  constructLogDetails.value.projectId = projectId.value;
  // const formRefs = [
  //   ...formLogDetailsRef.value?.machineForm,
  //   ...formLogDetailsRef.value?.materialForm,
  //   ...formLogDetailsRef.value?.humanForm,
  //   ...formLogDetailsRef.value?.workAmountForm,
  //   formLogInfoRef.value
  // ];
  // console.log(constructLogDetails.value)
  // for (const form of formRefs) {
  //   const isValid = await new Promise((resolve) => {
  //     form.ruleFormRef.validate((valid) => resolve(valid));
  //   });
  //
  //   if (!isValid) {
  //     mixinMethods.notifyError(
  //         t("Failed")
  //     );
  //     return; // stop here if one form is invalid
  //   }
  // }
  await saveConstructLog(constructLogDetails.value);
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