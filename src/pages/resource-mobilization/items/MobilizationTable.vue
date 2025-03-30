<template>
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
    <el-table-column min-width="80">
      <template #header>
        <p v-html="$t('mobilization.table.header.code')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.requestCode ?? "-"}} </span>
      </template>
    </el-table-column>
    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('mobilization.table.header.name')"></p>
      </template>

      <template #default="scope">
        <span class="data-table"
        >{{ scope.row.requestName ? scope.row.requestName : "-"}}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('mobilization.table.header.priority')"></p>
      </template>

      <template #default="scope">
        <span class="data-table"
        >{{ scope.row.priorityLevel ? scope.row.priorityLevel : "-"}}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('mobilization.table.header.date')"></p>
      </template>

      <template #default="scope">
        <span class="data-table"
        >{{ formatDate(scope.row.requestDate) ?? "-"}}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('mobilization.table.header.status')"></p>
      </template>

      <template #default="scope">
        <span class="mobilization-status" :class="statusClass(scope.row.status)">
          {{ $t(formatStatus(scope.row.status)) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('mobilization.table.header.action')"></p>
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
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";
import {STATUS_LABELS} from "@/constants/survey.js";

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
  setup(props, { emit }) {
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

    const formatStatus = (status) => {
      return STATUS_LABELS[status] || 'Unknown';
    };
    return {
      statusClass,
      formatStatus,
      formatDate,
      formatCurrency,
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

.mobilization {
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

  &-file {
    margin-left: 12px;
  }

  &-renewed {
    background: #d4a816;
  }

  &-active {
    background: #15a726;
  }

  &-terminated {
    background: #d03333;
  }

  &-monthly {
    background: #4e1b7b;
  }

  &-quater {
    background: #136e87;
  }

  &-half-year {
    background: #4616d4;
  }

  &-year {
    background: #772044;
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
