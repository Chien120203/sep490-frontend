<template>
  <el-table
      :data="surveyData"
      max-height="400"
      style="width: 100%"
      class="el-tbl-custom survey-tbl"
  >
    <el-table-column type="index" min-width="53" :label="$t('common.no')" align="right"></el-table-column>

    <el-table-column min-width="110">
      <template #header>
        <p v-html="$t('survey.table.header.site_code')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.siteCode }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="180">
      <template #header>
        <p v-html="$t('survey.table.header.site_name')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.siteName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('survey.table.header.location')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.location }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('survey.table.header.survey_date')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ formatDate(scope.row.surveyDate) }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('survey.table.header.surveyor')"></p>
      </template>
      <template #default="scope">
        <span class="data-table">{{ scope.row.surveyor }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="120">
      <template #header>
        <p v-html="$t('survey.table.header.status')"></p>
      </template>
      <template #default="scope">
        <span class="survey-status" :class="statusClass(scope.row.status)">
          {{ $t(formatStatus(scope.row.status)) }}
        </span>
      </template>
    </el-table-column>

    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('survey.table.header.action')"></p>
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
    surveyData: {
      type: Array,
      default: [],
    },
  },
  setup() {
    const statusClass = (status) => {
      if (status == null) return ""; // Ensure status is not null or undefined
      switch (status) {
        case 0:
          return "survey-planned";
        case 1:
          return "survey-in-progress";
        case 2:
          return "survey-completed";
        case 3:
          return "survey-paused";
        default:
          return ""; // Handle unexpected values
      }
    };

    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }

    const formatStatus = (status) => {
      return STATUS_LABELS[status] || 'Unknown';
    };

    return {
      statusClass,
      formatStatus,
      formatDate
    };
  },
};
</script>

<style lang="scss">
.survey {
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

  &-planned {
    background: #f39c12;
  }

  &-in-progress {
    background: #3498db;
  }

  &-completed {
    background: #2ecc71;
  }

  &-paused {
    background: #e74c3c;
  }
}

.text-color {
  color: #212529;
}

.data-table {
  word-break: break-word;
}
</style>
