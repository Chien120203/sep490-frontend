<template>
  <div class="price-input-form">
    <el-form label-width="30%" :model="selectedRow" ref="ruleFormRef" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('planning.modal.work_name')">
            <el-input disabled v-model="selectedRow.workName" class="custom-input" />
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
                :value="mixinMethods.formatInputCurrency(selectedRow.quantity * selectedRow.unitPrice)"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('planning.planned.material')">
            <el-input
                disabled
                v-model="total.material"
                :formatter="(value) => mixinMethods.formatInputCurrency(value)"
                class="custom-input"
            />
          </el-form-item>

          <el-form-item :label="$t('planning.planned.human')">
            <el-input
                disabled
                v-model="total.labor"
                :formatter="(value) => mixinMethods.formatInputCurrency(value)"
                class="custom-input"
            />
          </el-form-item>

          <el-form-item :label="$t('planning.planned.machine')">
            <el-input
                disabled
                v-model="total.machine"
                :formatter="(value) => mixinMethods.formatInputCurrency(value)"
                class="custom-input"
            />
          </el-form-item>

          <!-- Validation moved to selectedRow.totalPrice -->
          <el-form-item prop="totalPrice" :label="$t('planning.planned.total')">
            <el-input
                disabled
                v-model="selectedRow.totalPrice"
                :formatter="(value) => mixinMethods.formatInputCurrency(value)"
                class="custom-input"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, reactive, ref, watch } from "vue";
import { mixinMethods } from "@/utils/variables.js";

const props = defineProps({
  selectedRow: { type: Object, default: () => ({}) },
  total: { type: Object, default: () => ({}) },
  rules: {
    type: Object,
    default: () => ({
      totalPrice: [
        { required: true, message: "Tổng số tiền không được để trống", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value <= 0) {
              callback(new Error("Tổng số tiền phải lớn hơn 0"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      ]
    })
  }
});

const ruleFormRef = ref(null);

// Sync total.totalPrice into selectedRow.totalPrice for validation
watch(
    () => props.total.totalPrice,
    (newVal) => {
      props.selectedRow.totalPrice = newVal;
    },
    { immediate: true }
);

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
  width: 80%;
}

:deep(.el-form-item__label) {
  width: 20% !important;
}
</style>
