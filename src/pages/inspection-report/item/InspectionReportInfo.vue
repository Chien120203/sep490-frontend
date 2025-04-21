<template>
  <el-card class="inspection-form">
    <el-form
        label-position="top"
        :model="inspectionReportDetails"
        ref="ruleFormRef"
        :rules="rules"
    >
      <!-- Verification code -->
      <el-form-item label="Mã kiểm tra" prop="inspect_code" required>
        <el-input v-model="inspectionReportDetails.inspect_code" placeholder="Nhập mã kiểm tra" />
      </el-form-item>

      <!-- Inspector -->
      <el-form-item label="Người kiểm tra" prop="inspector" required>
        <el-select v-model="inspectionReportDetails.inspector" placeholder="Chọn người kiểm tra" style="width: 100%">
          <el-option label="Nguyễn Văn A" value="Nguyễn Văn A" />
          <el-option label="Nguyễn Văn B" value="Nguyễn Văn B" />
          <el-option label="Nguyễn Văn C" value="Nguyễn Văn C" />
        </el-select>
      </el-form-item>

      <!-- Inspection dates -->
      <div class="form-row">
        <el-form-item label="Ngày bắt đầu kiểm tra" prop="inspect_start_date" required class="date-field">
          <el-date-picker
              v-model="inspectionReportDetails.inspect_start_date"
              type="date"
              placeholder="mm/dd/yyyy"
              format="MM/DD/YYYY"
              value-format="YYYY-MM-DD"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Ngày kết thúc kiểm tra" prop="inspect_end_date" required class="date-field">
          <el-date-picker
              v-model="inspectionReportDetails.inspect_end_date"
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
        <el-form-item label="Tiến độ" prop="progress_id" class="half-width">
          <el-select v-model="inspectionReportDetails.progress_id" placeholder="Chọn tiến độ" style="width: 100%">
            <el-option label="Giai đoạn 1" value="1" />
            <el-option label="Giai đoạn 2" value="2" />
            <el-option label="Giai đoạn 3" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="Kế hoạch" prop="plan_id" class="half-width">
          <el-select v-model="inspectionReportDetails.plan_id" placeholder="Chọn kế hoạch" style="width: 100%">
            <el-option label="Kế hoạch A" value="1" />
            <el-option label="Kế hoạch B" value="2" />
            <el-option label="Kế hoạch C" value="3" />
          </el-select>
        </el-form-item>
      </div>

      <!-- Location -->
      <el-form-item label="Vị trí" prop="location" required>
        <el-input v-model="inspectionReportDetails.location" placeholder="Nhập vị trí kiểm tra" />
      </el-form-item>

      <!-- Decision -->
      <el-form-item label="Quyết định kiểm tra" prop="inspection_decision" required>
        <el-radio-group v-model="inspectionReportDetails.inspection_decision">
          <el-radio :label="1">Đạt yêu cầu</el-radio>
          <el-radio :label="2">Đạt có điều kiện</el-radio>
          <el-radio :label="3">Không đạt yêu cầu</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Quality notes -->
      <el-form-item label="Ghi chú chất lượng">
        <el-input type="textarea" v-model="inspectionReportDetails.quality_note" rows="3" />
      </el-form-item>

      <!-- Attachments -->
      <el-form-item prop="attachment" label="Tệp đính kèm">
        <FileUpload
            :allowedTypes="'.jpg,.png,.pdf,.docx'"
            :fileLimit="3"
            class="input-wd-96"
            @file-selected="handleFileUpload"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveInspectionReport">Lưu</el-button>
        <el-button type="default" @click="clearForm">Xóa</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useInspectionReportStore } from "@/store/inspection.js";
import FileUpload from "@/components/common/FileUpload.vue";

const store = useInspectionReportStore();

const inspectionReportDetails = store.inspectionReportDetails;
const rules = ref({
  inspect_code: [{ required: true, message: "Vui lòng nhập mã kiểm tra", trigger: "blur" }],
  inspector: [{ required: true, message: "Vui lòng chọn người kiểm tra", trigger: "change" }],
  inspect_start_date: [{ required: true, message: "Vui lòng chọn ngày bắt đầu", trigger: "change" }],
  inspect_end_date: [{ required: true, message: "Vui lòng chọn ngày kết thúc", trigger: "change" }],
  location: [{ required: true, message: "Vui lòng nhập vị trí", trigger: "blur" }],
  inspection_decision: [{ required: true, message: "Vui lòng chọn quyết định", trigger: "change" }]
});

const ruleFormRef = ref(null);

const handleFileUpload = (file) => {
  inspectionReportDetails.attachment.push(file);
};

const saveInspectionReport = () => {
  store.saveInspectionReport(inspectionReportDetails, "save");
};

const clearForm = () => {
  store.clearInspectionReportDetails();
};
</script>

<style scoped>
.inspection-form {
  padding: 20px;
  background: #fff;
}
</style>