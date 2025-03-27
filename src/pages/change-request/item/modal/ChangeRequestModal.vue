<template>
  <Modal
      :show="show"
      :width="'50%'"
      :containerHeight="'50%'"
      :isShowFooter="false"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">Change Request Modal</h4>
    </template>
    <template #body>
      <div class="modal-body">

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
import PriceInputForm from "@/pages/planning/item/modal/items/PriceInputForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";

const {t} = useI18n();

const props = defineProps({
  show: {type: Boolean, default: false},
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