<template>
  <div class="dashboard">
    <!-- Phần Thống kê phương tiện -->
    <div class="vehicle-stats">
      <h2>Thống kê phương tiện</h2>
      <ul>
        <li v-for="stat in vehicleStats" :key="stat.type">
          <i class="el-icon-truck"></i>
          {{ stat.type }}: {{ stat.count }}
        </li>
      </ul>
    </div>

    <!-- Phần Truy cập nhanh -->
    <div class="quick-access">
      <h2>Truy cập nhanh</h2>
      <div class="grid">
        <div class="item" @click="openAddVehicleDialog">
          <i class="el-icon-document-add"></i>
          Thêm phương tiện
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <i class="el-icon-document-add"></i>
          Thêm nhật ký bảo trì
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <i class="el-icon-document-add"></i>
          Thêm nhật ký điều chuyển
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <i class="el-icon-document-add"></i>
          Thêm lái xe
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <i class="el-icon-document-add"></i>
          Thêm chuyến chuyển
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="item">
          <i class="el-icon-document-add"></i>
          Thêm chấm ca
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>

    <!-- Phần Báo cáo -->
    <div class="reports">
      <h2>Báo cáo</h2>
      <ul>
        <li @click="goToReport('fuel')">
          <i class="el-icon-document"></i>
          Báo cáo nhiên liệu
        </li>
        <li @click="goToReport('shift-check')">
          <i class="el-icon-document"></i>
          Báo cáo chấm ca
        </li>
        <li @click="goToReport('shift-check-by-project')">
          <i class="el-icon-document"></i>
          Báo cáo chấm ca theo dự án
        </li>
        <li @click="goToReport('transport-cost')">
          <i class="el-icon-document"></i>
          Báo cáo chi phí vận chuyển
        </li>
        <li @click="goToReport('fuel-by-project')">
          <i class="el-icon-document"></i>
          Báo cáo nhiên liệu theo dự án
        </li>
        <li @click="goToReport('vehicle-usage-by-project')">
          <i class="el-icon-document"></i>
          Báo cáo sử dụng phương tiện theo dự án
        </li>
        <li @click="goToReport('maintenance')">
          <i class="el-icon-document"></i>
          Báo cáo bảo trì
        </li>
      </ul>
    </div>

    <!-- Pop-up Thêm phương tiện mới -->
    <el-dialog title="Thêm phương tiện mới" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" label-position="left" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Biển số xe *">
              <el-input v-model="form.licensePlate" placeholder="Biển số xe"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Động phương tiện">
              <el-input v-model="form.vehicleType" placeholder="Động phương tiện"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Nhãn hiệu">
              <el-input v-model="form.brand" placeholder="Nhãn hiệu"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Năm sản xuất">
              <el-input v-model="form.manufactureYear" placeholder="Năm sản xuất"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Nước sản xuất">
              <el-input v-model="form.manufactureCountry" placeholder="Nước sản xuất"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Số khung">
              <el-input v-model="form.chassisNumber" placeholder="Số khung"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Số máy">
              <el-input v-model="form.engineNumber" placeholder="Số máy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Hình ảnh">
          <el-upload
              action="#"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
            <span>Tải ảnh</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="cancel-btn">Hủy bỏ</el-button>
        <el-button type="primary" @click="saveVehicle">
          <i class="el-icon-folder-checked"></i> Lưu
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        licensePlate: '',
        vehicleType: '',
        brand: '',
        manufactureYear: '',
        manufactureCountry: '',
        chassisNumber: '',
        engineNumber: '',
      },
      vehicleStats: [
        { type: 'Xe tải', count: 10 },
        { type: 'Xe cẩu', count: 5 },
        { type: 'Xe ủi', count: 3 },
        { type: 'Xe lu', count: 7 },
      ],
    };
  },
  methods: {
    openAddVehicleDialog() {
      this.dialogVisible = true;
    },
    saveVehicle() {
      console.log('Vehicle data:', this.form);
      this.dialogVisible = false;
      this.form = {
        licensePlate: '',
        vehicleType: '',
        brand: '',
        manufactureYear: '',
        manufactureCountry: '',
        chassisNumber: '',
        engineNumber: '',
      };
    },
    goToReport(reportType) {
      this.$router.push(`/reports/${reportType}`);
    },
    handlePictureCardPreview(file) {
      console.log('Preview image:', file);
    },
    handleRemove(file, fileList) {
      console.log('Remove image:', file, fileList);
    },
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.vehicle-stats {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vehicle-stats h2 {
  color: #1f2d3d;
  font-weight: bold;
  margin-bottom: 15px;
}

.vehicle-stats ul {
  list-style: none;
  padding: 0;
}

.vehicle-stats li {
  display: flex;
  align-items: center;
  color: #606266;
  padding: 8px 0;
}

.vehicle-stats li i {
  margin-right: 8px;
  color: #909399;
}

.quick-access,
.reports {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-access h2,
.reports h2 {
  color: #1f2d3d;
  font-weight: bold;
  margin-bottom: 15px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.item {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
  padding: 10px;
}

.item i {
  margin-right: 8px;
  color: #909399;
}

.item .el-icon-arrow-right {
  margin-left: auto;
  color: #c0c4cc;
}

.reports ul {
  list-style: none;
  padding: 0;
}

.reports li {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
  padding: 8px 0;
}

.reports li i {
  margin-right: 8px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  color: #f56c6c;
}
</style>