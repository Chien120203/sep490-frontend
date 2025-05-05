<template>
  <el-card shadow="hover" class="task-card">
    <el-form :rules="rules" :model="task" label-position="top" label-width="auto">
      <el-row :gutter="20" class="task-details">
        <el-col :span="12">
          <el-form-item :label="$t('progress.task_card.task_code')">
            <el-input disabled v-model="task.index"/>
          </el-form-item>

          <el-form-item :label="$t('progress.task_card.task_name')">
            <el-input disabled v-model="task.workName"/>
          </el-form-item>

          <el-form-item prop="actualStartDate" :label="$t('progress.task_card.actual_start_date')">
            <el-date-picker
                :disabled="!allowEdit"
                style="width: 100%"
                v-model="task.actualStartDate"
                type="date"
                :placeholder="$t('common.select_date')"
            />
          </el-form-item>

          <el-form-item prop="actualEndDate" :label="$t('progress.task_card.actual_end_date')">
            <el-date-picker
                :disabled="!allowEdit"
                style="width: 100%"
                v-model="task.actualEndDate"
                type="date"
                :placeholder="$t('common.select_date')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="planStartDate" :label="$t('progress.task_card.plan_start_date')">
            <el-date-picker
                :disabled="!allowEditRelation"
                style="width: 100%"
                v-model="task.planStartDate"
                type="date"
                :placeholder="$t('common.select_date')"
            />
          </el-form-item>

          <el-form-item prop="planEndDate" :label="$t('progress.task_card.plan_end_date')">
            <el-date-picker
                :disabled="!allowEditRelation"
                style="width: 100%"
                v-model="task.planEndDate"
                type="date"
                :placeholder="$t('common.select_date')"
            />
          </el-form-item>

          <el-form-item :label="$t('progress.task_card.status')">
            <div style="display: flex; align-items: center; width: 40%;">
              <el-tag :color="getStatusColor(task.status)" :style="{ color: getTextColor(task.status), width: '100%' }">
                {{ $t(PROGRESS_STATUS[task.status]) }}
              </el-tag>
              <el-select
                  class="ml-2"
                  disabled
                  v-model="task.status"
                  :placeholder="$t('progress.task_card.status')"
                  style="margin-left: 10px; width: 100%;"
              >
                <el-option
                    v-for="(label, value) in PROGRESS_STATUS"
                    :label="$t(label)"
                    :key="value"
                    :value="value"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('progress.task_card.progress')">
            <el-slider
                :disabled="!allowEdit"
                v-model="task.progress"
                :step="1"
                :max="100"
                show-input
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup>
import {reactive, watch, defineProps, computed} from 'vue';
import {mixinMethods} from '@/utils/variables.js';
import {
  PROGRESS_STATUS,
  STATUS_NOT_START,
  IN_PROGRESS,
  COMPLETED,
  CANCELED,
  PAUSED,
  WAIT_FOR_INSPECT,
  INSPECT_FAILED
} from "@/constants/progress.js";

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  allowEdit: {
    type: Boolean,
    default: false
  },
  allowEditRelation: {
    type: Boolean,
    default: false
  }
});

// Function to get status background color matching queryTaskbarInfo
const getStatusColor = (status) => {
  switch (parseInt(status)) {
    case STATUS_NOT_START: // 0
      return "#A9A9A9"; // Darker Gray
    case IN_PROGRESS: // 1
      return "#87CEFA"; // LightSkyBlue
    case COMPLETED: // 2
      return "#90EE90"; // LightGreen
    case PAUSED: // 3
      return "#FFD700"; // Gold
    case CANCELED: // 4
      return "#FFA07A"; // LightSalmon
    case WAIT_FOR_INSPECT: // 5
      return "#B19CD9"; // Light Purple
    case INSPECT_FAILED: // 6
      return "#FFA07A"; // LightSalmon
    default:
      return "#A9A9A9"; // Default darker gray
  }
};

// Function to determine text color for contrast
const getTextColor = (status) => {
  switch (parseInt(status)) {
    case STATUS_NOT_START: // 0
    case CANCELED: // 4
    case IN_PROGRESS: // 1
      return "#000000"; // Black text for light backgrounds
    case COMPLETED: // 2
    case PAUSED: // 3
    case WAIT_FOR_INSPECT: // 5
    case INSPECT_FAILED: // 6
      return "#000000"; // Black text for light backgrounds
    default:
      return "#000000"; // Default black
  }
};
</script>

<style scoped>
.task-card {
  padding: 20px;
}

.task-details {
  margin-top: 10px;
}
</style>