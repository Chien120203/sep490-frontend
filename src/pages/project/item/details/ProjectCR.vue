<template>
  <el-table
      :data="data"
      max-height="400"
      style="width: 100%"
      class="el-tbl-custom change-request-tbl"
  >
    <el-table-column type="index" min-width="53" :label="$t('common.no')" align="right"></el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.details.change_request_table.header.request_code')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.request_code }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.details.change_request_table.header.request_name')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.request_name }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="160">
      <template #header>
        <p v-html="$t('project.details.change_request_table.header.requested_by')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.requested_by }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="140">
      <template #header>
        <p v-html="$t('project.details.change_request_table.header.change_type')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.change_type }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.details.change_request_table.header.status')"></p>
      </template>
      <template #default="scope">
        <span :class="['change-request-status', statusClass(scope.row.status)]">
          {{ scope.row.status }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.details.change_request_table.header.request_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.request_date) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('project.details.change_request_table.action')"></p>
      </template>
      <template #default="scope">
        <div>
          <button @click="$emit('details', scope.row.id)" class="btn-edit">
            <IconEdit />
          </button>
          <button @click="$emit('delete', scope.row.id)" class="btn-delete">
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
import { mixinMethods } from "@/utils/variables.js";
import { DATE_FORMAT } from "@/constants/application.js";

export default {
  components: {
    IconEdit,
    IconTrash,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  setup() {
    const statusClass = (status) => {
      switch (status.toLowerCase()) {
        case "pending":
          return "request-pending";
        case "approved":
          return "request-approved";
        case "rejected":
          return "request-rejected";
        case "under review":
          return "request-review";
        default:
          return "request-closed";
      }
    };

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    };

    return {
      statusClass,
      formatDate,
    };
  },
};
</script>

<style lang="scss">
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
  }

  &-pending {
    background: #ff9800;
  }

  &-approved {
    background: #4caf50;
  }

  &-rejected {
    background: #f44336;
  }

  &-review {
    background: #2196f3;
  }
}

.text-color {
  color: #212529;
}

.data-table {
  word-break: break-word;
}
</style>
