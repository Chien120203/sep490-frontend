<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="true"
      @close="closeModal"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('planning.modal_title') }}</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <TaskInputForm
            ref="childFormRef"
            :rules="rules"
            :allowEdit="allowEdit"
            :tasks="tasks"
            :total="totalAllPrice"
            :selectedRow="selectedRow"
        />
        <el-tabs v-model="activeTab">
          <!-- Công việc phụ thuộc -->
          <el-tab-pane :label="$t('planning.modal.el_pane.depen_work')" name="tasks">
            <DependencyTaskTable
                ref="dependentFormRef"
                :allowEdit="allowEdit"
                :rules="rules"
                :tasks="tasks"
                :selectedRow="selectedRow"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <el-button v-if="allowEdit" class="btn btn-save" @click="handleSubmit">{{ $t('common.save') }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t('common.cancel') }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from "vue";
import Modal from "@/components/common/Modal.vue";
import DependencyTaskTable from "@/pages/change-request/item/modal/items/DependencyTaskTable.vue";
import {useI18n} from "vue-i18n";
import TaskInputForm from "@/pages/change-request/item/modal/items/TaskInputForm.vue";
import {mixinMethods} from "@/utils/variables.js";
import {getProgressRules} from "@/rules/progress/index.js";

const props = defineProps({
  selectedRow: {type: Object, default: () => ({})},
  show: {type: Boolean, default: false},
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
  tasks: {type: Array, default: () => []},
  rules: {
    type: Object,
    default: () => ({})
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "submit", "search"]);
const {t} = useI18n();
const activeTab = ref("tasks");
const dependentFormRef = ref(null);
const childFormRef = ref(null);
const totalAllPrice = ref({
  machine: 0,
  labor: 0,
  material: 0,
  totalPrice: 0,
});
const closeModal = () => {
  activeTab.value = "tasks"
  emit("close");
};

const handleSubmit = async () => {
  const forms = [
    {
      ref: dependentFormRef,
      name: t("planning.form_ref.dependency"),
    },
    {
      ref: childFormRef,
      name: t("planning.form_ref.planning_info"),
    }
  ];

  for (const form of forms) {
    try {
      if (form.ref.value) {
        await form.ref.value.ruleFormRef.validate();
      }
    } catch (error) {
      console.error(`Validation failed for ${form.name}:`, error);
      return;
    }
  }

  console.log(props.selectedRow);

  emit("submit");
};

</script>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-title {
  margin: 0;
}

.modal-body-container {
  min-height: 550px;
}
</style>
