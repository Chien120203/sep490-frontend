<template>
  <div class="item-list">
    <SingleOptionSelect
        :defaultList="selectedRow"
        class="select-item"
        :is-disabled="!allowEdit"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="selectData"
        :isRemote="true"
        @handleSelectedParams="handleSelectItem"
        @remoteSearch="handleSearch"
    />
    <el-form
        ref="ruleFormRef"
        :disabled="!allowEdit"
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

        <el-table-column prop="name" label="Tên" width="300">
          <template #default="scope">
            {{ getResource(scope.row.resourceId)[optionKeys.value] || "-" }}
          </template>
        </el-table-column>

        <el-table-column :label=" isExport ? 'Giờ xuất' : 'Giờ làm'" width="150">
          <template #default="{row, $index}">
            <el-form-item :prop="`listAddedValues.${$index}.startTime`"
                          :rules="rules.startTime.map(rule => ({ ...rule, row: row }))">
              <el-time-picker
                  v-model="listAddedValues[$index].startTime"
                  :placeholder="isExport ? 'Giờ xuất' : 'Giờ làm'"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column v-if="!isExport" prop="time" label="Giờ nghỉ" width="150">
          <template #default="{row, $index}">
            <el-form-item :prop="`listAddedValues.${$index}.endTime`"
                          :rules="rules.endTime.map(rule => ({ ...rule, row: row }))">
              <el-time-picker
                  v-model="listAddedValues[$index].endTime"
                  placeholder="Giờ nghỉ"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Số lượng"  width="180">
          <template #default="{row, $index}">
            <el-form-item :prop="`listAddedValues.${$index}.quantity`" :rules="rules.quantity">
              <el-input-number :min="0" :max="getResource(row.resourceId)?.plannedQuantity - getResource(row.resourceId)?.usedQuantity" v-model.number="listAddedValues[$index].quantity"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Khối lượng da su dung">
          <template #default="{row, $index}">
            <el-form-item >
              {{ getResource(row.resourceId)?.usedQuantity || "-" }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Định mức">
          <template #default="scope">
            <el-form-item >
              {{ getResource(scope.row.resourceId).plannedQuantity || "-" }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Còn lại">
          <template #default="scope">
            <el-form-item >
              {{ (getResource(scope.row.resourceId)?.plannedQuantity - getResource(scope.row.resourceId)?.usedQuantity) - scope.row.quantity || "-" }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="Đơn vị" width="110">
          <template #default="scope">
            {{ getResource(scope.row.resourceId).unit || "-" }}
          </template>
        </el-table-column>

        <el-table-column :label="'Action'">
          <template #default="{ row, $index }">
            <div>
              <button @click="handleRemoveResource(row.resourceId); $event.preventDefault()" class="btn-edit">
                <IconTrash/>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, ref, computed} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {HUMAN_TYPE} from "@/constants/resource.js";

const props = defineProps({
  selectData: {type: Array, default: () => []},
  resources: {type: Array, default: () => []},
  resourceType: {type: Number, default: 0},
  taskIndex: {type: [String, Number], default: ""},
  taskId: {type: [String, Number], default: ""},
  optionKeys: {type: Object, default: () => ({id: '', value: ''})},
  isExport: {type: Boolean, default: false},
  allowEdit: { type: Boolean, default: false },
  rules: {
    type: Object,
    default: () => {
    }
  }
});
const isHuman = ref(props.resourceType === HUMAN_TYPE);
const selectedRow = ref(null);
const listAddedValues = computed(() => props.resources.filter(resource => resource.taskIndex === props.taskIndex && resource.resourceType === props.resourceType));
const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef
});
const emit = defineEmits(["search", "update-list"]);
const handleSearch = (value) => {
  emit('search', value);
}
const handleSelectItem = (id) => {
  if (!listAddedValues.value.some(entry => entry?.[props.optionKeys.id] === id)) {
    selectedRow.value = id;
    props.resources.push({
      resourceType: props.resourceType,
      taskIndex: props.taskIndex,
      quantity: 1,
      resourceId: id,
      startTime: "",
      endTime: "",
      id: props.taskId
    });
  }
};
const handleRemoveResource = (id) => {
  emit("remove-resource", {resourceId: id, taskIndex: props.taskIndex, resourceType: props.resourceType});
  selectedRow.value = null;
}
const getResource = (id) => {
  return props.selectData.find(item => item[props.optionKeys.id] === id) || {};
}
</script>

<style scoped>
.item-list {
  margin-top: 20px;
}

.select-item {
  width: 30%;
}
</style>
