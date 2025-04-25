<template>
  <div class="price-input-form">
    <el-form
        label-width="40%"
        :rules="ALLOCATIONFORMINFO_RULES"
        :model="data"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Request Code">
            <el-input disabled v-model="data.requestCode" class="custom-input" />
          </el-form-item>
          <el-form-item label="Request Name">
            <el-input v-model="data.requestName" class="custom-input" />
          </el-form-item>

          <!-- Allocation type radio buttons -->
          <el-form-item label="Request Type" required>
            <el-select v-model="data.requestType">
              <el-option
                  v-for="request in ALLOCATION_REQUEST_TYPES"
                  :key="request.value"
                  :label="$t(request.label)"
                  :value="request.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- Target project/task selector -->
          <el-form-item v-if="data.requestType === PROJECT_TO_PROJECT" label="Target Project">
            <div class="select-project-container">
              <SingleOptionSelect
                  v-model="data.toProjectId"
                  :optionKeys="{ id: 'id', value: 'projectCode' }"
                  :listData="listOngoingProjects"
                  :isRemote="true"
                  @remoteSearch="handleSearchProject"
                  :showClearable="true"
              />
            </div>
          </el-form-item>

          <!-- Target project/task selector -->
          <el-form-item v-if="data.requestType === PROJECT_TO_TASK" label="Target Task">
            <div class="select-project-container">
              <SingleOptionSelect
                  v-model="data.toTaskId"
                  :optionKeys="{ id: 'index', value: 'workName' }"
                  :listData="progressDetails.progressItems"
                  :isRemote="true"
                  @remoteSearch="handleSearchTask"
                  :showClearable="true"
              />
            </div>
          </el-form-item>

          <!-- Target project/task selector -->
          <el-form-item v-if="data.requestType === TASK_TO_TASK" label="From Task">
            <div class="select-project-container">
              <SingleOptionSelect
                  v-model="data.fromTask"
                  :optionKeys="{ id: 'index', value: 'workName' }"
                  :listData="progressDetails.progressItems"
                  :isRemote="true"
                  @remoteSearch="handleSearchTask"
                  :showClearable="true"
              />
            </div>
          </el-form-item>

          <!-- Target project/task selector -->
          <el-form-item v-if="data.requestType === TASK_TO_TASK" label="To Task">
            <div class="select-project-container">
              <SingleOptionSelect
                  v-model="data.toTask"
                  :optionKeys="{ id: 'index', value: 'workName' }"
                  :listData="progressDetails.progressItems.filter(task => task.index !== data.fromTask)"
                  :isRemote="true"
                  @remoteSearch="handleSearchTask"
                  :showClearable="true"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Request Date" prop="requestDate">
            <el-date-picker
                style="width: 96%"
                disabled
                :value-format="DATE_FORMAT"
                v-model="data.requestDate"
                placeholder="Select Date"
                class="input-wd-96"
            />
          </el-form-item>

          <el-form-item label="Priority">
            <el-select v-model="data.priorityLevel">
              <el-option
                  v-for="(status, index) in PRIORITIES"
                  :key="index"
                  :label="status"
                  :value="index"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Description">
            <el-input
                v-model="data.description"
                type="textarea"
                class="custom-input"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import {computed, defineProps} from "vue";
import { PRIORITIES} from "@/constants/mobilization.js";
import { DATE_FORMAT } from "@/constants/application.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import { getAllocationRules } from "@/rules/allocation";
import {ALLOCATION_REQUEST_TYPES, PROJECT_TO_PROJECT, PROJECT_TO_TASK, TASK_TO_TASK} from "@/constants/allocation.js";
import {IN_PROGRESS_STATUS} from "@/constants/project.js";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  listProjects: { type: Array, default: () => [] },
  progressDetails: { type: Object, default: () => ({}) },
});

const listOngoingProjects = computed(() => props.listProjects.filter(item => item.status === IN_PROGRESS_STATUS));

const emit = defineEmits(["searchProject",  "searchTask"]);
const ALLOCATIONFORMINFO_RULES = getAllocationRules();

// Search remote project/task
const handleSearchProject = (keyword) => {
  emit("searchProject", keyword);
};

const handleSearchTask = (keyword) => {
  emit("searchTask", keyword);
}
</script>

<style scoped>
.price-input-form {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}

.select-project-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 5px;
}

.el-radio-group {
  gap: 5px;
  flex-wrap: nowrap;
}

.custom-input {
  width: 80%;
}

:deep(.el-form-item__label) {
  width: 20% !important;
}

:deep(.el-form-item__content) {
  margin-left: 0% !important;
}
</style>
