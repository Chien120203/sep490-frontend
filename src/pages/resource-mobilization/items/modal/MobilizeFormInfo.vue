<template>
  <div class="price-input-form">
    <el-form label-width="30%">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Request Code">
            <el-input v-model="data.requestCode" class="custom-input" />
          </el-form-item>
          <el-form-item label="Request Name">
            <el-input v-model="data.requestName" class="custom-input" />
          </el-form-item>
          <el-form-item label="Request Date">
            <el-date-picker
                style="width: 96%"
                :value-format="DATE_FORMAT"
                v-model="data.requestDate"
                placeholder="Select Date"
                class="input-wd-96"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
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
import { defineProps } from "vue";
import {PRIORITIES, STATUSES} from "@/constants/mobilization.js";
import {DATE_FORMAT} from "@/constants/application.js";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
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
