<template>
  <div class="vehicle-container">
    <el-table
        :data="data"
        style="width: 100%"
        class="el-tbl-custom vehicle-table"
    >
      <el-table-column
          type="index"
          min-width="53"
          :label="$t('common.no')"
          align="right"
      ></el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resources.machine.table.header.licensePlate')"></p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.licensePlate ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resources.machine.table.header.brand')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.brand ? scope.row.brand : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resources.machine.table.header.vehicleType')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.vehicleType ? scope.row.vehicleType : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resources.machine.table.header.driver')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.driver ? scope.row.driver : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p v-html="$t('resources.machine.table.header.status')"></p>
        </template>

        <template #default="scope">
        <span class="data-table">{{ scope.row.status ? scope.row.status : "-" }}
        </span>
        </template>
      </el-table-column>

      <el-table-column min-width="90">
        <template #header>
          <p v-html="$t('resources.machine.table.header.action')"></p>
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
  </div>
</template>

<script>
import IconEdit from "@/svg/IconEdit.vue";
import IconTrash from "@/svg/IconTrash.vue";

export default {
  name: 'VehicleTable',
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
.vehicle-container {
  padding: 20px;
  background-color: #f5f7fa;

  .header {
    margin-bottom: 20px;

    h2 {
      font-size: 24px;
      color: #2c3e50;
      margin-bottom: 5px;
    }

    p {
      color: #7f8c8d;
      margin: 0;
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .action-buttons {
      display: flex;
      gap: 10px;

      .add-btn {
        background-color: #10b981;
        color: white;
        border: none;
      }
    }

    .table-actions {
      display: flex;
      gap: 10px;

      .action-dropdown {
        margin-right: 10px;
      }

      .search-input {
        width: 200px;
      }
    }
  }

  .vehicle-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;

    .license-plate {
      display: flex;
      align-items: center;
      gap: 10px;

      .plate-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;

        &.blue {
          background-color: #3498db;
        }

        &.red {
          background-color: #e74c3c;
        }

        &.green {
          background-color: #2ecc71;
        }

        &.orange {
          background-color: #f39c12;
        }
      }
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;

      &.active {
        background-color: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
  }
}

// Override Element UI styles
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-button) {
  border-radius: 4px;
}

:deep(.el-dropdown-link) {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

