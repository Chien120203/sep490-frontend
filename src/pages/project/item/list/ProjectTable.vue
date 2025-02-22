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
        <span :class="['project-status']">
          {{ scope.row.status }}
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
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";

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
      switch (status?.toLowerCase()) {
        case "in progress":
          return "project-inprogress";
        case "planning":
          return "project-planning";
        case "ongoing":
          return "project-ongoing";
        case "completed":
          return "project-completed";
        default:
          return "project-closed";
      }
    };

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }

    const formatCurrency = (inputCurrency) => {
      return mixinMethods.formatCurrency(inputCurrency);
    }

    return {
      statusClass,
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
    padding: 2px 16px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
  }

  &-ongoing {
    background: #36812a;
  }

  &-inprogress {
    background: #8e3c9b;
  }

  &-planning {
    background: #dabc3b;
  }

  &-completed {
    background: #2d47a3;
  }

  &-closed {
    background: #dc3545;
  }
}

.text-color {
  color: #212529;
}

.data-table {
  word-break: break-word;
}
</style>
