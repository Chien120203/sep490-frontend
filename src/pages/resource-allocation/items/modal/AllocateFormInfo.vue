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
            <el-input v-model="data.requestCode" class="custom-input" />
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
          <el-form-item label="Target">
            <div class="select-project-container">
              <SingleOptionSelect
                  v-model="targetSelected"
                  :optionKeys="{ id: 'id', value: 'projectCode' }"
                  :listData="listProjects"
                  :isRemote="true"
                  @remoteSearch="handleSearchProject"
                  @handleSelectedParams="handleSelectItem"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Request Date" prop="requestDate">
            <el-date-picker
                style="width: 96%"
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
import { defineProps, ref, watch } from "vue";
import {MOBILIZE_REQUEST_TYPES, PRIORITIES} from "@/constants/mobilization.js";
import { DATE_FORMAT } from "@/constants/application.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import { usePersistenceStore } from "@/store/persistence.js";
import { getAllocationRules } from "@/rules/allocation";
import {ALLOCATION_REQUEST_TYPES} from "@/constants/allocation.js";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  listProjects: { type: Array, default: () => [] },
});

const emit = defineEmits(["searchProject"]);

const persist = usePersistenceStore();
const { projectId } = persist;

// Options: 'project-to-project', 'project-to-task', 'task-to-task'
const requestType = ref("project-to-project");
const targetSelected = ref(null);

const ALLOCATIONFORMINFO_RULES = getAllocationRules();

// When selecting a project/task
const handleSelectItem = (value) => {
  if (requestType.value === "project-to-project") {
    props.data.fromProjectId = projectId.value;
    props.data.toProjectId = value;
    props.data.fromTask = null;
    props.data.toTask = null;
  } else if (requestType.value === "project-to-task") {
    props.data.fromProjectId = projectId.value;
    props.data.fromTask = null;
    props.data.toProjectId = projectId.value;
    props.data.toTask = value;
  } else if (requestType.value === "task-to-task") {
    props.data.fromProjectId = projectId.value;
    props.data.toProjectId = projectId.value;
    props.data.fromTask = value[0];
    props.data.toTask = value[1];
  }
};

// Search remote project/task
const handleSearchProject = (keyword) => {
  emit("searchProject", keyword);
};
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
