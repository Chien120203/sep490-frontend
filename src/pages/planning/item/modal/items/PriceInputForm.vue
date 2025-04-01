<template>
  <div class="price-input-form">
    <el-form label-width="30%">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Tên công việc">
            <el-input readonly v-model="selectedRow.workName" class="custom-input" />
          </el-form-item>
          <el-form-item label="Ngày bắt đầu">
            <el-date-picker
                style="width: 80%"
                class="custom-input"
                v-model="selectedRow.startDate"
                type="date"
                placeholder="Select Date"
            />
          </el-form-item>

          <el-form-item label="Ngày kết thúc">
            <el-date-picker
                style="width: 80%"
                class="custom-input"
                v-model="selectedRow.endDate"
                type="date"
                placeholder="Select Date"
            />
          </el-form-item>

          <el-form-item label="Ngân sách dự kiến">
            <el-input
                :formatter="(value) => mixinMethods.formatInputCurrency(value)"
                v-model="selectedRow.price"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Tiền Vật liệu">
            <el-input readonly v-model="total.material" placeholder="Vật liệu" class="custom-input" />
          </el-form-item>

          <el-form-item label="Tiền Nhân công">
            <el-input readonly v-model="total.labor" placeholder="Nhân công" class="custom-input" />
          </el-form-item>

          <el-form-item label="Tiền phương tiện">
            <el-input readonly v-model="total.machine" placeholder="Máy thi công" class="custom-input" />
          </el-form-item>

          <el-form-item label="Tổng số tiền">
            <el-input readonly v-model="total.totalPrice" placeholder="Tổng số tiền" class="custom-input" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  selectedRow: { type: Object, default: () => ({}) },
  total: { type: Object, default: () => ({}) },
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
