<template>
  <el-table
      :data="data"
      style="width: 100%; height: 95%"
      class="el-tbl-custom inspection-tbl"
  >
    <el-table-column
        type="index"
        min-width="53"
        :label="$t('common.no')"
        align="right"
    ></el-table-column>
    <el-table-column min-width="150">
      <template #header>
        <p v-html="$t('inspection.table.header.report_code')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.InspectionCode ?? "-" }} </span>
      </template>
    </el-table-column>
    <el-table-column min-width="200">
      <template #header>
        <p v-html="$t('inspection.table.header.name')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">
          {{ scope.row.InspectionName ? scope.row.InspectionName : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('inspection.table.header.date')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">
          {{ scope.row.date ? scope.row.date : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('inspection.table.header.status')"></p>
      </template>

      <template #default="scope">
        <span
            class="inspection-status"
            :class="getStatusClass(scope.row.status)"
        >
          {{ scope.row.status ? scope.row.status : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('inspection.table.header.action')"></p>
      </template>
      <template #default="scope">
        <div>
          <button
              @click="$emit('details', scope.row.id)"
              class="btn-action btn-view"
          >
            <IconEdit />
          </button>
          <button
              @click="$emit('delete', scope.row.id)"
              class="btn-action btn-delete"
          >
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

export default {
  components: {
    IconEdit,
    IconTrash,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const getStatusClass = (status) => {
      switch (status) {
        case "Completed":
          return "inspection-completed";
        case "Pending":
          return "inspection-pending";
        case "Cancelled":
          return "inspection-cancelled";
        default:
          return "";
      }
    };

    return {
      getStatusClass,
    };
  },
};
</script>

<style lang="scss" scoped>
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

  &-completed {
    background: #15a726;
  }

  &-pending {
    background: #d4a816;
  }

  &-cancelled {
    background: #d03333;
  }

  &-tbl {
    .btn-action {
      background: none;
      border: none;
      cursor: pointer;
      svg {
        width: 16px;
        height: 16px;
      }
    }

    .btn-view {
      color: #007bff;
    }

    .btn-delete {
      color: #d03333;
    }
  }
}
</style>