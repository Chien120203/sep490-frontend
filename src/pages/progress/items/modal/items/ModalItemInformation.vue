<template>
  <el-card shadow="hover" class="task-card">
    <el-row :gutter="20" class="task-details">
      <el-col :span="12">
        <p><strong>Mã công việc:</strong> {{ task.index }}</p>
        <p><strong>Tên công việc:</strong> {{ task.workName }}</p>
        <p><strong>Ngày bắt đầu thực tế:</strong> {{ formatDate(task.actualStartDate) }}</p>
        <p><strong>Ngày kết thúc thực tế:</strong> {{ formatDate(task.actualEndDate) }}</p>
      </el-col>

      <el-col :span="12">
        <p><strong>Ngày bắt đầu kế hoạch:</strong> {{ formatDate(task.planStartDate) }}</p>
        <p><strong>Ngày kết thúc kế hoạch:</strong> {{ formatDate(task.planEndDate) }}</p>

        <div class="status-progress">
          <p><strong>Trạng thái:</strong>
            <el-tag :type="getStatusTagType(task.status)">
              {{ getStatusLabel(task.status) }}
            </el-tag>
          </p>

          <div class="progress-bar">
            <p><strong>Tiến độ:</strong></p>
            <el-progress :percentage="task.progress" :stroke-width="16" show-text/>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {ref, computed, defineProps, defineEmits, watch} from "vue";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["updateStatus", "updateProgress"]);

// Reactive variables for editing
const newStatus = ref(props.task.status);
const newProgress = ref(props.task.progress);

const statusType = computed(() => {
  if (newStatus.value === "Hoàn thành") return "success";
  if (newStatus.value === 1) return "progress";
  if (newStatus.value === "Đang thực hiện") return "warning";
  return "danger";
});

const getStatusLabel = (status) => {
  switch (status) {
    case 0: return "Hoàn thành";
    case 1: return "Đang thực hiện";
    case 2: return "Chưa bắt đầu";
    default: return "Không xác định";
  }
}

const getStatusTagType = (status) => {
  switch (status) {
    case 0: return "success";
    case 1: return "primary";
    case 2: return "warning";
    default: return "";
  }
}

// Format date function
const formatDate = (date) => {
  return mixinMethods.showDateTime(date);
};

// Watch for prop changes (useful if task data updates externally)
watch(() => props.task, (newTask) => {
  newStatus.value = newTask.status;
  newProgress.value = newTask.progress;
}, {deep: true});
</script>

<style scoped>
.task-card {
  padding: 20px;
}

.task-header h3 {
  margin-bottom: 0;
  font-size: 20px;
  font-weight: bold;
}

.task-details p {
  margin: 5px 0;
  font-size: 14px;
}

.status-progress {
  margin-top: 20px;
}

.progress-bar {
  margin-top: 10px;
}
</style>
