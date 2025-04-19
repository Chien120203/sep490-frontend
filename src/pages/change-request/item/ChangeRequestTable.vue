<template>
  <el-table :data="data" style="width: 100%;" class="el-tbl-custom change-request-tbl">
    <el-table-column type="index" :label="$t('change_request.table.header.no')" align="center" min-width="50" />

    <el-table-column min-width="150">
      <template #header>
        <p v-html="$t('change_request.table.header.name')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.name ?? '-' }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="150">
      <template #header>
        <p v-html="$t('change_request.table.header.request_type')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ changeRequestType(scope.row.requestType) ?? '-' }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('change_request.table.header.request_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.requestDate) ?? '-' }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="150">
      <template #header>
        <p v-html="$t('change_request.table.header.creator')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.creator ?? '-' }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('change_request.table.header.status')"></p>
      </template>
      <template #default="scope">
        <span class="change-request-status" :class="statusClass(scope.row.status)">
          {{ $t(formatStatus(scope.row.status)) }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('change_request.table.header.action')"></p>
      </template>
      <template #default="scope">
        <button class="btn-edit" @click="$emit('details', scope.row.id)">
          <IconEdit />
        </button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import IconEdit from "@/svg/IconEdit.vue";
import { mixinMethods } from "@/utils/variables.js";
import { DATE_FORMAT } from "@/constants/application.js";
import {
  CHANGE_REQUEST_TYPE_ADD,
  CR_STATUS_APPROVED,
  CR_STATUS_REJECTED,
  CR_STATUS_WAIT
} from "@/constants/change-request.js";

import { ref } from "vue";
import { useI18n } from "vue-i18n";

// Props
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const { t } = useI18n();

const currentRole = ref(""); // Add this if currentRole is being used externally or will be set later

const changeRequestType = (type) => {
  return type === CHANGE_REQUEST_TYPE_ADD ? t('change_request.type.add_new') : t('change_request.type.update');
}

const formatDate = (inputDate) => {
  return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
}

const statusClass = (status) => {
  if (status == null) return ""; // Ensure status is not null or undefined
  switch (status) {
    case CR_STATUS_REJECTED:
      return "change-request-rejected";
    case CR_STATUS_APPROVED:
      return "change-request-approved";
    case CR_STATUS_WAIT:
      return "change-request-wait";
    default:
      return ""; // Handle unexpected values
  }
}

const formatStatus = (status) => {
  if (status == null) return ""; // Ensure status is not null or undefined
  switch (status) {
    case CR_STATUS_REJECTED:
      return t('common.reject');
    case CR_STATUS_APPROVED:
      return t('common.approve');
    case CR_STATUS_WAIT:
      return t('common.wait');
  }
};

</script>
<style lang="scss" scoped>
.list-users-header {
  h3 {
    width: 90%;
    text-align: start;
  }

  div {
    align-items: center;

    svg {
      cursor: pointer;
    }
  }
}

.change-request {
  &-status {
    background: #ccc;
    color: #fff !important;
    font-size: 12px;
    border-radius: 100px;
    display: block;
    padding: 2px 16px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
    width: 80%;
    justify-self: center;
  }
  &-wait {
    background: #ccc;
    color: #9e8b32 !important;
    font-size: 12px;
    border-radius: 100px;
    display: block;
    padding: 2px 16px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
    width: 80%;
    justify-self: center;
  }

  &-approved {
    background: #2b4b7c;
  }

  &-rejected {
    background: #8a1515;
  }

  &-low {
    background: #48225e;
  }

  &-medium {
    background: #2b4b7c;
  }

  &-high {
    background: #da6b34;
  }

  &-type-cate {
    border-radius: 100px;
    display: block;
    padding: 2px 16px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
  }

  &-number {
    font-weight: 700;
  }
}
.label-center {
  text-align: center  ;
}
</style>
