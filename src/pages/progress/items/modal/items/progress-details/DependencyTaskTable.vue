<template>
  <el-table :data="tasks" style="width: 100%" border stripe>
    <el-table-column prop="index" :label="$t('common.index')">
      <template #default="{ row }">
        {{ row.index }}
      </template>
    </el-table-column>
    <el-table-column prop="workName" :label="$t('progress.table.task_name')" sortable />

    <el-table-column v-if="!isPlanning" prop="status" :label="$t('progress.table.status')">
      <template #default="{ row }">
        <el-tag :type="getStatusTag(row.status.toLowerCase().replace(' ', '_'))">
          {{ $t(`progress.status.${row.status.toLowerCase().replace(' ', '_')}`) }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column v-if="!isPlanning" prop="assignedTo" :label="$t('progress.table.assigned_to')" />

    <el-table-column prop="startDate" :label="$t('progress.table.start_date')" sortable>
      <template #default="{ row }">
        {{ formatDate(row.startDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="endDate" :label="$t('progress.table.due_date')" sortable>
      <template #default="{ row }">
        {{ formatDate(row.endDate) }}
      </template>
    </el-table-column>

    <el-table-column prop="dependency" :label="$t('progress.table.dependency_type')">
      <template #default="{ row }">
        <el-tag v-if="!isPlanning">
          {{ $t(getDependencyTask(row.dependency)) }}
        </el-tag>
        <el-select v-else v-model="row.dependency">
          <el-option :label="$t('common.no_dependency')" value=""></el-option>
          <el-option
              v-for="(type, index) in TASK_RELATIONSHIPS"
              :key="index"
              :label="$t(type.label)"
              :value="type.value"
          />
        </el-select>
      </template>
    </el-table-column>

    <el-table-column :label="$t('common.action')">
      <template #default="{ row }">
        <div>
          <button v-if="!isPlanning" @click="$emit('details', row.id)" class="btn-edit">
            <IconEdit />
          </button>
          <button @click="$emit('delete', row.index)" class="btn-edit">
            <IconTrash />
          </button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import {TASK_RELATIONSHIPS} from "@/constants/project.js";
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  isPlanning: {
    type: Boolean,
    default: false
  },
  tasks: {
    type: Array,
    default: () => []
  }
})

// Format date
const formatDate = (date) => {
  if(!date) return '';
  return new Date(date).toLocaleDateString();
};

const getDependencyTask = (dependency) => {
  return TASK_RELATIONSHIPS.find(task => task.value === dependency)?.label ?? "-";
}

// Get status tag color
const getStatusTag = (status) => {
  switch (status) {
    case "Completed": return "success";
    case "In Progress": return "warning";
    case "Pending": return "danger";
    default: return "";
  }
};
</script>

<style scoped>
/* Custom styling */
</style>
