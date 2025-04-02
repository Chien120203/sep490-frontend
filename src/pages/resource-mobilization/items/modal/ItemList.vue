<template>
  <div class="item-list">
    <SingleOptionSelect
        class="select-item"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="selectData"
        :isRemote="true"
        @handleSelectedParams="handleSelectItem"
        @remoteSearch="handleSearch"
    />
    <el-form ref="ruleFormRef" :model="listAddedValues" :rules="rules">
      <el-table :data="listAddedValues" border style="width: 100%">
        <el-table-column prop="index" label="STT" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Tên tài nguyên"/>

        <el-table-column prop="unit" label="Đơn vị">
          <template #default="scope">
            <el-form-item :prop="`listAddedValues[${scope.$index}].unit`">
              <el-input v-model="scope.row.unit" @blur="validateForm"/>
              <label class="error-feedback-customer" v-if="validationErrors[`unit-${scope.$index}`]">
                {{ validationErrors[`unit-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Số lượng">
          <template #default="scope">
            <el-form-item :prop="`listAddedValues[${scope.$index}].quantity`">
              <el-input v-model.number="scope.row.quantity" @blur="validateForm"/>
              <label class="error-feedback-customer" v-if="validationErrors[`quantity-${scope.$index}`]">
                {{ validationErrors[`quantity-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, ref, reactive} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {REQUEST_MOBILIZATION} from "@/constants/change-request.js";
import { getMobilizationResourceItemRules } from "@/rules/mobilization/index.js";
import {mixinMethods} from "@/utils/variables";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: Number, default: 0 }
});

const validationErrors = reactive({});

const ruleFormRef = ref(null);

defineExpose({
  ruleFormRef,
});
const listAddedValues = ref(props.tableData || []);
const emit = defineEmits(["search", "update-list"]);
const handleSearch = (value) => {
  emit('search', value);
}
const itemRules = getMobilizationResourceItemRules();
const rules = ref([]);
// Validate a specific field for a row

// Validate form
const validateForm = () => {
  validationErrors.value = {}; // Clear previous errors

  listAddedValues.value.forEach((item, index) => {
    // Validate each field based on its rules
    Object.keys(itemRules).forEach((field) => {
      mixinMethods.validateField(index, field, itemRules, item, validationErrors);
    });
  });
};

const handleSelectItem = (id) => {
  if (!listAddedValues.value.some(entry => entry?.[props.optionKeys.id] === id)) {
    listAddedValues.value.push({
      resourceId: id,
      name: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.[props.optionKeys.value],
      resourceType: props.resourceType,
      unit: "",
      quantity: 1,
      type: REQUEST_MOBILIZATION
    });
    rules.value.push(itemRules);
  }
  emit('update-list', listAddedValues.value);
};
</script>

<style scoped>
.item-list {
  margin-top: 20px;
}
.select-item {
  width: 30%;
}
</style>
