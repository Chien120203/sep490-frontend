<template>
  <el-table
      :data="generateTaskStats"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
  >
    <el-table-column fixed prop="name" :label="t('progress.table.task')" width="250" />
    <el-table-column fixed prop="plan" :label="t('progress.table.plan')" />
    <el-table-column fixed prop="unit" :label="t('progress.table.unit')" width="80" />
    <el-table-column fixed prop="actual" :label="t('progress.table.actual')" />
    <el-table-column fixed prop="progress" :label="t('progress.table.progress')" />

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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
  1: t('progress.resource_types.labor'),
  2: t('progress.resource_types.machine'),
  3: t('progress.resource_types.material')
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
  const groupedResourcesByTypeAndId = {};
  const actualByResourceType = {};
  const planByResourceType = {};
  const resourceMap = {};

  // Create a resource map for faster lookup
  (taskPlanDetails.details || []).forEach(detail => {
    if (detail.resource) {
      resourceMap[detail.resourceId] = detail.resource;
    }

    const type = detail.resource?.type;
    if (type != null) {
      planByResourceType[type] = (planByResourceType[type] || 0) + detail.quantity;
    }
  });

  resources.forEach(res => {
    const date = dayjs(res.logDate).format('DD/MM');
    const type = res.resourceType;
    const resourceId = res.resourceId;
    const quantity = res.quantity;

    allDatesSet.add(date);

    // Group by resource type
    if (!groupedResources[type]) groupedResources[type] = {};
    if (!groupedResources[type][date]) groupedResources[type][date] = 0;
    groupedResources[type][date] += quantity;

    // Group by resource type AND ID for individual resources
    const resourceKey = `${type}-${resourceId}`;
    if (!groupedResourcesByTypeAndId[resourceKey]) groupedResourcesByTypeAndId[resourceKey] = {};
    if (!groupedResourcesByTypeAndId[resourceKey][date]) groupedResourcesByTypeAndId[resourceKey][date] = 0;
    groupedResourcesByTypeAndId[resourceKey][date] += quantity;

    actualByResourceType[type] = (actualByResourceType[type] || 0) + quantity;
  });

  // Process resource types (Labor, Machine, Material)
  const typeChildren = [];
  let nextId = 2; // Starting ID for resource types

  Object.entries(groupedResources).forEach(([type, dateMap]) => {
    const actual = actualByResourceType[type] || 0;
    const plan = planByResourceType[type] || 0;
    const progress = plan > 0 ? Math.round((actual / plan) * 100) : 0;
    const unit = (taskPlanDetails.details || []).find(d => d.resource?.type === +type)?.unit || '';

    // Find all resources of this type from task details
    const typeResources = (taskPlanDetails.details || []).filter(d => d.resource?.type === +type);

    // Create children for individual resources
    const resourceChildren = [];

    // Create a map of resource usage by resource ID
    const resourceUsageByResourceId = {};
    resources.forEach(res => {
      if (res.resourceType === +type) {
        if (!resourceUsageByResourceId[res.resourceId]) {
          resourceUsageByResourceId[res.resourceId] = 0;
        }
        resourceUsageByResourceId[res.resourceId] += res.quantity;
      }
    });

    // Add all resources from task details (even if they don't have usage logs)
    typeResources.forEach(resource => {
      const resourceId = resource.resourceId;
      const resourceKey = `${type}-${resourceId}`;
      const resourceName = resource.resource?.name || `Resource ${resourceId}`;
      const resourceUnit = resource.unit || '';
      const resourcePlan = resource.quantity || 0;
      const resourceActual = resourceUsageByResourceId[resourceId] || 0;
      const resourceProgress = resourcePlan > 0 ? Math.round((resourceActual / resourcePlan) * 100) : 0;

      resourceChildren.push({
        id: nextId++,
        name: resourceName,
        plan: resourcePlan,
        actual: resourceActual,
        progress: resourceProgress + '%',
        unit: resourceUnit,
        dates: groupedResourcesByTypeAndId[resourceKey] ? sortDateKeys(groupedResourcesByTypeAndId[resourceKey]) : {}
      });
    });

    // Add resource type row with children
    typeChildren.push({
      id: nextId++,
      name: resourceTypeNames[type] || `Loại tài nguyên ${type}`,
      plan,
      actual,
      progress: progress + '%',
      unit,
      dates: sortDateKeys(dateMap),
      children: resourceChildren
    });
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
    children: typeChildren
  };

  return [mainTask];
});

const dateColumns = computed(() => {
  const mainTask = generateTaskStats.value?.[0];
  const dateSet = new Set();

  // Process all dates from main task
  if (mainTask?.dates) {
    Object.keys(mainTask.dates).forEach(date => dateSet.add(date));
  }

  // Process all dates from resource types
  if (mainTask?.children) {
    mainTask.children.forEach(child => {
      if (child.dates) {
        Object.keys(child.dates).forEach(date => dateSet.add(date));
      }

      // Process all dates from individual resources
      if (child.children) {
        child.children.forEach(resourceChild => {
          if (resourceChild.dates) {
            Object.keys(resourceChild.dates).forEach(date => dateSet.add(date));
          }
        });
      }
    });
  }

  // Convert Set to sorted array
  return Array.from(dateSet).sort((a, b) => {
    const [dayA, monthA] = a.split('/').map(Number);
    const [dayB, monthB] = b.split('/').map(Number);
    return monthA === monthB ? dayA - dayB : monthA - monthB;
  });
});
</script>

<style scoped>
</style>