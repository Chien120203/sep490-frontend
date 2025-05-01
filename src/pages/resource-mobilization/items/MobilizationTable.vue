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
    <el-table-column min-width="140">
      <template #header>
        <p v-html="$t('mobilization.table.header.code')"></p>
      </template>

      <template #default="scope">
        <span class="data-table">{{ scope.row.requestCode ?? "-" }} </span>
      </template>
    </el-table-column>
    <el-table-column min-width="130">
      <template #header>
        <p v-html="$t('mobilization.table.header.name')"></p>
      </template>

      <template #default="scope">
        <span class="data-table"
        >{{ scope.row.requestName ? scope.row.requestName : "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p v-html="$t('mobilization.table.header.date')"></p>
      </template>

      <template #default="scope">
        <span class="data-table"
        >{{ formatDate(scope.row.requestDate) ?? "-" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p class="label-center" v-html="$t('mobilization.table.header.priority')"></p>
      </template>

      <template #default="scope">
        <span class="data-table mobilization-priority" :class="priorityClass(scope.row.priorityLevel)"
        >{{ $t(formatPriority(scope.row.priorityLevel)) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="100">
      <template #header>
        <p class="label-center" v-html="$t('mobilization.table.header.status')"></p>
      </template>

      <template #default="scope">
        <span class="mobilization-status" :class="statusClass(scope.row.status)">
          {{ $t(formatStatus(scope.row.status)) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="90">
      <template #header>
        <p v-html="$t('mobilization.table.header.action')"></p>
      </template>
      <template #default="scope">
        <div>
          <button @click="$emit('details', scope.row.id)" class="btn-edit">
            <IconEdit/>
          </button>
          <button v-if="scope.row.status === DRAFT_STATUS && currentRole === RESOURCE_MANAGER" @click="$emit('delete', scope.row.id)" class="btn-edit">
            <IconTrash/>
          </button>
          <button v-if="scope.row.status === DRAFT_STATUS && currentRole === RESOURCE_MANAGER" @click="$emit('changeStatus', {id: scope.row.id, type: 'send'})" class="btn-edit">
            <IconChatSend/>
          </button>
          <button v-if="allowApprove(scope.row.status)" @click="$emit('changeStatus', {id: scope.row.id, type: 'approve'})" class="btn-edit">
            <IconApprove/>
          </button>
          <button v-if="allowReject(scope.row.status)" @click="$emit('changeStatus', {id: scope.row.id, type: 'reject'})" class="btn-edit">
            <IconBan/>
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
import {MANAGER_APPROVED, PRIORITIES, STATUS_LABELS, WAIT_MANAGER_APPROVE} from "@/constants/mobilization.js";
import {DRAFT_STATUS} from "@/constants/mobilization.js";
import IconApprove from "@/svg/IconApprove.vue";
import IconRefuse from "@/svg/IconRefuse.vue";
import {EXECUTIVE_BOARD, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import IconChatSend from "@/svg/IconChatSend.vue";
import {ref} from "vue";
import IconBan from "@/svg/IconBan.vue";

export default {
  components: {
    IconBan,
    IconChatSend,
    IconRefuse,
    IconApprove,
    IconEdit,
    IconTrash,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  setup(props, {emit}) {
    const currentRole = ref(localStorage.getItem("role"));
    const statusClass = (status) => {
      if (status == null) return ""; // Ensure status is not null or undefined
      switch (status) {
        case 0:
          return "mobilization-draft";
        case 1:
          return "mobilization-wait-manager-approve";
        case 2:
          return "mobilization-manager-approved";
        case 3:
          return "mobilization-bod-approved";
        case 4:
          return "mobilization-rejected";
        default:
          return ""; // Handle unexpected values
      }
    };
    const priorityClass = (priority) => {
      switch (priority) {
        case 0:
          return "mobilization-low";
        case 1:
          return "mobilization-medium";
        case 2:
          return "mobilization-high";
      }
    }
    const formatPriority = (level) => {
      return PRIORITIES[level];
    }
    const formatDate = (inputDate) => {
      return mixinMethods.showDateTime(inputDate, DATE_FORMAT);
    }

    const formatCurrency = (inputCurrency) => {
      return mixinMethods.formatCurrency(inputCurrency);
    }

    const formatStatus = (status) => {
      return STATUS_LABELS[status] || 'Unknown';
    };

    const allowApprove = (status) => {
      if(status === WAIT_MANAGER_APPROVE && currentRole.value === TECHNICAL_MANAGER) return true;
      return status === MANAGER_APPROVED && currentRole.value === EXECUTIVE_BOARD;
    }

    const allowReject = (status) => {
      return (status === WAIT_MANAGER_APPROVE && currentRole.value === TECHNICAL_MANAGER) || (status === MANAGER_APPROVED && currentRole.value === EXECUTIVE_BOARD);
    }
    return {
      statusClass,
      formatStatus,
      formatDate,
      formatCurrency,
      formatPriority,
      priorityClass,
      allowApprove,
      allowReject,
      currentRole,
      DRAFT_STATUS,
      RESOURCE_MANAGER
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

.mobilization {
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
    width: 80%;
    justify-self: center;
  }
  &-priority {
    background: #ccc;
    color: #fff !important;
    font-size: 12px;
    border-radius: 100px;
    display: block;
    padding: 2px 16px;
    line-height: 1.2;
    font-weight: 700;
    text-align: center;
    width: 80%;
    justify-self: center;
  }

  &-file {
    margin-left: 12px;
  }

  &-draft {
    background: #aeacac;
  }

  &-wait-manager-approve {
    background: #a62967;
  }

  &-manager-approved {
    background: #1f7885;
  }

  &-bod-approved {
    background: #2b4b7c;
  }

  &-rejected {
    background: #8a1515;
  }

  &-low {
    background: #48225e;
  }

  &-medium {
    background: #2b4b7c;
  }

  &-high {
    background: #da6b34;
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
.label-center {
  text-align: center  ;
}
</style>
