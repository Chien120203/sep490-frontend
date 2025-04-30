<template>
  <div class="price-input-form">
    <el-form label-width="30%" :model="selectedRow" ref="ruleFormRef" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">

          <!-- Parent Index -->
          <el-form-item :label="$t('change_request.modal.parent_index')">
            <SingleOptionSelect
                v-model="selectedRow.parentIndex"
                :isDisabled="!allowEdit"
                style="width: 80%"
                :showClearable="true"
                class="select-item"
                :optionKeys="{id: 'index', value: 'workName'}"
                :listData="tasks"
            />
          </el-form-item>

          <!-- Work Name -->
          <el-form-item prop="workName" :label="$t('change_request.modal.work_name')">
            <el-input
                v-model="selectedRow.workName"
                class="custom-input"
                :disabled="!allowEdit"
            />
          </el-form-item>
          <!-- Plan Start Date -->
          <el-form-item prop="planStartDate" :label="$t('change_request.modal.start_date')">
            <el-date-picker
                style="width: 80%"
                v-model="selectedRow.planStartDate"
                type="date"
                class="custom-input"
                :disabled="!allowEdit"
                placeholder="Select Date"
            />
          </el-form-item>

          <!-- Plan End Date -->
          <el-form-item prop="planEndDate" :label="$t('change_request.modal.end_date')">
            <el-date-picker
                style="width: 80%"
                v-model="selectedRow.planEndDate"
                type="date"
                class="custom-input"
                :disabled="!allowEdit"
                placeholder="Select Date"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- Quantity -->
          <el-form-item prop="quantity" :label="$t('change_request.modal.quantity')">
            <el-input
                v-model.number="selectedRow.quantity"
                type="number"
                class="custom-input"
                :disabled="!allowEdit"
            />
          </el-form-item>
          <el-form-item :label="$t('change_request.modal.unit')">
            <el-input
                v-model="selectedRow.unit"
                class="custom-input"
                :disabled="!allowEdit"
            />
          </el-form-item>


          <!-- Unit Price -->
          <el-form-item :label="$t('change_request.modal.unit_price')">
            <el-input
                v-model="selectedRow.unitPrice"
                :formatter="(value) => mixinMethods.formatInputMoney(value)"
                :parser="(value) => mixinMethods.parseInputCurrency(value)"
                class="custom-input"
                :disabled="!allowEdit"
            />
          </el-form-item>

          <el-form-item :label="$t('change_request.modal.total')">
            <el-input
                v-model="totalPrice"
                :formatter="(value) => mixinMethods.formatInputMoney(value)"
                :parser="(value) => mixinMethods.parseInputCurrency(value)"
                class="custom-input"
                :disabled="true"
            />
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import {computed, defineProps, reactive, ref, watch} from "vue";
import {mixinMethods} from "@/utils/variables.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";

const props = defineProps({
  selectedRow: {type: Object, default: () => ({})},
  total: {type: Object, default: () => ({})},
  tasks: {type: Object, default: () => []},
  rules: {
    type: Object,
    default: () => ({
      totalPrice: [
        {required: true, message: "Tổng số tiền không được để trống", trigger: "blur"},
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
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});

const ruleFormRef = ref(null);

// Sync total.totalPrice into selectedRow.totalPrice for validation
watch(
    () => props.total.totalPrice,
    (newVal) => {
      props.selectedRow.totalPrice = newVal;
    },
    {immediate: true}
);

const totalPrice = computed(() => {
  let value = props.selectedRow.unitPrice * props.selectedRow.quantity;
  props.selectedRow.totalPrice = value;
  return value;
})

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
