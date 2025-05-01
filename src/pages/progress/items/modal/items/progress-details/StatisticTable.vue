<template>
  <el-table
      :data="generateTaskStats"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
  >
    <el-table-column fixed prop="name" label="Công việc" width="250" />
    <el-table-column fixed prop="plan" label="Định mức" />
    <el-table-column fixed prop="unit" label="Đơn vị" width="80" />
    <el-table-column fixed prop="actual" label="Thực tế" />
    <el-table-column fixed prop="progress" label="Tiến độ" />

    <el-table-column
        v-for="date in dateColumns"
        :key="date"
        :label="date"
        width="90"
    >
      <template #default="{ row }">
        <span>{{ row.dates?.[date] ?? 0 }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  listLogsByTask: {
    type: Object,
    default: () => ({ resources: [], workAmount: [] })
  },
  task: {
    type: Object,
    default: () => ({})
  }
});

const resourceTypeNames = {
  1: 'Lao động',
  2: 'Máy móc',
  3: 'Vật liệu'
};

const sortDateKeys = (dateObj) => {
  return Object.fromEntries(
      Object.entries(dateObj).sort(([a], [b]) => {
        const [dayA, monthA] = a.split('/').map(Number);
        const [dayB, monthB] = b.split('/').map(Number);
        return monthA === monthB ? dayA - dayB : monthA - monthB;
      })
  );
};

const generateTaskStats = computed(() => {
  const taskPlanDetails = props.task;

  const resources = props.listLogsByTask.resources || [];
  const workAmounts = props.listLogsByTask.workAmount || [];

  const allDatesSet = new Set();

  const workDates = {};
  let totalActualWork = 0;

  // Work Amount Processing
  workAmounts.forEach(w => {
    const date = dayjs(w.logDate).format('DD/MM');
    allDatesSet.add(date);
    workDates[date] = (workDates[date] || 0) + w.workAmount;
    totalActualWork += w.workAmount;
  });

  // Resource Processing
  const groupedResources = {};
  const actualByResourceType = {};
  const planByResourceType = {};

  (taskPlanDetails.details || []).forEach(detail => {
    const type = detail.resource?.type;
    if (type != null) {
      planByResourceType[type] = (planByResourceType[type] || 0) + detail.quantity;
    }
  });

  resources.forEach(res => {
    const date = dayjs(res.logDate).format('DD/MM');
    const type = res.resourceType;
    const quantity = res.quantity;

    allDatesSet.add(date);

    if (!groupedResources[type]) groupedResources[type] = {};
    if (!groupedResources[type][date]) groupedResources[type][date] = 0;
    groupedResources[type][date] += quantity;

    actualByResourceType[type] = (actualByResourceType[type] || 0) + quantity;
  });

  const children = Object.entries(groupedResources).map(([type, dateMap], index) => {
    const actual = actualByResourceType[type] || 0;
    const plan = planByResourceType[type] || 0;
    const progress = plan > 0 ? Math.round((actual / plan) * 100) : 0;
    const unit = (taskPlanDetails.details || []).find(d => d.resource?.type === +type)?.unit || '';

    return {
      id: index + 2,
      name: resourceTypeNames[type] || `Loại tài nguyên ${type}`,
      plan,
      actual,
      progress: progress + '%',
      unit,
      dates: sortDateKeys(dateMap)
    };
  });

  const taskPlanQuantity = taskPlanDetails.quantity || 0;
  const taskProgress = taskPlanQuantity > 0 ? Math.round((totalActualWork / taskPlanQuantity) * 100) : 0;

  const mainTask = {
    id: 1,
    name: 'Khối lượng công việc',
    plan: taskPlanQuantity,
    actual: totalActualWork,
    unit: taskPlanDetails.unit || '',
    progress: taskProgress + '%',
    dates: sortDateKeys(workDates),
    children
  };

  return [mainTask];
});

const dateColumns = computed(() => {
  const mainTask = generateTaskStats.value?.[0];
  const dateSet = new Set();

  if (mainTask?.children) {
    mainTask.children.forEach(child => {
      if (child.dates) {
        Object.keys(child.dates).forEach(date => dateSet.add(date));
      }
    });
  }

  // Convert Set to sorted array (optional)
  return Array.from(dateSet).sort((a, b) => {
    const [dayA, monthA] = a.split('/').map(Number);
    const [dayB, monthB] = b.split('/').map(Number);
    return monthA === monthB ? dayA - dayB : monthA - monthB;
  });
});

</script>

<style scoped>
</style>
