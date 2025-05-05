<template>
  <div class="item-list">
    <SingleOptionSelect
        :isDisabled="!allowEdit"
        class="select-item"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="selectData"
        :isRemote="true"
        :showClearable="true"
        @handleSelectedParams="handleSelectItem"
        @remoteSearch="handleSearch"
    />
    <el-form
        ref="ruleFormRef"
        :model="{ listAddedValues }"
        :rules="rules"
        class="form-search-box"
    >
      <el-table :data="listAddedValues" border style="width: 100%">
        <el-table-column prop="index" :label="$t('common.no')" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('allocation.table.resource_name')" />

        <el-table-column prop="unit" :label="$t('allocation.table.unit')">
          <template #default="scope">
            <el-form-item :prop="`listAddedValues[${scope.$index}].unit`">
              <el-input v-model="scope.row.unit" @blur="validateForm" disabled />
              <label class="error-feedback" v-if="validationErrors[`unit-${scope.$index}`]">
                {{ validationErrors[`unit-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('allocation.table.quantity')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues[${$index}].quantity`">
              <el-input-number
                style="width: 100%"
                :disabled="!allowEdit"
                :min="0"
                :max="getInventory(row.resourceId) - getUsedQuantity(row.resourceId, data.fromTaskId)"
                v-model.number="row.quantity"
                @blur="validateForm"
                @change="handleChangeValue(listAddedValues[$index].quantity, row.resourceId)"
              />
              <label class="error-feedback" v-if="validationErrors[`quantity-${$index}`]">
                {{ validationErrors[`quantity-${$index}`] }}
              </label>
            </el-form-item>
            <p style="margin-bottom: 18px" v-if="resourceType === MATERIAL_TYPE && exceedMessages[row.resourceId]" class="error-feedback">
              {{ exceedMessages[row.resourceId] }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
            v-if="resourceType === MATERIAL_TYPE && data.requestType === TASK_TO_TASK"
            prop="quantity"
            :label="$t('allocation.table.used_quantity')"
        >
          <template #default="{ row }">
            {{ getUsedQuantity(row.resourceId, data.fromTaskId) }}
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE" :label="$t('planning.items.inventory')">
          <template #default="{ row }">
            {{ getInventory(row.resourceId) }}
          </template>
        </el-table-column>

        <el-table-column
            v-if="resourceType === MATERIAL_TYPE && data.requestType === TASK_TO_TASK"
            prop="quantity"
            :label="$t('allocation.table.remaining_quantity')"
        >
          <template #default="{ row }">
            {{ getInventory(row.resourceId) - getUsedQuantity(row.resourceId, data.fromTaskId) }}
          </template>
        </el-table-column>

        <el-table-column v-if="allowEdit" :label="$t('allocation.table.action')">
          <template #default="{ row }">
            <div>
              <button @click="handleRemoveResource(row.resourceId || row.tempId); $event.preventDefault()" class="btn-edit">
                <IconTrash />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import SingleOptionSelect from '@/components/common/SingleOptionSelect.vue';
import { REQUEST_ALLOCATION, REQUEST_MOBILIZATION } from '@/constants/change-request.js';
import { MATERIAL_TYPE } from '@/constants/resource.js';
import IconTrash from '@/svg/IconTrash.vue';
import { TASK_TO_TASK } from '@/constants/allocation.js';
import {mixinMethods} from "@/utils/variables";

const { t } = useI18n();

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: Number, default: 0 },
  data: { type: Object, default: () => ({}) },
  allowEdit: { type: Boolean, default: false },
  rules: { type: Object, default: () => ({}) },
  progressDetails: { type: Object, default: () => ({}) }
});

const ruleFormRef = ref(null);

defineExpose({ ruleFormRef });

const listAddedValues = ref(props.tableData || []);
const exceedMessages = ref({});

const emit = defineEmits(['search', 'update-list']);

const handleSearch = (value) => {
  emit('search', value);
};

const validationErrors = reactive({});
const itemRules = props.rules ;
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

const handleChangeValue = (quantity, resourceId) => {
  if (props.resourceType === MATERIAL_TYPE) {
    let inventory = props.selectData.find(item => item[props.optionKeys.id] === resourceId)?.quantity ?? 0;
    if (inventory < quantity) {
      exceedMessages.value[resourceId] = t('E-PLAN-002');
      emit("disable-submit", true);
    } else {
      exceedMessages.value[resourceId] = '';
      emit("disable-submit", false);
    }
  }
};

const getInventory = (id) => {
  const resource = props.selectData.find(item => item[props.optionKeys.id] === id) || null;
  return resource?.quantity || '-';
};

const getUsedQuantity = (resourceId, taskId) => {
  if (!props.progressDetails || !Array.isArray(props.progressDetails.progressItems) || props.data.requestType !== TASK_TO_TASK) {
    return 0;
  }
  return props.progressDetails.progressItems.reduce((total, item) => {
    if (Array.isArray(item.details)) {
      const materialUsed = item.details.reduce((sum, detail) => {
        return detail.resourceType === MATERIAL_TYPE && detail.resourceId === resourceId
            ? sum + (detail.usedQuantity || 0)
            : sum;
      }, 0);
      return total + materialUsed;
    }
    return total;
  }, 0);
};

const handleSelectItem = (id) => {
  if (!listAddedValues.value.some(entry => entry?.[props.optionKeys.id] === id)) {
    listAddedValues.value.push({
      resourceId: id,
      name: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.[props.optionKeys.value],
      resourceType: props.resourceType,
      unit: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.unit || '-',
      quantity: 1,
      type: REQUEST_ALLOCATION
    });
  }
  emit('update-list', listAddedValues.value);
};

const handleRemoveResource = (id) => {
  listAddedValues.value = listAddedValues.value.filter(resource => resource.resourceId !== id);
  emit('update-list', listAddedValues.value);
};

watch(() => props.tableData, (data) => {
  listAddedValues.value = data;
}, { deep: true });
</script>

<style scoped>
.item-list {
  margin-top: 20px;
}
.select-item {
  width: 30%;
}
</style>