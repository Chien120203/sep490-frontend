<template>
  <el-table :data="listTasks" style="width: 100%" border stripe>
    <el-table-column prop="index" label="Index">
      <template #default="{ row }">
        {{ row.index }}
      </template>
    </el-table-column>
    <!-- Task Name -->
    <el-table-column prop="workName" label="Task Name" sortable />

    <!-- Due Date -->
    <el-table-column prop="startDate" label="Start Date" sortable>
      <template #default="{ row }">
        {{ formatDate(row.startDate) }}
      </template>
    </el-table-column>
    <!-- Due Date -->
    <el-table-column prop="endDate" label="Due Date" sortable>
      <template #default="{ row }">
        {{ formatDate(row.endDate) }}
      </template>
    </el-table-column>

    <!-- Dependency -->
    <el-table-column prop="dependency" label="Depends Type">
      <template #default="{ row }">
        <el-select v-model="row.dependency" @change="handleDependencyChange(row)">
          <el-option :label="$t('common.no_dependency')" value=""></el-option>
          <el-option
              v-for="(type, index) in TASK_RELATIONSHIPS"
              :key="index"
              :label="$t(type.label)"
              :value="type.value"
          >
          </el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column label="Actions">
      <template #default="{ row }">
        <div>
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
import {computed} from "vue";

const props = defineProps({
  taskDependency: {
    type: Object,
    default: () => {}
  },
  tasks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits("update-dependency");

// Format date
const formatDate = (date) => {
  if(!date) return '';
  return new Date(date).toLocaleDateString();
};

const getDependencyTask = (dependency) => {
  return TASK_RELATIONSHIPS.find(task => task.value === dependency)?.label ?? "-";
};

const listTasks = computed(() => {
  let taskKeys = Object.keys(props.taskDependency ?? {}); // Get keys from taskDependency

  return props.tasks
      .filter((task) => taskKeys.includes(String(task.index))) // Keep tasks with matching index
      .map((task) => ({
        ...task,
        dependency: props.taskDependency[task.index] // Assign dependency from taskDependency
      }));
});

const handleDependencyChange = (row) => {
  let listUpdatedTasks = props.tasks;
  let result = listUpdatedTasks.map((task) => {
    if (task.index === row.index) {
      return {
        ...task,
        dependency: row.dependency
      };
    }
    if (task.index === props.taskDependency[row.index]) {
      return {
        ...task,
        dependency: "AA"
      };
    }

    return task;
  });
  console.log(result);
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
