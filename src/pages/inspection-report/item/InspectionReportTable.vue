<template>
  <el-table
      :data="data"
      style=""
      class="el-tbl-custom room-tbl"
  >
    <el-table-column
        type="index"
        min-width="53"
        :label="$t('common.no')"
        align="right"
    ></el-table-column>

    <el-table-column min-width="80">
      <template #header>
        <p v-html="$t('inspection.table.header.projectCode')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.projectName ?? "-" }} </span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('inspection.table.header.inspectionCode')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.inspectionName ?? "-" }} </span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="'task name'"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.progressItemName ?? "-" }} </span>
      </template>
    </el-table-column>

    <el-table-column min-width="150">
      <template #header>
        <p v-html="$t('inspection.table.header.inspectorName')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">
          {{ scope.row.inspectorName ? scope.row.inspectorName : "-" }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('inspection.table.header.location')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">
          {{ scope.row.location ? scope.row.location : "-" }}
        </span>
      </template>
    </el-table-column>

    <el-table-column
        min-width="120"
        :label="$t('common.status')"
        align="left"
    >
      <template #default="scope">
        <span class="inspection-status " :class="statusClass(scope.row.status)">{{ $t(getStatus(scope.row.status)) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('customer.table.header.action')"></p>
      </template>
      <template #default="scope">
        <div>
          <button @click="$emit('details', scope.row.id)" class="btn-edit">
            <IconEdit />
          </button>
          <button @click="$emit('delete', scope.row.id)" class="btn-edit">
            <IconTrash />
          </button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {APPROVED_STATUS, REJECTED_STATUS, WAIT_FOR_APPROVE, LIST_INSPECT_STATUSES} from "@/constants/inspection.js";
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";

export default {
  name: "InspectionReportTable",
  components: {
    IconEdit,
    IconTrash,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const statusClass = (status) => {
      switch (status) {
        case REJECTED_STATUS:
          return "inspection-reject";
        case APPROVED_STATUS:
          return "inspection-approved";
        case WAIT_FOR_APPROVE:
          return "inspection-draft";
      }
    };
    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }
    const getStatus = (status) => {
      return LIST_INSPECT_STATUSES[status];
    }
    return {
      statusClass,
      getStatus,
      formatDate
    };
  },
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

.inspection {
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
</style>