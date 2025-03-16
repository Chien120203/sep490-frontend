<template>
  <Modal
      :show="show"
      :width="'80%'"
      :height="'70%'"
      :isShowFooter="false"
      @close="$emit('close')"
  >
    <template #header>
      <h4 class="modal-title">Construct Item Details</h4>
    </template>
    <template #body>
      <div class="modal-body">
        <PriceInputForm/>

        <div>
          <div>
            <h4>
              Tài nguyên
            </h4>
          </div>
          <ItemList
              :listData="materials"
              :optionKeys="materialOptions"
          />
        </div>

        <div>
          <div>
            <h4>
              Nhân lực
            </h4>
          </div>
          <ItemList
              :listData="users"
              :optionKeys="userOptions"
          />
        </div>

        <div>
          <div>
            <h4>
              Phương tiện
            </h4>
          </div>
          <ItemList
              :listData="vehicles"
              :optionKeys="vehicleOptions"
          />
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
import PriceInputForm from "@/pages/planning/item/modal/items/PriceInputForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";

const {t} = useI18n();

const props = defineProps({
  show: {type: Boolean, default: false},
  materials: {type: Array, default: () => []},
  users: {type: Array, default: () => []},
  vehicles: {type: Array, default: () => []},
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