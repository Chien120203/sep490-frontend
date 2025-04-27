<template>
  <Modal
      :show="show"
      :width="'60%'"
      :containerHeight="'50%'"
      :isShowFooter="false"
      @close="closeModal"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('construct_log.modal_title') }}</h4>
    </template>

    <template #body>
      <el-table
          :data="data"
          style="width: 100%; height: 95%"
          class="el-tbl-custom room-tbl"
      >
        <!-- No (Index) Column -->
        <el-table-column
            type="index"
            min-width="53"
            :label="$t('common.no')"
            align="right"
        ></el-table-column>

        <!-- Log Code Column -->
        <el-table-column
            min-width="150"
            :label="$t('construct_log.log_code')"
            align="left"
        >
          <template #default="scope">
            <div>{{ scope.row.logCode }}</div>
          </template>
        </el-table-column>

        <!-- Log Name Column -->
        <el-table-column
            min-width="120"
            :label="$t('construct_log.log_name')"
            align="left"
        >
          <template #default="scope">
            <div>{{ scope.row.logName }}</div>
          </template>
        </el-table-column>

        <el-table-column min-width="120">
          <template #header>
            <p v-html="$t('planning.table.header.date')"></p>
          </template>
          <template #default="scope">
            <span class="data-table">{{ formatDate(scope.row.logDate) }}</span>
          </template>
        </el-table-column>

        <!-- Status Column -->
        <el-table-column
            min-width="120"
            :label="$t('common.status')"
            align="left"
        >
          <template #default="scope">
            <span class="log-status"  :class="statusClass(getStatus(scope.row))">{{ $t(getStatus(scope.row.status)) }}</span>
          </template>
        </el-table-column>

        <!-- Action Column -->
        <el-table-column min-width="90">
          <template #header>
            <p v-html="$t('common.action')"></p>
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
import {defineProps, defineEmits} from "vue";
import Modal from "@/components/common/Modal.vue";
import {useI18n} from "vue-i18n";
import IconEdit from "@/svg/IconEdit.vue";
import {APPROVED_STATUS, LIST_LOG_STATUSES, REJECTED_STATUS, WAIT_FOR_APPROVE} from "@/constants/construct-log.js";
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";

const props = defineProps({
  show: {type: Boolean, default: false},
  data: {type: Array, default: () => []},
});

const emit = defineEmits(["details"]);
const closeModal = () => {
  emit("close");
}
const {t} = useI18n();
const getStatus = (status) => {
  return LIST_LOG_STATUSES[status];
}
const statusClass = (status) => {
  switch (status) {
    case REJECTED_STATUS:
      return "status-reject";
    case APPROVED_STATUS:
      return "status-approved";
    case WAIT_FOR_APPROVE:
      return "status-draft";
  }
};
const formatDate = (inputDate) => {
  return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
}

</script>

<style scoped lang="scss">
.log {
  &-status {
    background: #ccc;
    color: #fff !important;
    font-size: 12px;
    border-radius: 100px;
    display: block;
    padding: 2px 12px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
  }

  &-draft {
    background: #858080;
  }

  &-approved {
    background: #3e8e22;
  }

  &-reject {
    background: #cc3535;
  }
}

.modal-title {
  margin: 0;
}
</style>
