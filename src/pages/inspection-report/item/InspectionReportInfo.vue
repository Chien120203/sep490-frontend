<template>
  <el-card class="inspection-form">
    <el-form label-position="top" :model="inspectionDetails" ref="ruleFormRef" :rules="rules">
      <!-- File attachment section -->
      <div class="attachment-section">
        <div class="attachment-box">
          <div class="upload-icon">
            <el-icon><Plus /></el-icon>
            <div>Tải lên</div>
          </div>
        </div>
        <div class="attachment-label">Tệp đính kèm</div>
      </div>

      <!-- Verification code -->
      <el-form-item label="Mã kiểm tra" prop="inspectionCode" required>
        <el-input v-model="inspectionDetails.inspectionCode" placeholder="Nhập mã kiểm tra" />
      </el-form-item>

      <!-- Inspector -->
      <el-form-item label="Người kiểm tra" prop="inspector" required>
        <el-select v-model="inspectionDetails.inspector" placeholder="Chọn người kiểm tra" style="width: 100%">
          <el-option label="Nguyễn Văn A" value="Nguyễn Văn A" />
          <el-option label="Nguyễn Văn B" value="Nguyễn Văn B" />
          <el-option label="Nguyễn Văn C" value="Nguyễn Văn C" />
        </el-select>
      </el-form-item>

      <!-- Inspection dates -->
      <div class="form-row">
        <el-form-item label="Ngày bắt đầu kiểm tra" prop="startDate" required class="date-field">
          <el-date-picker
              v-model="inspectionDetails.startDate"
              type="date"
              placeholder="mm/dd/yyyy"
              format="MM/DD/YYYY"
              value-format="YYYY-MM-DD"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Ngày kết thúc kiểm tra" prop="endDate" required class="date-field">
          <el-date-picker
              v-model="inspectionDetails.endDate"
              type="date"
              placeholder="mm/dd/yyyy"
              format="MM/DD/YYYY"
              value-format="YYYY-MM-DD"
              style="width: 100%"
          />
        </el-form-item>
      </div>

      <!-- Progress and Plan -->
      <div class="form-row">
        <el-form-item label="Tiến độ" prop="progress" class="half-width">
          <el-select v-model="inspectionDetails.progress" placeholder="Chọn tiến độ" style="width: 100%">
            <el-option label="Giai đoạn 1" value="Giai đoạn 1" />
            <el-option label="Giai đoạn 2" value="Giai đoạn 2" />
            <el-option label="Giai đoạn 3" value="Giai đoạn 3" />
          </el-select>
        </el-form-item>

        <el-form-item label="Kế hoạch" prop="plan" class="half-width">
          <el-select v-model="inspectionDetails.plan" placeholder="Chọn kế hoạch" style="width: 100%">
            <el-option label="Kế hoạch A" value="Kế hoạch A" />
            <el-option label="Kế hoạch B" value="Kế hoạch B" />
            <el-option label="Kế hoạch C" value="Kế hoạch C" />
          </el-select>
        </el-form-item>
      </div>

      <!-- Location -->
      <el-form-item label="Vị trí" prop="location" required>
        <el-input v-model="inspectionDetails.location" placeholder="Nhập vị trí kiểm tra" />
      </el-form-item>

      <!-- Decision -->
      <el-form-item label="Quyết định kiểm tra" prop="decision" required>
        <el-radio-group v-model="inspectionDetails.decision">
          <el-radio label="Đạt yêu cầu">Đạt yêu cầu</el-radio>
          <el-radio label="Đạt có điều kiện">Đạt có điều kiện</el-radio>
          <el-radio label="Không đạt yêu cầu">Không đạt yêu cầu</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Status -->
      <el-form-item label="Trạng thái">
        <el-radio-group v-model="inspectionDetails.status">
          <el-radio label="Nhập">Nhập</el-radio>
          <el-radio label="Đã nộp">Đã nộp</el-radio>
          <el-radio label="Đã duyệt">Đã duyệt</el-radio>
          <el-radio label="Từ chối">Từ chối</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Quality notes -->
      <el-form-item label="Ghi chú chất lượng">
        <el-input type="textarea" v-model="inspectionDetails.qualityNotes" rows="3" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  inspectionDetails: {
    type: Object,
    default: () => ({
      inspectionCode: "",
      inspector: "",
      startDate: "",
      endDate: "",
      progress: "",
      plan: "",
      location: "",
      decision: "",
      status: "Nhập",
      qualityNotes: "",
      attachments: []
    })
  },
  rules: {
    type: Object,
    default: () => ({
      inspectionCode: [{ required: true, message: "Vui lòng nhập mã kiểm tra", trigger: "blur" }],
      inspector: [{ required: true, message: "Vui lòng chọn người kiểm tra", trigger: "change" }],
      startDate: [{ required: true, message: "Vui lòng chọn ngày bắt đầu", trigger: "change" }],
      endDate: [{ required: true, message: "Vui lòng chọn ngày kết thúc", trigger: "change" }],
      location: [{ required: true, message: "Vui lòng nhập vị trí", trigger: "blur" }],
      decision: [{ required: true, message: "Vui lòng chọn quyết định", trigger: "change" }]
    })
  }
});

const ruleFormRef = ref(null);

const handleFileUpload = (file) => {
  // Handle file upload logic here
  console.log("File uploaded:", file);
};

defineExpose({
  ruleFormRef,
});
</script>

<style scoped>
.inspection-form {
  padding: 20px;
  background: #fff;
}

.attachment-section {
  margin-bottom: 20px;
}

.attachment-box {
  border: 1px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #909399;
}

.attachment-label {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 0;
}

.date-field {
  flex: 1;
}

.half-width {
  flex: 1;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-form-item__label-wrap) {
  margin-left: 0;
}

:deep(.el-form-item.is-required .el-form-item__label:before) {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>