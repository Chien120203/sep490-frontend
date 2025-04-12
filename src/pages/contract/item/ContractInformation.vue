<template>
  <div class="contract-info">
    <h2>{{$t('contract.create.details')}}</h2>
    <el-form
        ref="ruleFormRef"
        :model="contractInfo"
        :rules="rules"
        class="form-search-box"
    >
      <div class="item">
        <el-form-item prop="contractCode" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.code') }}</span>
          </template>
          <el-input :disabled="!isAllowUpdate" class="input-wd-96" v-model="contractInfo.contractCode" />
          <label class="error-feedback-customer" v-if="validation && validation.contractCode">
            {{ $t(validation.contractCode) }}
          </label>
        </el-form-item>

        <el-form-item prop="contractName" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.name') }}</span>
          </template>
          <el-input :disabled="!isAllowUpdate" class="input-wd-96" v-model="contractInfo.contractName" />
          <label class="error-feedback-customer" v-if="validation && validation.contractName">
            {{ $t(validation.contractName) }}
          </label>
        </el-form-item>

        <el-form-item prop="projectId" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.project') }}</span>
          </template>
          <SingleOptionSelect
              v-model="contractInfo.projectId"
              :optionKeys="{ id: 'id', value: 'projectCode' }"
              :listData="listProjects"
              :isRemote="true"
              :disabled="!isAllowUpdate"
              class="input-wd-96"
              @remoteSearch="handleSearchProject"
          />
          <label class="error-feedback-customer" v-if="validation && validation.projectId">
            {{ $t(validation.projectId) }}
          </label>
        </el-form-item>

        <el-form-item prop="startDate" class="input-container ">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.start_date') }}</span>
          </template>
          <el-date-picker
              style="width: 96%"
              :disabled="!isAllowUpdate"
              :value-format="DATE_FORMAT"
              v-model="contractInfo.startDate"
              placeholder="Select Date"
              class="input-wd-96"
          />
          <label class="error-feedback-user" v-if="validation && validation.startDate">
            {{ $t(validation.startDate) }}
          </label>
        </el-form-item>

        <el-form-item prop="endDate" class="input-container ">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.end_date') }}</span>
          </template>
          <el-date-picker
              style="width: 96%"
              :disabled="!isAllowUpdate"
              :value-format="DATE_FORMAT"
              v-model="contractInfo.endDate"
              placeholder="Select Date"
              class="input-wd-96"
          />
          <label class="error-feedback-user" v-if="validation && validation.endDate">
            {{ $t(validation.endDate) }}
          </label>
        </el-form-item>

        <el-form-item prop="signDate" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.sign_date') }}</span>
          </template>
          <el-date-picker
              style="width: 96%"
              :disabled="!isAllowUpdate"
              v-model="contractInfo.signDate"
              :value-format="DATE_FORMAT"
              type="date"
              placeholder="Select Date"
              class="input-wd-96"
          />
          <label class="error-feedback-user" v-if="validation && validation.signDate">
            {{ $t(validation.signDate) }}
          </label>
        </el-form-item>

        <el-form-item prop="estimatedDays" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.estimate_day') }}</span>
          </template>
          <el-input type="number" :disabled="!isAllowUpdate" v-model="contractInfo.estimatedDays" class="input-wd-96" />
          <label class="error-feedback-customer" v-if="validation && validation.estimatedDays">
            {{ $t(validation.estimatedDays) }}
          </label>
        </el-form-item>

        <el-form-item prop="tax" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.tax') }}</span>
          </template>
          <el-input type="number" :disabled="!isAllowUpdate" v-model="contractInfo.tax" class="input-wd-96" />
          <label class="error-feedback-customer" v-if="validation && validation.tax">
            {{ $t(validation.tax) }}
          </label>
        </el-form-item>

        <el-form-item prop="attachments" class="input-container">
          <template #label>
            <span class="label-start">{{ $t('contract.create.infor.label.attachments') }}</span>
          </template>
          <FileUpload
              :existingFiles="contractInfo.attachments"
              :allowedTypes="'.jpg,.png,.pdf,.docx'"
              :fileLimit="3"
              :disabled="!isAllowUpdate"
              class="input-wd-96"
              @file-selected="handleFileUpload"
          />
          <label class="error-feedback-user" v-if="validation && validation.attachments">
            {{ $t(validation.attachments) }}
          </label>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {DATE_FORMAT} from "@/constants/application.js";
import FileUpload from "@/components/common/FileUpload.vue";
import {ref, defineProps, computed} from "vue";

const props = defineProps({
  contractInfo: {
    type: Object,
    default: () => ({
      id: 0,
      contractCode: "",
      projectId: 0,
      startDate: null,
      endDate: null,
      estimatedDays: 0,
      tax: 0,
      signDate: null,
      attachments: []
    })
  },
  listProjects: {
    type: Array,
    default: () => []
  },
  projectId: {
    type: Number,
    default: 0
  },
  validation: {
    type: Object,
    default: () => ({
      contractCode: "",
      projectId: "",
      startDate: "",
      endDate: "",
      estimatedDays: "",
      tax: "",
      signDate: "",
      attachments: []
    })
  },
  isAllowUpdate: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(["searchProject", "fileUpload"]);

const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const handleSearchProject = (values) => {
  emit("searchProject", values);
};

const handleFileUpload = (files) => {
  emit("fileUpload", files);
};
</script>

<style scoped>
.input-container{
  display: block;
  margin-bottom: 8px;
  .label-start {
    display: block;
  }
  .input-wd-96 {
    width: 96% !important;
  }
}
.el-form-item__label::before {
  display: none;
}
</style>
