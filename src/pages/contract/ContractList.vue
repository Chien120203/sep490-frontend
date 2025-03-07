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
        <p v-html="$t('contract.table.header.code')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.contractCode }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('contract.table.header.start_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.startDate) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('contract.table.header.finish_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.endDate) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('contract.table.header.estimate_days')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.estimatedDays }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('contract.table.header.sign_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.signDate) }}</span>
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

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    };

    return {
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
