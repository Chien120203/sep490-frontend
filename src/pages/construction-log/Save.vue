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
import {useConstructLog} from "@/store/construct-log.js";
import {getConstructLogRules} from "@/rules/construct-log/index.js";

const constructLogRules = getConstructLogRules();
// Store Data
const constructLogStore = useConstructLog();

const {
  constructLogDetails
} = constructLogStore;

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
}


const handleBack = () => {
  router.push({name: PAGE_NAME.CONSTRUCT_LOG.VIEW});
};

const formLogDetailsRef = ref(null);
const formLogInfoRef = ref(null);

const submitForm = () => {
  console.log(constructLogDetails.value)
}
</script>
<style scoped>
.log-container {
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