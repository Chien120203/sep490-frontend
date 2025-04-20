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
          <p>Team Name</p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.teamName ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="130">
        <template #header>
          <p>Team Manager</p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.manager.username ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200">
        <template #header>
          <p>Description</p>
        </template>

        <template #default="scope">
          <span class="data-table">{{ scope.row.description ?? "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="90">
        <template #header>
          <p>Action</p>
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
.material-container {
  padding: 20px;

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

  .material-table {
    background-color: white;
    border-radius: 8px;
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

