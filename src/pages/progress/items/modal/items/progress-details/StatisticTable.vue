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
import { mixinMethods } from '@/utils/variables.js';
import { MONTH_DAY_FORMAT } from '@/constants/application.js';

const props = defineProps({
  listLog: {
    type: Object,
    default: () => ({ resources: [], workAmount: [] })
  },
  taskPlan: {
    type: Object,
    default: () => ({})
  }
});

const resourceTypeNames = {
  1: 'Lao động',
  2: 'Máy móc',
  3: 'Vật liệu'
};

const generateTaskStats = computed(() => {
  const taskPlanDetails = props.taskPlan;
  const listLogsByTask = props.listLog;

  const { resources, workAmount } = listLogsByTask;
  const allDatesSet = new Set();

  const workDates = {};
  let totalActualWork = 0;

  workAmount.forEach(w => {
    const date = mixinMethods.showDateTime(w.logDate, MONTH_DAY_FORMAT);
    allDatesSet.add(date);
    workDates[date] = w.workAmount;
    totalActualWork += w.workAmount;
  });

  const groupedResources = {};
  const actualByResourceType = {};
  const planByResourceType = {};

  (taskPlanDetails.details || []).forEach(detail => {
    planByResourceType[detail.resourceType] = (planByResourceType[detail.resourceType] || 0) + detail.quantity;
  });

  resources.forEach(res => {
    const date = mixinMethods.showDateTime(res.logDate, MONTH_DAY_FORMAT);
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
    const progress = plan > 0 ? Math.round(((actual / plan) * 100), 2) : 0;
    const unit = (taskPlanDetails.details || []).find(d => d.resourceType === +type)?.unit || '';
    return {
      id: index + 2,
      name: resourceTypeNames[type] || `Loại tài nguyên ${type}`,
      plan,
      actual,
      progress: progress + "%",
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
    unit: taskPlanDetails.unit,
    progress: taskProgress + "%",
    dates: sortDateKeys(workDates),
    children
  };

  return [mainTask];
});
const dateColumns = computed(() => {
  const mainTask = generateTaskStats.value?.[0];
  return mainTask?.dates ? Object.keys(mainTask.dates) : [];
});

// Convert Set of dates into sorted array for columns
function sortDateKeys(dateObj) {
  return Object.fromEntries(
      Object.entries(dateObj).sort(([a], [b]) => {
        const [dayA, monthA] = a.split('/').map(Number);
        const [dayB, monthB] = b.split('/').map(Number);
        return monthA === monthB ? dayA - dayB : monthA - monthB;
      })
  );
}

// const listConvertedLog = [
//   {
//     id: 1,
//     name: "Work 1",
//     plan: 10,  // kế hoạch thực hiện
//     actual: 10, // tổng thực tế = 2+3+5
//     progress: "100%", // 10/10
//     dates: {
//       "10/04": 2,
//       "11/04": 3,
//       "12/04": 5
//     },
//     children: [
//       {
//         id: 2,
//         name: "Máy móc",
//         plan: 3, // vì có 3 ngày mỗi ngày dùng 1 máy
//         actual: 3,
//         progress: "100%",
//         dates: {
//           "10/04": 1,
//           "11/04": 1,
//           "12/04": 1
//         }
//       }
//     ]
//   }
// ];

</script>

<style scoped>
</style>
