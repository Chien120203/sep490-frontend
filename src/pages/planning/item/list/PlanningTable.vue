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
        <span class="planning-status" :class="statusClass(getStatus(scope.row).value)">
        {{ $t(getStatus(scope.row).label) }}
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
import {EXECUTIVE_BOARD, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";

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
    const getStatus = (plan) => {
      const resourceApprove = plan.reviewers.find(p => p.role === RESOURCE_MANAGER)?.isApproved;
      const techApprove = plan.reviewers.find(p => p.role === TECHNICAL_MANAGER)?.isApproved;
      const bodApprove = plan.reviewers.find(p => p.role === EXECUTIVE_BOARD)?.isApproved;

      if(bodApprove === false) return {value: "bod-reject", label: "planning.status.re_planning"};
      if(bodApprove === true) return {value: "bod-approved", label: "planning.status.bod_approved"};
      if(techApprove === true) return {value: "tech-approved", label: "planning.status.tech_approved"};
      if(resourceApprove === true) return {value: "resource-approved", label: "planning.status.resource_approved"};
      if(resourceApprove === null && techApprove === null) return {value: "draft", label: "planning.status.draft"};
    }
    const statusClass = (status) => {
      return `planning-${status}`;
    };

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }

    const formatCurrency = (inputCurrency) => {
      return mixinMethods.formatCurrency(inputCurrency);
    }

    return {
      statusClass,
      getStatus,
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

  &-draft {
    background: #b5afaf;
  }

  &-resource-approved {
    background: #1f4261;
  }

  &-tech-approved {
    background: #1f4261;
  }

  &-bod-approved {
    background: #3e8e22;
  }

  &-bod-reject {
    background: #dfbe3a;
  }
}

.text-color {
  color: #212529;
}

.data-table {
  word-break: break-word;
}
</style>
