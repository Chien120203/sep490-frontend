<template>
  <div class="item-list">
    <el-form
        ref="ruleFormRef"
        :disabled="true"
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
            {{ scope.row.resource.name || "-" }}
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Khối lượng da su dung">
          <template #default="{row, $index}">
            <el-form-item >
              {{ row.usedQuantity || "-" }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Định mức">
          <template #default="scope">
            <el-form-item >
              {{ scope.row.quantity || "-" }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Còn lại">
          <template #default="scope">
            <el-form-item >
              {{ scope.row.quantity - scope.row.usedQuantity || "-" }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="Đơn vị" width="110">
          <template #default="scope">
            {{ scope.row.unit || "-" }}
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
  resources: {type: Array, default: () => []},
  resourceType: {type: Number, default: 0},
});
const listAddedValues = computed(() => props.resources.filter(resource => resource.resourceType === props.resourceType));

</script>

<style scoped>
.item-list {
  margin-top: 20px;
}

.select-item {
  width: 30%;
}
</style>
