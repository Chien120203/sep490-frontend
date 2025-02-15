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
    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('user.table.header.username')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.username ? scope.row.username : "-"}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('user.table.header.fullName')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.fullName ? scope.row.fullName : "-"}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('user.table.header.email')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.email ? scope.row.email : "-"}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('user.table.header.dob')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.dob)}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('user.table.header.gender')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ $t(getGender(scope.row.gender))}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('user.table.header.role')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.role  ? scope.row.role : "-"}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('user.table.header.phone')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.phone ? scope.row.phone : "-"}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('user.table.header.action')"></p>
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
import { mixinMethods } from "@/utils/variables";

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
    const formatDate = (date) => {
      return mixinMethods.showDateTime(date);
    }

    const getGender = (gender) => {
      return gender ? "user.gender.male" : "user.gender.female";
    }
    return {
      formatDate,
      getGender
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

.user {
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
