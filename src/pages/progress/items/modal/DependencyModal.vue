<template>
  <Modal
      :show="show"
      :width="'30%'"
      :containerHeight="'30%'"
      :isShowFooter="false"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">Task Dependency</h4>
    </template>
    <template #body>
      <el-form
          ref="ruleFormRef"
          :model="dependencyObj"
          :rules="rules"
          class="form-search-box"
      >
        <div class="item">
          <el-form-item prop="taskId" class="input-container">
            <template #label>
              <span class="label-start">Task</span>
            </template>
            <SingleOptionSelect
                v-model="dependencyObj.taskId"
                :optionKeys="{ id: 'id', value: 'name' }"
                :listData="tasks"
                :isRemote="true"
                class="input-wd-96"
                @remoteSearch="handleSearchTask"
            />
          </el-form-item>
          <el-form-item prop="type" class="input-container">
            <template #label>
              <span class="label-start">Dependency Type</span>
            </template>
            <el-select v-model="dependencyObj.type">
              <el-option
                  v-for="(relation, index) in TASK_RELATIONSHIPS"
                  :key="index"
                  :label="$t(relation.label)"
                  :value="relation.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="modal-footer">
          <el-button class="btn btn-save" @click="handleSubmit">{{ $t("common.save") }}</el-button>
          <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t("common.cancel") }}</el-button>
        </div>
      </el-form>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits} from "vue";
import {useI18n} from "vue-i18n";
import Modal from "@/components/common/Modal.vue";
import ModalItemInformation from "@/pages/progress/items/modal/items/ModalItemInformation.vue";
import ModalItemProgressDetails from "@/pages/progress/items/modal/items/ModalItemProgressDetails.vue";
import {DATE_FORMAT} from "@/constants/application.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {TASK_RELATIONSHIPS} from "@/constants/project.js";

const {t} = useI18n();
const props = defineProps({
  show: {type: Boolean, default: false},
  progressDetails: {
    type: Object, default: () => {
    }
  }
});

const dependencyObj = ref({
  taskId: 0,
  type: ""
});
const rules = ref({});
const tasks = ref([
  { id: 1, name: "Task A", status: "Completed", assignedTo: "John", dueDate: "2025-03-10", dependency: "SS" },
  { id: 2, name: "Task B", status: "Completed", assignedTo: "John", dueDate: "2025-03-10", dependency: "SS" },
]);
const selectedUsers = ref([]);

const emit = defineEmits(["close", "submit"]);


const handleSearchTask = () => {};
const handleSubmit = () => {
  emit("submit", dependencyObj);
};
</script>

<style scoped>
.modal-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.label-start {
  span {
    width: 100%;
  }
  width: 120px;
}
.modal-footer {
  display: flex;
  justify-content: end;
}
</style>