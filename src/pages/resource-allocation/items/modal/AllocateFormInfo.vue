<template>
  <div class="price-input-form">
    <el-form 
      label-width="40%"
      :rules="ALLOCATIONFORMINFO_RULES"
      :model="data">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Request Code">
            <el-input v-model="data.requestCode" class="custom-input" />
          </el-form-item>
          <el-form-item label="Request Name">
            <el-input v-model="data.requestName" class="custom-input" />
          </el-form-item>
          <el-form-item>
            <div class="select-project-container">
              <el-radio-group v-model="requestType">
                <el-radio-button label="From Current Project" value="from" />
                <el-radio-button label="To Current Project" value="to" />
              </el-radio-group>
              <SingleOptionSelect
                  v-model="projectSelected"
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
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Description">
            <el-input v-model="data.description" type="textarea" class="custom-input" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import {computed, defineProps, ref} from "vue";
import {PRIORITIES, STATUSES} from "@/constants/mobilization.js";
import {DATE_FORMAT} from "@/constants/application.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {usePersistenceStore} from "@/store/persistence.js";
import { getAllocationRules } from "@/rules/allocation";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  listProjects: {
    type: Array,
    default: () => []
  },
});

const persist = usePersistenceStore();
const {
  projectId
} = persist;

const requestType = ref("from");
const projectSelected = ref(null);

projectSelected.value = requestType.value === "from" ? props.data.fromProjectId : props.data.toProjectId;


const ALLOCATIONFORMINFO_RULES = getAllocationRules();

const handleSearchProject = (value) => {
  emit("searchProject", value);
};
const handleSelectItem = (value) => {
  if(requestType.value === "from") {
    props.data.fromProjectId = projectId.value;
    props.data.toProjectId = value;
  }
  if(requestType.value === "to") {
    props.data.fromProjectId = value;
    props.data.toProjectId = projectId.value;
  }
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
  width: 80%; /* Input takes 70% width */
}

:deep(.el-form-item__label) {
  width: 20% !important; /* Label takes 30% width */
}

:deep(.el-form-item__content) {
  margin-left: 0% !important;
}
</style>
