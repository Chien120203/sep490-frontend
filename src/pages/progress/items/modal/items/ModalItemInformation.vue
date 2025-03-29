<template>
  <el-card shadow="hover">
    <div class="task-details">
      <p><strong>Task ID:</strong> {{ task.TaskID }}</p>
      <p><strong>Task Name:</strong> {{ task.TaskName }}</p>
      <p><strong>Start Date:</strong> {{ formatDate(task.StartDate) }}</p>
      <p><strong>End Date:</strong> {{ formatDate(task.EndDate) }}</p>
      <p><strong>Baseline Start Date:</strong> {{ formatDate(task.BaselineStartDate) }}</p>
      <p><strong>Baseline End Date:</strong> {{ formatDate(task.BaselineEndDate) }}</p>
      <p><strong>Duration:</strong> {{ task.Duration }} days</p>
    </div>

    <div class="status-container">
      <el-tag
          :type="statusType"
          class="status-tag"
          @click="editStatus"
      >
        {{ task.status }}
      </el-tag>

      <el-tag
          type="success"
          class="progress-tag"
          @click="editProgress"
      >
        {{ task.progress }}%
      </el-tag>
    </div>

    <el-dialog v-model="statusDialog" title="Chỉnh sửa trạng thái">
      <el-select v-model="newStatus" placeholder="Chọn trạng thái">
        <el-option label="Hoàn thành" value="Hoàn thành" />
        <el-option label="Đang thực hiện" value="Đang thực hiện" />
        <el-option label="Chưa bắt đầu" value="Chưa bắt đầu" />
      </el-select>
      <template #footer>
        <el-button @click="statusDialog = false">Hủy</el-button>
        <el-button type="primary" @click="saveStatus">Lưu</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="progressDialog" title="Chỉnh sửa tiến độ">
      <el-input-number v-model="newProgress" :min="0" :max="100" />
      <template #footer>
        <el-button @click="progressDialog = false">Hủy</el-button>
        <el-button type="primary" @click="saveProgress">Lưu</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import {ref, computed, defineProps, defineEmits, watch} from "vue";

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

// Dialog states
const statusDialog = ref(false);
const progressDialog = ref(false);

const statusType = computed(() => {
  if (newStatus.value === "Hoàn thành") return "success";
  if (newStatus.value === "Đang thực hiện") return "warning";
  return "danger";
});

// Format date function
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN");
};

const editStatus = () => {
  statusDialog.value = true;
};

const saveStatus = () => {
  statusDialog.value = false;
  emit("updateStatus", newStatus.value);
};

const editProgress = () => {
  progressDialog.value = true;
};

const saveProgress = () => {
  progressDialog.value = false;
  emit("updateProgress", newProgress.value);
};

// Watch for prop changes (useful if task data updates externally)
watch(() => props.task, (newTask) => {
  newStatus.value = newTask.status;
  newProgress.value = newTask.progress;
}, {deep: true});
</script>

<style scoped>
.task-details {
  margin-bottom: 15px;
}

.status-container {
  display: flex;
  gap: 10px;
}

.status-tag, .progress-tag {
  cursor: pointer;
}
</style>
