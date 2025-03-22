<template>
  <el-table :data="tasks" border style="width: 100%" row-key="id" default-expand-all>
    <el-table-column fixed prop="name" label="Công việc" width="250"></el-table-column>
    <el-table-column fixed prop="plan" label="Định mức"></el-table-column>
    <el-table-column fixed prop="actual" label="Thực tế"></el-table-column>
    <el-table-column fixed prop="progress" label="Tiến độ"></el-table-column>
    <el-table-column v-for="date in dateColumns" :key="date" :label="date">
      <template #default="{ row }">
        <span>{{ row.dates[date] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

const dateColumns = computed(() => {
  const allDates = new Set();
  props.tasks.forEach(task => {
    Object.keys(task.dates).forEach(date => allDates.add(date));
    task.children?.forEach(subTask => Object.keys(subTask.dates).forEach(date => allDates.add(date)));
  });
  return [...allDates].sort();
});
</script>

<style scoped>
</style>
