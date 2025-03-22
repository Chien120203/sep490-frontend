<template>
  <div class="item-list">
    <SingleOptionSelect
        class="select-item"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="listData"
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

      <el-table-column prop="name" label="Tên" width="300">
        <template #default="scope">
          <el-input v-model="scope.row.name"/>
        </template>
      </el-table-column>

      <el-table-column v-if="isExport" prop="time-export" label="Giờ xuất">
        <template #default="scope">
          <el-time-picker
              v-model="scope.row.timeExport"
              arrow-control
              placeholder="Arbitrary time"
          />
        </template>
      </el-table-column>

      <el-table-column v-if="!isExport" prop="time" label="Giờ làm" >
        <template #default="scope">
          <el-time-picker
              v-model="scope.row.time"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
          />
        </template>
      </el-table-column>

      <el-table-column prop="quantity" label="Số lượng" width="160">
        <template #default="scope">
          <el-input v-model.number="scope.row.quantity"/>
        </template>
      </el-table-column>

      <el-table-column prop="unit" label="Đơn vị" width="160">
        <template #default="scope">
          <el-input v-model.number="scope.row.unit"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, ref} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";

const props = defineProps({
  listData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  isExport: { type: Boolean, default: false }
});

const listAddedValues = ref([]);
const emit = defineEmits(["search"]);
const handleSearch = (value) => {
  emit('search', value);
}
const handleSelectItem = (id) => {
  if (!listAddedValues.value.some(entry => entry?.[props.optionKeys.id] === id)) {
    listAddedValues.value.push({
      id: id,
      name: props.listData.find(item => item?.[props.optionKeys.id] === id)?.[props.optionKeys.value],
      unit: "",
      time: "",
      timeExport: "",
      quantity: 1
    });
  }
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
