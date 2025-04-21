<template>
  <el-card shadow="hover" class="task-card">
    <el-form :model="formTask" label-position="top" label-width="auto">
      <el-row :gutter="20" class="task-details">
        <el-col :span="12">
          <el-form-item label="Mã công việc">
            <el-input disabled v-model="formTask.index"/>
          </el-form-item>

          <el-form-item label="Tên công việc">
            <el-input disabled v-model="formTask.workName"/>
          </el-form-item>

          <el-form-item label="Ngày bắt đầu thực tế">
            <el-date-picker style="width: 100%" v-model="formTask.actualStartDate" type="date" placeholder="Chọn ngày"/>
          </el-form-item>

          <el-form-item label="Ngày kết thúc thực tế">
            <el-date-picker style="width: 100%" v-model="formTask.actualEndDate" type="date" placeholder="Chọn ngày"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Ngày bắt đầu kế hoạch">
            <el-date-picker disabled style="width: 100%" v-model="formTask.planStartDate" type="date"
                            placeholder="Chọn ngày"/>
          </el-form-item>

          <el-form-item label="Ngày kết thúc kế hoạch">
            <el-date-picker disabled style="width: 100%" v-model="formTask.planEndDate" type="date"
                            placeholder="Chọn ngày"/>
          </el-form-item>

          <el-form-item label="Trạng thái">
            <el-select v-model="formTask.status" placeholder="Chọn trạng thái">
              <el-option v-for="(label, index) in PROGRESS_STATUS" :label="$t(label)" :key="index"
                         :value="index"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Tiến độ">
            <el-slider v-model="formTask.progress" :step="1" :max="100" show-input/>
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
  }
});

const formTask = reactive({
  index: props.task.index,
  workName: props.task.workName,
  actualStartDate: props.task.actualStartDate,
  actualEndDate: props.task.actualEndDate,
  planStartDate: props.task.planStartDate,
  planEndDate: props.task.planEndDate,
  status: props.task.status,
  progress: props.task.progress
});

watch(() => props.task, (newTask) => {
  Object.assign(formTask, newTask);
}, {deep: true});
</script>

<style scoped>
.task-card {
  padding: 20px;
}

.task-details {
  margin-top: 10px;
}
</style>
