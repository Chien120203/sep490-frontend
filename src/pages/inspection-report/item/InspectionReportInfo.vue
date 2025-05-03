<template>
  <el-card class="inspection-form">
    <el-form
        :disabled="!allowEdit"
        label-position="top"
        :model="inspectionReportDetails"
        ref="ruleFormRef"
        :rules="rules"
    >

      <el-form-item label="Ten kiểm tra" required>
        <el-input v-model="inspectionReportDetails.inspectionName" placeholder="Nhập ten kiểm tra" />
      </el-form-item>
      <!-- Verification code -->
      <el-form-item label="Mã kiểm tra" prop="inspectCode">
        <el-input disabled v-model="inspectionReportDetails.inspectCode" placeholder="Nhập mã kiểm tra" />
      </el-form-item>

      <!-- Inspection dates -->
      <div class="form-row">
        <el-form-item label="Ngày bắt đầu kiểm tra" prop="inspectStartDate" required class="date-field">
          <el-date-picker
              v-model="inspectionReportDetails.inspectStartDate"
              :format="DATE_FORMAT"
              :value-format="DATE_FORMAT"
              placeholder="mm/dd/yyyy"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Ngày kết thúc kiểm tra" prop="inspectEndDate" required class="date-field">
          <el-date-picker
              v-model="inspectionReportDetails.inspectEndDate"
              :format="DATE_FORMAT"
              :value-format="DATE_FORMAT"
              placeholder="mm/dd/yyyy"
              style="width: 100%"
          />
        </el-form-item>
      </div>

      <!-- Location -->
      <el-form-item label="Vị trí" prop="location" required>
        <el-input v-model="inspectionReportDetails.location" placeholder="Nhập vị trí kiểm tra" />
      </el-form-item>

      <!-- Decision -->
      <el-form-item label="Quyết định kiểm tra" prop="inspectionDecision" required>
        <el-radio-group v-model="inspectionReportDetails.inspectionDecision">
          <el-radio :label="INSPECT_DECISION_PASS">Đạt yêu cầu</el-radio>
          <el-radio :label="INSPECT_DECISION_FAIL">Không đạt yêu cầu</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Status -->
      <el-form-item label="Trạng thái" prop="status" required>
        <el-radio-group disabled v-model="inspectionReportDetails.status">
          <el-radio :label="APPROVED_STATUS">Duyệt</el-radio>
          <el-radio :label="REJECTED_STATUS">Từ chối</el-radio>
          <el-radio :label="WAIT_FOR_APPROVE">Đợi Duyệt</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Quality notes -->
      <el-form-item label="Ghi chú chất lượng">
        <el-input type="textarea" v-model="inspectionReportDetails.qualityNote" rows="3" />
      </el-form-item>

      <!-- Other notes -->
      <el-form-item label="Ghi chú khác">
        <el-input type="textarea" v-model="inspectionReportDetails.otherNote" rows="3" />
      </el-form-item>

      <!-- Attachments -->
      <el-form-item prop="attachment" label="Tệp đính kèm">
        <FileUpload
            :existingFiles="inspectionReportDetails.attachment"
            :allowedTypes="'.jpg,.png,.pdf,.docx'"
            :fileLimit="3"
            class="input-wd-96"
            @file-selected="handleSelectAttachments"
            @file-removed="handleRemoveAttachments"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "@/components/common/FileUpload.vue";
import {DATE_FORMAT} from "@/constants/application.js";
import {
  APPROVED_STATUS,
  INSPECT_DECISION_FAIL,
  INSPECT_DECISION_PASS,
  REJECTED_STATUS, WAIT_FOR_APPROVE
} from "@/constants/inspection.js";

const props = defineProps({
  inspectionReportDetails: {
    type: Object,
    default: () => {
    }
  },
  rules: {
    type: Object,
    default: () => {
    }
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});
const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const handleSelectAttachments = (listFiles) => {
  props.inspectionReportDetails.attachment = listFiles || [];
}

const handleRemoveAttachments = (file) => {
  props.inspectionReportDetails.attachment = props.inspectionReportDetails.attachment.filter((f) => f.uid !== file.uid);
}
</script>

<style scoped>
.inspection-form {
  padding: 20px;
  background: #fff;
}
</style>