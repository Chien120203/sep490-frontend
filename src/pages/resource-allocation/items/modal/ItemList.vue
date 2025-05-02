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
        <el-table-column prop="index" label="STT" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Tên tài nguyên"/>

        <el-table-column prop="unit" label="Đơn vị">
          <template #default="scope">
            <el-input disabled v-model="scope.row.unit"/>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Số lượng">
          <template #default="{ row, $index }">
            <el-input-number style="width: 100%" :disabled="!allowEdit" :min="0" :max="getInventory(row.resourceId) - getUsedQuantity(row.resourceId, data.fromTaskId)" v-model.number="row.quantity" @change="handleChangeValue(listAddedValues[$index].quantity, row.resourceId)"/>
            <p style="margin-bottom: 18px" v-if="resourceType === MATERIAL_TYPE && exceedMessages[row.resourceId]" class="error-feedback">
              {{ exceedMessages[row.resourceId] }}
            </p>
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE && data.requestType === TASK_TO_TASK" prop="quantity" label="Số lượng su dung">
          <template #default="{ row, $index }">
           {{getUsedQuantity(row.resourceId, data.fromTaskId)}}
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE" :label="$t('planning.items.inventory')">
          <template #default="{ row }">
            {{getInventory(row.resourceId)}}
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE && data.requestType === TASK_TO_TASK" prop="quantity" label="Số lượng con lai">
          <template #default="{ row, $index }">
            {{getInventory(row.resourceId) - getUsedQuantity(row.resourceId, data.fromTaskId)}}
          </template>
        </el-table-column>

        <el-table-column v-if="allowEdit" label="Actions">
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
import {defineEmits, defineProps, ref, watch} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {REQUEST_ALLOCATION, REQUEST_MOBILIZATION} from "@/constants/change-request.js";
import {MATERIAL_TYPE} from "@/constants/resource.js";
import {useI18n} from "vue-i18n";
import IconTrash from "@/svg/IconTrash.vue";
import {TASK_TO_TASK} from "@/constants/allocation.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: Number, default: 0 },
  data: { type: Object, default: () => {} },
  allowEdit: { type: Boolean, default: false },
  rules: {
    type: Object,
    default: () => {}
  },
  progressDetails: {
    type: Object,
    default: () => {}
  }
});
const ruleFormRef = ref(null);
const {t} = useI18n();

defineExpose({
  ruleFormRef
});

const listAddedValues = ref(props.tableData || []);
const exceedMessages = ref({});
const emit = defineEmits(["search", "update-list"]);
const handleSearch = (value) => {
  emit('search', value);
}
const handleChangeValue = (quantity, resourceId) => {
  if (props.resourceType === MATERIAL_TYPE) {
    let inventory = props.selectData.find(item => item[props.optionKeys.id] === resourceId)?.quantity ?? 0;
    if (inventory < quantity) {
      exceedMessages.value[resourceId] = t('E-PLAN-002');
    } else {
      exceedMessages.value[resourceId] = '';
    }
  }
};
const getInventory = (id) => {
  const resource = props.selectData.find(item => item[props.optionKeys.id] === id) || null;
  return resource.quantity || "-";
}
const handleSelectItem = (id) => {
  if (!listAddedValues.value.some(entry => entry?.[props.optionKeys.id] === id)) {
    listAddedValues.value.push({
      resourceId: id,
      name: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.[props.optionKeys.value],
      resourceType: props.resourceType,
      unit: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.unit || "-",
      quantity: 1,
      type: REQUEST_ALLOCATION
    });
  }
  emit('update-list', listAddedValues.value);
};

const getUsedQuantity = (resourceId, taskId) => {
  if (!props.progressDetails || !Array.isArray(props.progressDetails.progressItems) || props.requestType !== TASK_TO_TASK) {
    return 0;
  }

  return props.progressDetails.progressItems.reduce((total, item) => {
    if (Array.isArray(item.details)) {
      const materialUsed = item.details.reduce((sum, detail) => {
        return detail.resourceType === 3 && detail.resourceId === resourceId
            ? sum + (detail.usedQuantity || 0)
            : sum;
      }, 0);
      return total + materialUsed;
    }
    return total;
  }, 0);
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
