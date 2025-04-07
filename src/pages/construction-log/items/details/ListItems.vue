<template>
  <div class="item-list">
    <SingleOptionSelect
        class="select-item"
        :defaultList="selectedRow"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="selectData"
        :isRemote="true"
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

        <el-table-column prop="name" label="Tên" width="300">
          <template #default="scope">
            {{ getResource(scope.row.resourceId).name || "-" }}
          </template>
        </el-table-column>

        <el-table-column :label=" isExport ? 'Giờ xuất' : 'Giờ làm'" width="150">
          <template #default="{row, $index}">
            <el-form-item :prop="`listAddedValues.${$index}.startTime`"
                          :rules="rules.startTime.map(rule => ({ ...rule, row: row }))">
              <el-time-picker
                  v-model="row.startTime"
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
                  v-model="row.endTime"
                  placeholder="Giờ nghỉ"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Số lượng">
          <template #default="{$index}">
            <el-form-item :prop="`listAddedValues.${$index}.quantity`" :rules="rules.quantity">
              <el-input :disabled="isHuman" v-model.number="listAddedValues[$index].quantity"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="Đơn vị" width="160">
          <template #default="{row, $index}">
            {{ getResource(row.unit).unit || "-" }}
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

const props = defineProps({
  selectData: {type: Array, default: () => []},
  resources: {type: Array, default: () => []},
  resourceType: {type: Number, default: 0},
  taskIndex: {type: String, default: ""},
  optionKeys: {type: Object, default: () => ({id: '', value: ''})},
  isExport: {type: Boolean, default: false},
  rules: {
    type: Object,
    default: () => {
    }
  }
});
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
    });
  }
};
const handleRemoveResource = (id) => {
  selectedRow.value = null;
  emit("remove-resource", {resourceId: id, taskIndex: props.taskIndex, resourceType: props.resourceType});
}
const getResource = (id) => {
  return props.selectData.find(item => item.resourceId === id) || {};
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
