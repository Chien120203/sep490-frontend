<template>
  <div class="price-input-form">
    <el-form
        ref="ruleFormRef"
        label-width="40%"
        :rules="ALLOCATIONFORMINFO_RULES"
        :model="data"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="requestCode" :label="$t('mobilization.modal.code')">
            <el-input disabled v-model="data.requestCode" class="custom-input" />
          </el-form-item>
          <el-form-item :label="$t('mobilization.modal.name')">
            <el-input :disabled="!allowEdit" v-model="data.requestName" class="custom-input" />
          </el-form-item>

          <!-- Allocation type radio buttons -->
          <el-form-item prop="requestType" :label="$t('mobilization.modal.type')" required>
            <el-select class="custom-input" :disabled="!allowEdit" v-model="data.requestType">
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
          <el-form-item prop="toProjectId" v-if="data.requestType === PROJECT_TO_PROJECT" :label="$t('allocation.target_project')">
            <div class="select-project-container custom-input">
              <SingleOptionSelect
                  :isDisabled="!allowEdit"
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
          <el-form-item prop="toTaskId" v-if="data.requestType === PROJECT_TO_TASK" :label="$t('allocation.target_task')">
            <div class="select-project-container custom-input">
              <SingleOptionSelect
                  v-model="data.toTaskId"
                  :isDisabled="!allowEdit"
                  :optionKeys="{ id: 'id', value: 'workName' }"
                  :listData="listProgressItems"
                  :isRemote="true"
                  @remoteSearch="handleSearchTask"
                  :showClearable="true"
              />
            </div>
          </el-form-item>

          <!-- Target project/task selector -->
          <el-form-item prop="fromTaskId" v-if="data.requestType === TASK_TO_TASK" :label="$t('allocation.from_task')">
            <div class="select-project-container custom-input">
              <SingleOptionSelect
                  v-model="data.fromTaskId"
                  :isDisabled="!allowEdit"
                  :optionKeys="{ id: 'id', value: 'workName' }"
                  :listData="listProgressItems"
                  :isRemote="true"
                  @remoteSearch="handleSearchTask"
                  :showClearable="true"
              />
            </div>
          </el-form-item>

          <!-- Target project/task selector -->
          <el-form-item prop="toTaskId"  v-if="data.requestType === TASK_TO_TASK && data.fromTaskId" :label="$t('allocation.to_task')">
            <div class="select-project-container custom-input">
              <SingleOptionSelect
                  v-model="data.toTaskId"
                  :isDisabled="!allowEdit"
                  :optionKeys="{ id: 'id', value: 'workName' }"
                  :listData="listProgressItems.filter(task => task.id !== data.fromTaskId)"
                  :isRemote="true"
                  @remoteSearch="handleSearchTask"
                  :showClearable="true"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('mobilization.modal.date')" prop="requestDate">
            <el-date-picker
                style="width: 80%"
                disabled
                :value-format="DATE_FORMAT"
                v-model="data.requestDate"
                placeholder="Select Date"
                class="input-wd-96"
            />
          </el-form-item>

          <el-form-item prop="priorityLevel" :label="$t('mobilization.modal.priority')">
            <el-select class="custom-input" :disabled="!allowEdit" v-model="data.priorityLevel">
              <el-option
                  v-for="(status, index) in PRIORITIES"
                  :key="index"
                  :label="$t(status)"
                  :value="index"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="description" :label="$t('mobilization.modal.description')">
            <el-input
                :disabled="!allowEdit"
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
import {computed, defineProps, ref} from "vue";
import { PRIORITIES} from "@/constants/mobilization.js";
import { DATE_FORMAT } from "@/constants/application.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import { getAllocationRules } from "@/rules/allocation";
import {ALLOCATION_REQUEST_TYPES, PROJECT_TO_PROJECT, PROJECT_TO_TASK, TASK_TO_TASK} from "@/constants/allocation.js";
import {IN_PROGRESS_STATUS} from "@/constants/project.js";
import {DONE_PROGRESS} from "@/constants/progress.js";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  allowEdit: { type: Boolean, default: false },
  listProjects: { type: Array, default: () => [] },
  progressDetails: { type: Object, default: () => ({}) },
});

const listOngoingProjects = computed(() => props.listProjects.filter(item => item.status === IN_PROGRESS_STATUS));
const hasChildren = (parent) => props.progressDetails.progressItems.some(child => child.parentIndex === parent.index);

const listProgressItems = computed(() => props.progressDetails.progressItems?.filter(item => !hasChildren(item) && item.progress !== DONE_PROGRESS)) || [];
const emit = defineEmits(["searchProject",  "searchTask"]);
const ALLOCATIONFORMINFO_RULES = getAllocationRules();

// Search remote project/task
const handleSearchProject = (keyword) => {
  emit("searchProject", keyword);
};

const ruleFormRef = ref(null);
defineExpose({ ruleFormRef });

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
