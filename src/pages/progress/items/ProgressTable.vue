<!-- TaskTable.vue -->
<script setup>
import { defineProps } from 'vue';

// Define props to accept external data
const props = defineProps({
  tasks: Array
});
</script>

<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Danh sách công việc</h2>
    <table class="table-auto border-collapse w-full border border-gray-300">
      <thead class="bg-gray-200">
      <tr>
        <th class="border p-2">Mã số</th>
        <th class="border p-2">Công việc</th>
        <th class="border p-2">Người thực hiện</th>
        <th class="border p-2">Thời gian (ngày)</th>
        <th class="border p-2">Bắt đầu kế hoạch</th>
        <th class="border p-2">Kết thúc kế hoạch</th>
        <th class="border p-2">Bắt đầu thực tế</th>
        <th class="border p-2">Kết thúc thực tế</th>
        <th class="border p-2">Tiến độ (%)</th>
        <th class="border p-2">Đơn vị</th>
        <th class="border p-2">Đơn giá</th>
        <th class="border p-2">Khối lượng kế hoạch</th>
        <th class="border p-2">Thành tiền kế hoạch</th>
        <th class="border p-2">Khối lượng thực tế</th>
        <th class="border p-2">Thành tiền thực tế</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="task in props.tasks" :key="task.id">
        <td class="border p-2">{{ task.code }}</td>
        <td class="border p-2">{{ task.name }}</td>
        <td class="border p-2">{{ task.assigned }}</td>
        <td class="border p-2">{{ task.duration }}</td>
        <td class="border p-2">{{ task.plannedStart }}</td>
        <td class="border p-2">{{ task.plannedEnd }}</td>
        <td class="border p-2">{{ task.actualStart }}</td>
        <td class="border p-2">{{ task.actualEnd }}</td>
        <td class="border p-2">{{ task.progress }}%</td>
        <td class="border p-2">{{ task.unit }}</td>
        <td class="border p-2">{{ task.price.toLocaleString() }}</td>
        <td class="border p-2">{{ task.plannedVolume }}</td>
        <td class="border p-2">{{ task.plannedCost.toLocaleString() }}</td>
        <td class="border p-2">{{ task.actualVolume }}</td>
        <td class="border p-2">{{ task.actualCost.toLocaleString() }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
