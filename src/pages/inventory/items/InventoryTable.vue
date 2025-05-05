<template>
  <el-table :data="data" style="width: 100%; height: 95%" class="el-tbl-custom room-tbl">
    <!-- Index column (already using i18n) -->
    <el-table-column type="index" min-width="53" :label="$t('common.no')" align="right" />

    <!-- Name column -->
    <el-table-column min-width="160" :label="$t('resource.name')">
      <template #default="scope">
        <span class="data-table">{{ scope.row.name || "-" }}</span>
      </template>
    </el-table-column>

    <!-- Resource Type column -->
    <el-table-column min-width="100" :label="$t('resource.type')">
      <template #default="scope">
        <span class="data-table">{{ $t(getResourceType(scope.row.resourceType)) }}</span>
      </template>
    </el-table-column>

    <!-- Unit column -->
    <el-table-column min-width="100" :label="$t('resource.unit')">
      <template #default="scope">
        <span class="data-table">{{ scope.row.unit }}</span>
      </template>
    </el-table-column>

    <!-- Quantity column -->
    <el-table-column min-width="120" :label="$t('resource.quantity')">
      <template #default="scope">
        <span class="data-table">{{ scope.row.quantity }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { mixinMethods } from "@/utils/variables.js";
import { DATE_FORMAT } from "@/constants/application.js";
import { defineProps } from 'vue';
import {LIST_RESOURCE_TYPES} from "@/constants/resource.js";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  }
});

const formatDate = (inputDate) => {
  return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
};

const getResourceType = (type) => {
  return LIST_RESOURCE_TYPES.find(item => item.value === type).label
}
</script>

<style lang="scss" scoped>
.allocation-status {
  font-size: 12px;
  border-radius: 100px;
  padding: 2px 16px;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
  width: 80%;
  color: #fff;
}

.allocation-active {
  background: #2b7a2b; // green
}

.allocation-inactive {
  background: #a52a2a; // red
}

.data-table {
  display: inline-block;
  width: 100%;
}
</style>

