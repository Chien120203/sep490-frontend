<template>
  <div class="item-list">
    <!-- Conditional layout based on requestType -->
    <div v-if="requestType === REQUEST_TYPE_SUPPLY_MORE">
      <SingleOptionSelect
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
              <template v-if="requestType === REQUEST_TYPE_SUPPLY_MORE">
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
              <el-input v-model="scope.row.unit" @blur="validateForm" />
              <label class="error-feedback" v-if="validationErrors[`unit-${scope.$index}`]">
                {{ validationErrors[`unit-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>

        <!-- Quantity -->
        <el-table-column prop="quantity" label="Số lượng">
          <template #default="scope">
            <el-form-item :prop="`listAddedValues[${scope.$index}].quantity`">
              <el-input v-model.number="scope.row.quantity" @blur="validateForm" />
              <label class="error-feedback" v-if="validationErrors[`quantity-${scope.$index}`]">
                {{ validationErrors[`quantity-${scope.$index}`] }}
              </label>
            </el-form-item>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column label="Actions">
          <template #default="{ row }">
            <div>
              <button @click="handleRemoveResource(row.resourceId || row.tempId)" class="btn-edit">
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
import {REQUEST_TYPE_ADD_NEW, REQUEST_TYPE_SUPPLY_MORE} from "@/constants/mobilization.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  requestType: {type: [Number, String], default: 1},
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: Number, default: 0 }
});

const validationErrors = reactive({});

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
