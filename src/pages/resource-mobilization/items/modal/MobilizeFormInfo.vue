<template>
  <div class="price-input-form">
    <el-form
      ref="ruleFormRef"
      label-width="30%"
      :model="data"
      :rules="rules"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('mobilization.modal.code')">
            <el-input disabled v-model="data.requestCode" class="custom-input" />
          </el-form-item>
          <el-form-item :label="$t('mobilization.modal.name')">
            <el-input :disabled="!allowEdit" v-model="data.requestName" class="custom-input" />
          </el-form-item>
          <el-form-item prop="requestDate" :label="$t('mobilization.modal.date')">
            <el-date-picker
                style="width: 80%;"
                :value-format="DATE_FORMAT"
                v-model="data.requestDate"
                disabled
                placeholder="Select Date"
                class="input-wd-96"
            />
            <label class="error-feedback-customer" v-if="validation && validation.requestDate">
              {{ $t(validation.requestDate) }}
            </label>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="requestType" :label="$t('mobilization.modal.type')" required>
            <el-select :disabled="!allowEdit" v-model="data.requestType">
              <el-option
                  v-for="request in MOBILIZE_REQUEST_TYPES"
                  :key="request.value"
                  :label="$t(request.label)"
                  :value="request.value"
              >
              </el-option>
            </el-select>
            <label class="error-feedback-customer" v-if="validation && validation.requestType">
              {{ $t(validation.requestType) }}
            </label>
          </el-form-item>
          <el-form-item :label="$t('mobilization.modal.priority')">
            <el-select :disabled="!allowEdit" v-model="data.priorityLevel">
              <el-option
                  v-for="(status, index) in PRIORITIES"
                  :key="index"
                  :label="$t(status)"
                  :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('mobilization.modal.description')">
            <el-input :disabled="!allowEdit" v-model="data.description" type="textarea" class="custom-input" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import {MOBILIZE_REQUEST_TYPES, PRIORITIES, STATUSES} from "@/constants/mobilization.js";
import {DATE_FORMAT} from "@/constants/application.js";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  rules: {
    type: Object,
    default: () => {}
  },
  allowEdit: { type: Boolean, default: false },
  validation: {
    type: Object,
    default: () => ({
      requestDate: "",
      requestType: ""
    })
  },
});

const ruleFormRef = ref(null);

defineExpose({
  ruleFormRef,
});

</script>

<style scoped>
.price-input-form {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}

.custom-input {
  width: 80%; /* Input takes 70% width */
}

:deep(.el-form-item__label) {
  width: 20% !important; /* Label takes 30% width */
}
</style>
