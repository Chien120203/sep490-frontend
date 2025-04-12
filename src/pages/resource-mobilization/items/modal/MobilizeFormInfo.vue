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
          <el-form-item label="Request Code">
            <el-input disabled v-model="data.requestCode" class="custom-input" />
          </el-form-item>
          <el-form-item label="Request Name">
            <el-input v-model="data.requestName" class="custom-input" />
          </el-form-item>
          <el-form-item prop="requestDate" label="Request Date">
            <el-date-picker
                style="width: 80%;"
                :value-format="DATE_FORMAT"
                v-model="data.requestDate"
                placeholder="Select Date"
                class="input-wd-96"
            />
            <label class="error-feedback-customer" v-if="validation && validation.requestDate">
              {{ $t(validation.requestDate) }}
            </label>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Request Type" required>
            <el-select v-model="data.requestType">
              <el-option
                  v-for="request in MOBILIZE_REQUEST_TYPES"
                  :key="request.value"
                  :label="$t(request.label)"
                  :value="request.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Priority">
            <el-select v-model="data.priorityLevel">
              <el-option
                  v-for="(status, index) in PRIORITIES"
                  :key="index"
                  :label="status"
                  :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Description">
            <el-input v-model="data.description" type="textarea" class="custom-input" />
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
  validation: {
    type: Object,
    default: () => ({
      requestDate: ""
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
