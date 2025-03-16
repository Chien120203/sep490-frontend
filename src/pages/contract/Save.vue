<template>
  <div class="contract-create">
    <div class="contract-save-title">
      <span class="btn-back" @click="handleBack"><IconBackMain/></span>
      <h3 class="page__ttl">{{ isUpdate ? $t("contract.detail.title") : $t("contract.create.title") }}</h3>
    </div>
    <div class="contract-save-btn">
      <div class="item">
        <el-button class="btn btn-save" @click="submitForm()">
          {{ $t("common.save") }}
        </el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="17">
        <ContractItems :isAllowUpdate="isAllowUpdate" :items="contractDetails.value.contractDetails"  :isUpdate="isUpdate" @update:items="updateItems"/>
      </el-col>
      <el-col :span="7">
        <ContractInformation
            ref="childFormRef"
            :rules="CONTRACT_RULES"
            :isAllowUpdate="isAllowUpdate"
            :projectId="projectId.value"
            :listProjects="listProjects.value"
            :contractInfo="contractDetails.value"
            :validation="validation.value"
            @searchProject="handleSearchProjects"
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
import {RECEIVE_STATUS} from "@/constants/project.js";
import {usePersistanceStore} from "@/store/persistance.js";

const projectStore = useProjectStore();
const contractStore = useContractStore();
const persist = usePersistanceStore();

const {
  listProjects,
  projectDetails,
  getListProjects
} = projectStore;
const {
  validation,
  contractDetails,
  getContractDetails,
  saveContract
} = contractStore;
const {
  projectId
} = persist;

const CONTRACT_RULES = getContractRules();

const route = useRoute();
const isAllowUpdate = ref(projectDetails.value.status === RECEIVE_STATUS);
const isUpdate = computed(() => !!route.params.id);
const router = useRouter();

onMounted(async () => {
  if(isUpdate.value) getContractDetails(route.params.id);
  await getListProjects({
    keyword: '',
    pageIndex: 1,
  }, false);
  listProjects.value = listProjects.value.filter((item) => {return item.id == projectId.value});
  console.log(listProjects);
});

onUnmounted(() => {
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
};

const handleSearchProjects = (value) => {
  getListProjects({
    keyword: value,
    pageIndex: 1,
  }, false);
}

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

</script>
<style lang="scss" scoped>
.contract-save-title {
  display: flex;
  span {
    cursor: pointer;
  }
}
</style>
