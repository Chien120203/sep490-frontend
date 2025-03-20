<template>
  <Modal
      :show="show"
      :width="'95%'"
      :isShowFooter="false"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">Progress Item Details</h4>
    </template>
    <template #body>
      <div class="modal-body">
        <div>
          <ModalItemInformation :task="progressDetails"/>
        </div>
        <div style="display: flex">
          <ModalItemEmployee style="width: 20%"/>
          <ModalItemProgressDetails style="width: 80%"/>
        </div>
      </div>
      <div class="modal-footer">
        <el-button class="btn btn-save" @click="handleSubmit">{{ $t("common.save") }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t("common.cancel") }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits} from "vue";
import {useI18n} from "vue-i18n";
import Modal from "@/components/common/Modal.vue";
import ModalItemInformation from "@/pages/progress/items/modal/items/ModalItemInformation.vue";
import ModalItemProgressDetails from "@/pages/progress/items/modal/items/ModalItemProgressDetails.vue";
import ModalItemEmployee from "@/pages/progress/items/modal/items/ModalItemEmployee.vue";

const {t} = useI18n();
const props = defineProps({
  show: {type: Boolean, default: false},
  progressDetails: {type: Object, default: () => {}}
});

const materialOptions = {id: 'id', value: 'name'};
const userOptions = {id: 'id', value: 'name'};
const vehicleOptions = {id: 'id', value: 'name'};

const emit = defineEmits(["close", "submit"]);
const selectedUsers = ref([]);

const handleSubmit = () => {
  emit("submit", selectedUsers.value);
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
</style>