<template>
  <div class="item-list">
    <!-- Conditional layout based on requestType -->
    <div v-if="requestType === REQUEST_TYPE_SUPPLY_MORE || requestType === REQUEST_TYPE_SUPPLY_GENERAL_WAREHOUSE">
      <SingleOptionSelect
          :showClearable="true"
          class="select-item"
          :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
          :listData="selectData"
          :isRemote="true"
          @handleSelectedParams="handleSelectItem"
          @remoteSearch="handleSearch"
      />
    </div>
    <div v-else-if="requestType === REQUEST_TYPE_ADD_NEW">
      <el-button style="margin-bottom: 12px" class="btn btn-save" @click="handleAddNewResource">{{ $t("mobilization.add_new") }}</el-button>
    </div>

    <el-form ref="ruleFormRef" :model="listAddedValues" :rules="rules">
      <el-table :data="listAddedValues" border style="width: 100%">
        <el-table-column prop="index" label="STT" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <!-- Conditional Tên tài nguyên -->
        <el-table-column prop="name" label="Tên tài nguyên">
          <template #default="scope">
            <el-form-item :prop="`listAddedValues[${scope.$index}].name`">
              <template v-if="requestType === REQUEST_TYPE_SUPPLY_MORE || requestType === REQUEST_TYPE_SUPPLY_GENERAL_WAREHOUSE">
                {{ getResourceName(scope.row.resourceId) }}
              </template>
              <template v-else-if="requestType === REQUEST_TYPE_ADD_NEW">
                <el-input v-model="scope.row.name" @blur="validateForm" />
              </template>
              <label class="error-feedback" v-if="validationErrors[`name-${scope.$index}`]">
                {{ validationErrors[`name-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>

        <!-- Unit -->
        <el-table-column prop="unit" label="Đơn vị">
          <template #default="scope">
            <el-form-item :prop="`listAddedValues[${scope.$index}].unit`">
              <el-input v-model="scope.row.unit" @blur="validateForm" disabled/>
              <label class="error-feedback" v-if="validationErrors[`unit-${scope.$index}`]">
                {{ validationErrors[`unit-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>

        <!-- Quantity -->
        <el-table-column prop="quantity" label="Số lượng">
          <template #default="{row, $index}">
            <el-form-item :prop="`listAddedValues[${$index}].quantity`">
              <el-input v-model.number="row.quantity" @blur="validateForm" @change="handleChangeValue(listAddedValues[$index].quantity, row.resourceId)"/>
              <label class="error-feedback" v-if="validationErrors[`quantity-${$index}`]">
                {{ validationErrors[`quantity-${$index}`] }}
              </label>
            </el-form-item>
            <p style="margin-bottom: 18px" v-if="resourceType === MATERIAL_TYPE && exceedMessages[row.resourceId]" class="error-feedback">
              {{ exceedMessages[row.resourceId] }}
            </p>
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE && requestType === REQUEST_TYPE_SUPPLY_MORE" :label="$t('planning.items.inventory')">
          <template #default="{ row }">
            {{row.inventory}}
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column :label="$t('mobilization.modal.action')">
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
import {defineEmits, defineProps, ref, reactive, watch} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {REQUEST_MOBILIZATION} from "@/constants/change-request.js";
import { getMobilizationResourceItemRules } from "@/rules/mobilization/index.js";
import {mixinMethods} from "@/utils/variables";
import IconTrash from "@/svg/IconTrash.vue";
import {
  REQUEST_TYPE_ADD_NEW,
  REQUEST_TYPE_SUPPLY_GENERAL_WAREHOUSE,
  REQUEST_TYPE_SUPPLY_MORE
} from "@/constants/mobilization.js";
import {MATERIAL_TYPE} from "@/constants/resource.js";
import {useI18n} from "vue-i18n";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  requestType: {type: [Number, String], default: 1},
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: Number, default: 0 }
});

const {t} = useI18n();

const validationErrors = reactive({});
const exceedMessages = ref({});
const ruleFormRef = ref(null);

defineExpose({
  ruleFormRef,
});
const getResourceName = (resourceId) => {
  return props.selectData.find(item => item?.[props.optionKeys.id] === resourceId)?.[props.optionKeys.value]
}
const listAddedValues = ref(props.tableData || []);
const emit = defineEmits(["search", "update-list"]);
const handleSearch = (value) => {
  emit('search', {value: value, type: props.resourceType});
}
const itemRules = getMobilizationResourceItemRules();
const rules = ref([]);

const handleChangeValue = (quantity, resourceId) => {
  if (props.resourceType === MATERIAL_TYPE && props.resourceType === REQUEST_TYPE_SUPPLY_MORE) {
    let inventory = props.selectData.find(item => item.id === resourceId)?.quantity ?? 0;
    if (inventory < quantity) {
      exceedMessages.value[resourceId] = t('E-PLAN-002');
    } else {
      exceedMessages.value[resourceId] = '';
    }
  }
};

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
      unit: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.unit || "-",
      quantity: 1,
      inventory: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.inventory || 0,
      description: "des",
      type: REQUEST_MOBILIZATION
    });
    rules.value.push(itemRules);
  }
  emit('update-list', listAddedValues.value);
};

const handleAddNewResource = () => {
  listAddedValues.value.push({
    name: '',
    unit: '',
    quantity: 1,
    type: REQUEST_MOBILIZATION,
  });
  emit('update-list', listAddedValues.value);
};


const handleRemoveResource = (id) => {
  listAddedValues.value = listAddedValues.value.filter(resource => resource.resourceId !== id);
  emit('update-list', listAddedValues.value);
}

watch(() => props.tableData, (data) => {
  listAddedValues.value = data
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
