<template>
  <div class="item-list">
    <el-form
        ref="ruleFormRef"
        :disabled="true"
        class="form-search-box"
    >
      <el-table :data="listAddedValues" border style="width: 100%">
        <el-table-column prop="index" :label="$t('construct_log.items.index')" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('construct_log.items.name')" width="300">
          <template #default="scope">
            {{ scope.row.resource.name || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('construct_log.items.used_quantity')">
          <template #default="{ row, $index }">
            <el-form-item>
              {{ row.usedQuantity || '-' }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('construct_log.items.planned_quantity')">
          <template #default="scope">
            <el-form-item>
              {{ scope.row.quantity || '-' }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('construct_log.items.remaining_quantity')">
          <template #default="scope">
            <el-form-item>
              {{ scope.row.quantity - scope.row.usedQuantity || '-' }}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" :label="$t('construct_log.items.unit')" width="110">
          <template #default="scope">
            {{ scope.row.unit || '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { HUMAN_TYPE } from '@/constants/resource.js';

const { t } = useI18n();

const props = defineProps({
  resources: { type: Array, default: () => [] },
  resourceType: { type: Number, default: 0 },
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