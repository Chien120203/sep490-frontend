<template>
  <el-card shadow="hover" class="task-card">
    <el-form :disabled="!allowEdit" :rules="rules" :model="task" label-position="top" label-width="auto">
      <el-row :gutter="20" class="task-details">
        <el-col :span="12">
          <el-form-item label="Mã công việc">
            <el-input disabled v-model="task.index"/>
          </el-form-item>

          <el-form-item label="Tên công việc">
            <el-input disabled v-model="task.workName"/>
          </el-form-item>

          <el-form-item prop="actualStartDate" label="Ngày bắt đầu thực tế">
            <el-date-picker style="width: 100%" v-model="task.actualStartDate" type="date" placeholder="Chọn ngày"/>
          </el-form-item>

          <el-form-item prop="actualEndDate" label="Ngày kết thúc thực tế">
            <el-date-picker style="width: 100%" v-model="task.actualEndDate" type="date" placeholder="Chọn ngày"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="planStartDate" label="Ngày bắt đầu kế hoạch">
            <el-date-picker :disabled="!allowEditRelation" style="width: 100%" v-model="task.planStartDate" type="date"
                            placeholder="Chọn ngày"/>
          </el-form-item>

          <el-form-item prop="planEndDate" label="Ngày kết thúc kế hoạch">
            <el-date-picker :disabled="!allowEditRelation" style="width: 100%" v-model="task.planEndDate" type="date"
                            placeholder="Chọn ngày"/>
          </el-form-item>

          <el-form-item label="Trạng thái">
            <el-select v-model="task.status" placeholder="Chọn trạng thái">
              <el-option v-for="(label, index) in PROGRESS_STATUS" :label="$t(label)" :key="index"
                         :value="index"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Tiến độ">
            <el-slider v-model="task.progress" :step="1" :max="100" show-input/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup>
import {reactive, watch, defineProps} from 'vue';
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
