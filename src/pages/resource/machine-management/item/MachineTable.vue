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

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('resource.machine.table.header.vehicleName')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.vehicleName ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('resource.machine.table.header.licensePlate')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.licensePlate ?? "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="80">
      <template #header>
        <p v-html="$t('resource.machine.table.header.brand')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.brand ? scope.row.brand : "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('resource.machine.table.header.vehicleType')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.vehicleType ? scope.row.vehicleType : "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('resource.machine.table.header.driver')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.user.fullName ? scope.row.user.fullName : "-" }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="80">
      <template #header>
        <p v-html="$t('resource.machine.table.header.status')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ getStatusText(scope.row.status) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('resource.machine.table.header.action')"></p>
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
</template>

<script>
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {useI18n} from "vue-i18n";

export default {
  name: 'MachineTable',
  components: { IconTrash, IconEdit },

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
  setup() {
    const { t } = useI18n();

    const statusTranslations = {
      0: t('resource.machine.statuses.inactive'),
      1: t('resource.machine.statuses.active'),
      2: t('resource.machine.statuses.maintain'),
    };

    const getStatusText = (status) => {
      return typeof status === 'number' && statusTranslations.hasOwnProperty(status)
          ? statusTranslations[status]
          : '-';
    };

    return {
      getStatusText,
    };
  }
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
.machine {
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