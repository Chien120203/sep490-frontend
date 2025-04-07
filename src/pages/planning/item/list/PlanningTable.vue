<template>
  <el-table
      :data="data"
      max-height="400"
      style="width: 100%"
      class="el-tbl-custom planning-tbl"
  >
    <el-table-column type="index" min-width="53" :label="$t('common.no')" align="right"></el-table-column>

    <el-table-column min-width="110">
      <template #header>
        <p v-html="$t('planning.table.header.title')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.planName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="110">
      <template #header>
        <p v-html="$t('planning.table.header.title')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.projectName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180">
      <template #header>
        <p v-html="$t('planning.table.header.date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.createdAt) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="110">
      <template #header>
        <p v-html="$t('planning.table.header.creator')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.createdByName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('planning.table.header.status')"></p>
      </template>
      <template #default="scope">
        <span class="planning-status" :class="statusClass(scope.row.reviewer)">
          {{ $t(formatStatus(scope.row)) }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('planning.table.header.action')"></p>
      </template>
      <template #default="scope">
        <div>
          <button @click="$emit('details', scope.row.id)" class="btn-edit">
            <IconEdit />
          </button>
          <button v-if="!scope.row.isApproved" @click="$emit('delete', scope.row.id)" class="btn-delete">
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
import {STATUS_LABELS} from "@/constants/planning.js";

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
          return "planning-receive-planning";
        case 1:
          return "planning";
        case 2:
          return "planning-in-progress";
        case 3:
          return "planning-completed";
        case 4:
          return "planning-paused";
        case 5:
          return "planning-closed";
        default:
          return ""; // Handle unexpected values
      }
    };

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }

    const formatCurrency = (inputCurrency) => {
      return mixinMethods.formatCurrency(inputCurrency);
    }

    const formatStatus = (row) => {
      return STATUS_LABELS[row] || 'Unknown';
    };

    return {
      statusClass,
      formatStatus,
      formatDate,
      formatCurrency
    };
  },
};
</script>

<style lang="scss">
.planning {
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
