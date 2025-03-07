<template>
  <div class="contract-create">
    <div class="contract-save-btn">
      <div class="item">
        <el-button class="btn btn-save" @click="submitForm()">
          {{ $t("common.save") }}
        </el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="17">
        <ContractItems :items="contractDetails.value.contractDetails" @update:items="updateItems"/>
      </el-col>
      <el-col :span="7">
        <ContractInformation
            ref="childFormRef"
            :rules="CONTRACT_RULES"
            :listProjects="listProjects.value"
            :contractInfo="contractDetails.value"
            :validation="validation.value"
            @searchProject="handleSearchProjects"
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
import {useCustomerStore} from "@/store/customer.js";
import ContractItems from "@/pages/contract/item/ContractItems.vue";
import ContractInformation from "@/pages/contract/item/ContractInformation.vue";
import {useContractStore} from "@/store/contract.js";
import {getContractRules} from "@/rules/contract/index.js";

const projectStore = useProjectStore();
const contractStore = useContractStore();

const {
  listProjects,
  getListProjects
} = projectStore;
const {
  validation,
  contractDetails,
  saveContract
} = contractStore;

const CONTRACT_RULES = getContractRules();

const route = useRoute();
const isUpdate = computed(() => !!route.params.id);
const router = useRouter();

onMounted(() => {
  getListProjects();
});

onUnmounted(() => {
});

const handleBack = () => {
  router.push({name: PAGE_NAME.PROJECT.LIST});
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
</style>
