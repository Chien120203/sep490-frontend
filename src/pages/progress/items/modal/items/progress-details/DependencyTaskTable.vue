<template>
  <el-table :data="tasks" style="width: 100%" border stripe>
    <!-- Task Name -->
    <el-table-column prop="name" label="Task Name" sortable />

    <!-- Status -->
    <el-table-column prop="status" label="Status">
      <template #default="{ row }">
        <el-tag :type="getStatusTag(row.status)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- Assigned To -->
    <el-table-column prop="assignedTo" label="Assigned To" />

    <!-- Due Date -->
    <el-table-column prop="dueDate" label="Due Date" sortable>
      <template #default="{ row }">
        {{ formatDate(row.dueDate) }}
      </template>
    </el-table-column>

    <!-- Dependency -->
    <el-table-column prop="dependency" label="Depends Type">
      <template #default="{ row }">
        <el-tag v-if="row.dependency">
          {{ $t(getDependencyTask(row.dependency)) }}
        </el-tag>
        <span v-else>—</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {TASK_RELATIONSHIPS} from "@/constants/project.js";

const tasks = ref([
  { name: "Task A", status: "Completed", assignedTo: "John", dueDate: "2025-03-10", dependency: "SS" },
  { name: "Task B", status: "In Progress", assignedTo: "Alice", dueDate: "2025-03-15", dependency: "SF" },
  { name: "Task C", status: "Pending", assignedTo: "Bob", dueDate: "2025-03-20", dependency: "FF" },
  { name: "Task D", status: "Pending", assignedTo: "James", dueDate: "2025-03-21", dependency: "FS" },
]);

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getDependencyTask = (dependency) => {
  return TASK_RELATIONSHIPS.find(task => task.value === dependency)?.label;
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
