<template>
    <el-table
        :data="data"
        style="width: 100%"
        class="el-tbl-custom room-tbl"
    >
      <el-table-column
          type="index"
          min-width="53"
          :label="$t('common.no')"
          align="right"
      ></el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.human.table.header.teamName')"></p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.teamName ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.human.table.header.manager.fullName')"></p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.manager.fullName ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200">
        <template #header>
          <p v-html="$t('resource.human.table.header.description')"></p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.description ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="90">
        <template #header>
          <p v-html="$t('resource.human.table.header.action')"></p>
        </template>
        <template #default="scope">
          <div>
            <button @click="$emit('details', scope.row.id)" class="btn-edit">
              <IconEdit/>
            </button>
            <button @click="$emit('delete', scope.row.id)" class="btn-edit">
              <IconTrash/>
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :current-page="1"
      ></el-pagination>
    </div>
</template>

<script>
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";

export default {
  name: 'ConstructionTeamTable',
  components: {IconTrash, IconEdit},
  props: {
    data: {
      type: Array,
      default: [],
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
.human {
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

