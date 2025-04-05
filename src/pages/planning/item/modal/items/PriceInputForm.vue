<template>
  <div class="price-input-form">
    <el-form label-width="30%" :model="selectedRow" ref="ruleFormRef" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('planning.modal.work_name')">
            <el-input readonly v-model="selectedRow.workName" class="custom-input" />
          </el-form-item>
          <el-form-item prop="startDate" :label="$t('planning.modal.start_date')">
            <el-date-picker
                style="width: 80%"
                class="custom-input"
                v-model="selectedRow.startDate"
                type="date"
                placeholder="Select Date"
            />
          </el-form-item>

          <el-form-item prop="endDate" :label="$t('planning.modal.end_date')">
            <el-date-picker
                style="width: 80%"
                class="custom-input"
                v-model="selectedRow.endDate"
                type="date"
                placeholder="Select Date"
            />
          </el-form-item>

          <el-form-item :label="$t('planning.modal.price')">
            <el-input
                disabled
                style="width: 80%"
                :formatter="(value) => mixinMethods.formatInputCurrency(value)"
                :parser="(value) => mixinMethods.parseInputCurrency(value)"
                :value=" mixinMethods.formatInputCurrency(selectedRow.quantity * selectedRow.unitPrice)"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Tiền Vật liệu">
            <el-input readonly v-model="total.material" :formatter="(value) => mixinMethods.formatInputCurrency(value)" placeholder="Vật liệu" class="custom-input" />
          </el-form-item>

          <el-form-item label="Tiền Nhân công">
            <el-input readonly v-model="total.labor" :formatter="(value) => mixinMethods.formatInputCurrency(value)" placeholder="Nhân công" class="custom-input" />
          </el-form-item>

          <el-form-item label="Tiền phương tiện">
            <el-input readonly v-model="total.machine" :formatter="(value) => mixinMethods.formatInputCurrency(value)" placeholder="Máy thi công" class="custom-input" />
          </el-form-item>

          <el-form-item label="Tổng số tiền">
            <el-input readonly v-model="total.totalPrice" :formatter="(value) => mixinMethods.formatInputCurrency(value)" placeholder="Tổng số tiền" class="custom-input" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import {defineProps, reactive, ref} from "vue";
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";

const props = defineProps({
  selectedRow: { type: Object, default: () => {} },
  total: { type: Object, default: () => ({}) },
  rules: {
    type: Object,
    default: () => {}
  }
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
