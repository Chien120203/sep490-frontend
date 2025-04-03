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
    <el-table :data="listAddedValues" border style="width: 100%">
      <el-table-column prop="index" label="STT" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="Tên tài nguyên"/>

      <el-table-column prop="unit" label="Đơn vị">
        <template #default="scope">
          <el-input v-model="scope.row.unit"/>
        </template>
      </el-table-column>

      <el-table-column prop="quantity" label="Số lượng">
        <template #default="scope">
          <el-input v-model.number="scope.row.quantity"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, ref} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {REQUEST_ALLOCATION, REQUEST_MOBILIZATION} from "@/constants/change-request.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: Number, default: 0 },
});

const listAddedValues = ref(props.tableData || []);
const emit = defineEmits(["search", "update-list"]);
const handleSearch = (value) => {
  emit('search', value);
}
const handleSelectItem = (id) => {
  if (!listAddedValues.value.some(entry => entry?.[props.optionKeys.id] === id)) {
    listAddedValues.value.push({
      resourceId: id,
      name: props.selectData.find(item => item?.[props.optionKeys.id] === id)?.[props.optionKeys.value],
      resourceType: props.resourceType,
      unit: "",
      quantity: 1,
      type: REQUEST_ALLOCATION
    });
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
