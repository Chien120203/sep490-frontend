<template>
  <Modal
      :show="show"
      :width="'60%'"
      :containerHeight="'50%'"
      :isShowFooter="false"
      @close="closeModal"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('planning.modal_title') }}</h4>
    </template>

    <template #body>
      <el-table
          :data="data"
          style="width: 100%; height: 95%"
          class="el-tbl-custom room-tbl"
      >
        <el-table-column
            type="index"
            min-width="53"
            :label="$t('common.no')"
            align="right"
        ></el-table-column>
        <el-table-column
            type="index"
            min-width="53"
            :label="$t('common.no')"
            align="right"
        ><template #default="scope">
          <div>
           {{scope.row.logName}}
          </div>
        </template></el-table-column>
        <el-table-column min-width="90">
          <template #header>
            <p v-html="$t('customer.table.header.action')"></p>
          </template>
          <template #default="scope">
            <div>
              <button @click="$emit('details', scope.row.id)" class="btn-edit">
                <IconEdit />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed, reactive, watch, toRaw} from "vue";
import Modal from "@/components/common/Modal.vue";
import PriceInputForm from "@/pages/planning/item/modal/items/PriceInputForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";
import DependencyTaskTable from "@/pages/planning/item/modal/items/DependencyTaskTable.vue";
import {
  HUMAN_TYPE,
  MACHINE_TYPE,
  MATERIAL_TYPE
} from "@/constants/resource.js";
import {mixinMethods} from "@/utils/variables.js";
import {useI18n} from "vue-i18n";
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";

const props = defineProps({
  show: {type: Boolean, default: false},
  data: {type: Array, default: () => []},
});

const emit = defineEmits(["details"]);
const closeModal = () => {
  emit("close");
}
const {t} = useI18n();


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
