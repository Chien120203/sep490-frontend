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
            <el-select
                disabled
                v-model="task.status"
                :placeholder="$t('progress.task_card.status')"
            >
              <el-option
                  v-for="(label, value) in PROGRESS_STATUS"
                  :label="$t(label)"
                  :key="value"
                  :value="value"
              />
            </el-select>
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
import {PROGRESS_STATUS} from "@/constants/progress.js";

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

</script>

<style scoped>
.task-card {
  padding: 20px;
}

.task-details {
  margin-top: 10px;
}
</style>
