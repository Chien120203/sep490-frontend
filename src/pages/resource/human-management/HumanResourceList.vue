<template>
  <el-table :data="data" style="width: 100%">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="licensePlate" label="Biển số xe">
      <template #default="scope">
        <span :class="`status-circle status-${scope.row.statusColor}`"></span>
        {{ scope.row.licensePlate }}
      </template>
    </el-table-column>
    <el-table-column prop="vehicleType" label="Loại phương tiện"></el-table-column>
    <el-table-column prop="model" label="Dòng phương tiện"></el-table-column>
    <el-table-column prop="driver" label="Lái xe phụ trách"></el-table-column>
    <el-table-column prop="status" label="Trạng thái"></el-table-column>
    <el-table-column width="50">
      <template #default>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Chỉnh sửa</el-dropdown-item>
            <el-dropdown-item>Xóa</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    data: Array
  }
};
</script>

<style scoped>
.status-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
.status-blue { background-color: blue; }
.status-red { background-color: red; }
.status-green { background-color: green; }
.el-dropdown-link {
  cursor: pointer;
  color: #606266;
}
.el-icon-more {
  font-size: 20px;
}
</style>