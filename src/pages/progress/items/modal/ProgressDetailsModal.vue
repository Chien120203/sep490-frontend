<template>
  <Modal
      :show="show"
      :width="'100%'"
      :containerHeight="'100%'"
      :isShowFooter="true"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('progress.progress_item_details_title') }}</h4>
    </template>
    <template #body>
      <div>
        <ModalItemInformation :allowEdit="allowEditFields" :rules="progressRules" :allowEditRelation="allowEditRelation" :task="progressDetails"/>
      </div>
      <div style="display: flex">
        <ModalItemProgressDetails :allowEdit="allowEdit" :rules="progressRules" :allowEditRelation="allowEditRelation" :listTasks="progressItems" :task="progressDetails" :listLogsByTask="listLogsByTask" style="width: 100%"/>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <el-button v-if="allowEditFields && (progressDetails.status !== CANCELED || progressDetails.status !== COMPLETED || progressDetails.status !== PAUSED)" type="warning" class="btn" @click="handleSubmit('change-status', PAUSED)">{{ $t('progress.status.paused') }}</el-button>
        <el-button v-if="allowEditFields && (progressDetails.status !== CANCELED || progressDetails.status !== COMPLETED)" type="danger" class="btn" @click="handleSubmit('change-status', CANCELED)">{{ $t('progress.status.canceled') }}</el-button>
        <el-button v-if="allowEditFields && progressDetails.status === PAUSED" type="primary" class="btn btn-save" @click="handleSubmit('change-status', IN_PROGRESS)">{{ $t('progress.status.in_progress') }}</el-button>
        <el-button v-if="allowEditFields" class="btn btn-save" @click="handleSubmit('save')">{{ $t('common.save') }}</el-button>
      </div>
    </template>
  </Modal>
  <ModalConfirm
      style="z-index: 100000000"
      :isShowModal="isShowModalConfirm"
      @close-modal="() => isShowModalConfirm = false"
      @confirmAction="handleConfirm"
      :message="$t('progress.modal_confirm.message')"
      :title="$t('progress.modal_confirm.title')"
  />
</template>

<script setup>
import {ref, defineProps, defineEmits, computed} from "vue";
import {useI18n} from "vue-i18n";
import Modal from "@/components/common/Modal.vue";
import ModalItemInformation from "@/pages/progress/items/modal/items/ModalItemInformation.vue";
import ModalItemProgressDetails from "@/pages/progress/items/modal/items/ModalItemProgressDetails.vue";
import {CANCELED, COMPLETED, DONE_PROGRESS, IN_PROGRESS, PAUSED, STATUS_NOT_START} from "@/constants/progress.js";
import {EXECUTIVE_BOARD, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {getProgressRules} from "@/rules/progress/index.js";
import ModalConfirm from "@/components/common/ModalConfirm.vue";

const {t} = useI18n();
const props = defineProps({
  show: {type: Boolean, default: false},
  progressDetails: {
    type: Object, default: () => {}
  },
  listLogsByTask: {
    type: Array,
    default: () => []
  },
  allowEdit: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  progressItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["close", "submit"]);
const isShowModalConfirm = ref(false);
const itemStatus = ref(null);
const method = ref(null);
const progressRules = getProgressRules();
const allowEditFields = computed(() => (localStorage.getItem('role') === TECHNICAL_MANAGER || localStorage.getItem('role') === EXECUTIVE_BOARD) && props.progressDetails.status != COMPLETED && props.progressDetails.status != CANCELED);
const allowEditRelation = computed(() => {
  const details = props.progressDetails;
  const role = localStorage.getItem("role");
  if (!details || role !== TECHNICAL_MANAGER) return false;

  // No itemRelations: just check own status
  if (!details.itemRelations || Object.keys(details.itemRelations).length === 0) {
    return details.status === STATUS_NOT_START;
  }

  // With itemRelations: check that all related tasks are STATUS_NOT_START
  const relatedTasks = props.progressItems?.filter(task =>
      Object.keys(details.itemRelations).includes(task.index)
  );

  return relatedTasks?.every(task => task.status === STATUS_NOT_START);
});

const handleConfirm = () => {
  isShowModalConfirm.value = false;

  if(method.value === 'change-status') {
    props.progressDetails.status = itemStatus.value;
  }
  emit("submit");

  // Reset the values after emitting
  method.value = null;
  itemStatus.value = null;
};

const handleSubmit = (actionMethod, newStatus = null) => {
  // Set the method and status values
  method.value = actionMethod;
  itemStatus.value = newStatus;

  // Show the confirmation modal
  isShowModalConfirm.value = true;
};
</script>

<style scoped>
.modal-title {
  display: flex;
  margin: 0;
  justify-content: center;
  align-items: center;
}
</style>