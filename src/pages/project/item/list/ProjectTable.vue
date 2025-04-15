<template>
  <el-table
      :data="data"
      max-height="400"
      style="width: 100%"
      class="el-tbl-custom project-tbl"
  >
    <el-table-column type="index" min-width="53" :label="$t('common.no')" align="right"></el-table-column>

    <el-table-column min-width="110">
      <template #header>
        <p v-html="$t('project.table.header.code')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.projectCode }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180">
      <template #header>
        <p v-html="$t('project.table.header.name')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.projectName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('project.table.header.customer')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.customer.customerCode ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.table.header.type')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.constructType ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180">
      <template #header>
        <p v-html="$t('project.table.header.location')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.location ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.table.header.budget')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatCurrency(scope.row.budget) ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.table.header.start_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.startDate) ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.table.header.end_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.endDate) ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('project.table.header.status')"></p>
      </template>
      <template #default="scope">
        <span class="project-status" :class="statusClass(scope.row.status)">
          {{ $t(formatStatus(scope.row.status)) }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('project.table.header.action')"></p>
      </template>
      <template #default="scope">
        <div>
          <button @click="$emit('details', scope.row.id)" class="btn-edit">
            <IconEdit />
          </button>
          <button v-if="allowDelete(scope.row.status)" @click="$emit('delete', scope.row.id)" class="btn-delete">
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
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";
import {RECEIVE_STATUS, STATUS_LABELS} from "@/constants/project.js";
import {EXECUTIVE_BOARD} from "@/constants/roles.js";

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
      if (status == null) return ""; // Ensure status is not null or undefined
      switch (status) {
        case 0:
          return "project-receive-planning";
        case 1:
          return "project-planning";
        case 2:
          return "project-in-progress";
        case 3:
          return "project-completed";
        case 4:
          return "project-paused";
        case 5:
          return "project-closed";
        default:
          return ""; // Handle unexpected values
      }
    };

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }

    const allowDelete = (status) => {
      return localStorage.getItem('role') === EXECUTIVE_BOARD && status === RECEIVE_STATUS;
    }
    const formatCurrency = (inputCurrency) => {
      return mixinMethods.formatCurrency(inputCurrency);
    }

    const formatStatus = (status) => {
      return STATUS_LABELS[status] || 'Unknown';
    };

    return {
      statusClass,
      allowDelete,
      formatStatus,
      formatDate,
      formatCurrency
    };
  },
};
</script>

<style lang="scss">
.project {
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

  &-receive-planning {
    background: #1f7885;
  }

  &-planning {
    background: #1f4261;
  }

  &-in-progress {
    background: #28b5b5;
  }

  &-completed {
    background: #3e8e22;
  }

  &-closed {
    background: #dc3545;
  }

  &-paused {
    background: #4c4b4b;
  }
}

.text-color {
  color: #212529;
}

.data-table {
  word-break: break-word;
}
</style>
