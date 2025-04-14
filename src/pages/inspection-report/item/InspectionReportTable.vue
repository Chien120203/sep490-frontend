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
        <span class="data-table">{{ scope.row.projectCode ?? "-" }} </span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('inspection.table.header.inspectionCode')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.inspectionCode ?? "-" }} </span>
      </template>
    </el-table-column>

    <el-table-column min-width="150">
      <template #header>
        <p v-html="$t('inspection.table.header.inspectionName')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">
          {{ scope.row.inspectionName ? scope.row.inspectionName : "-" }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('inspection.table.header.date')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">
          {{ scope.row.date ? scope.row.date : "-" }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('inspection.table.header.status')"></p>
      </template>

      <template #default="scope">
        <span
            class="inspection-status"
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
            <IconEdit/>
          </button>
          <button
              @click="$emit('delete', scope.row.id)"
              class="btn-action btn-delete"
          >
            <IconTrash/>
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
  setup(props, {emit}) {
    return {};
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