<template>
  <div class="material-container">
    <el-table
        :data="data"
        style="width: 100%"
        class="el-tbl-custom material-table"
    >
      <el-table-column
          type="index"
          min-width="53"
          :label="$t('common.no')"
          align="right"
      ></el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.material.table.header.materialCode')"></p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.materialCode ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.material.table.header.materialName')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.materialName ? scope.row.materialName : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.material.table.header.inventory')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.inventory ? scope.row.inventory : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.material.table.header.expireDate')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.expireDate ? formatDate( scope.row.expireDate) : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resource.material.table.header.productionDate')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.productionDate ? formatDate(scope.row.productionDate) : "-"}}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="90">
        <template #header>
          <p v-html="$t('resource.material.table.header.action')"></p>
        </template>
        <template #default="scope">
          <div>
            <button @click="$emit('details', scope.row.id)" class="btn-edit">
              <IconEdit/>
            </button>
            <button v-if="allowEdit" @click="$emit('delete', scope.row.id)" class="btn-edit">
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
  </div>
</template>

<script>
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {mixinMethods} from "@/utils/variables.js";

export default {
  name: 'MaterialTable',
  components: {IconTrash, IconEdit},
  props: {
    data: {
      type: Array,
      default: [],
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const formatDate = (date) => {
      return mixinMethods.showDateTime(date);
    }
    return {
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
.material {
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

