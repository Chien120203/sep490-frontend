<template>
  <el-table :data="tasks" style="width: 100%" border stripe>
    <!-- Task Name -->
    <el-table-column prop="name" label="Task Name" sortable width="200" />

    <!-- Status -->
    <el-table-column prop="status" label="Status" width="150">
      <template #default="{ row }">
        <el-tag :type="getStatusTag(row.status)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- Assigned To -->
    <el-table-column prop="assignedTo" label="Assigned To" width="180" />

    <!-- Due Date -->
    <el-table-column prop="dueDate" label="Due Date" sortable width="150">
      <template #default="{ row }">
        {{ formatDate(row.dueDate) }}
      </template>
    </el-table-column>

    <!-- Dependency -->
    <el-table-column prop="dependency" label="Depends On" width="200">
      <template #default="{ row }">
        <el-tag v-if="row.dependency">
          {{ row.dependency }}
        </el-tag>
        <span v-else>—</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

const tasks = ref([
  { name: "Task A", status: "Completed", assignedTo: "John", dueDate: "2025-03-10", dependency: null },
  { name: "Task B", status: "In Progress", assignedTo: "Alice", dueDate: "2025-03-15", dependency: "Task A" },
  { name: "Task C", status: "Pending", assignedTo: "Bob", dueDate: "2025-03-20", dependency: "Task B" },
]);

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

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
