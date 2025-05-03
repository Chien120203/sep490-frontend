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
        <el-button v-if="allowEditFields" class="btn btn-save" @click="handleSubmit">{{ $t('common.save') }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t('common.cancel') }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed} from "vue";
import {useI18n} from "vue-i18n";
import Modal from "@/components/common/Modal.vue";
import ModalItemInformation from "@/pages/progress/items/modal/items/ModalItemInformation.vue";
import ModalItemProgressDetails from "@/pages/progress/items/modal/items/ModalItemProgressDetails.vue";
import {CANCELED, COMPLETED, DONE_PROGRESS, STATUS_NOT_START} from "@/constants/progress.js";
import {EXECUTIVE_BOARD, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {getProgressRules} from "@/rules/progress/index.js";

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


const handleSubmit = () => {
  emit("submit");
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