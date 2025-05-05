<template>
  <el-card class="inspection-form">
    <el-form
        :disabled="!allowEdit"
        label-position="top"
        :model="inspectionReportDetails"
        ref="ruleFormRef"
        :rules="rules"
    >
      <el-form-item :label="$t('inspection.form.inspection_name')" prop="inspectionName" required>
        <el-input v-model="inspectionReportDetails.inspectionName" :placeholder="$t('inspection.form.enter_inspection_name')" />
      </el-form-item>
      <!-- Verification code -->
      <el-form-item :label="$t('inspection.form.inspect_code')" prop="inspectCode">
        <el-input disabled v-model="inspectionReportDetails.inspectCode" :placeholder="$t('inspection.form.enter_inspect_code')" />
      </el-form-item>

      <!-- Inspection dates -->
      <div class="form-row">
        <el-form-item :label="$t('inspection.form.inspect_start_date')" prop="inspectStartDate" required class="date-field">
          <el-date-picker
              v-model="inspectionReportDetails.inspectStartDate"
              :format="DATE_FORMAT"
              :value-format="DATE_FORMAT"
              :placeholder="$t('inspection.form.enter_date')"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('inspection.form.inspect_end_date')" prop="inspectEndDate" required class="date-field">
          <el-date-picker
              v-model="inspectionReportDetails.inspectEndDate"
              :format="DATE_FORMAT"
              :value-format="DATE_FORMAT"
              :placeholder="$t('inspection.form.enter_date')"
              style="width: 100%"
          />
        </el-form-item>
      </div>

      <!-- Location -->
      <el-form-item :label="$t('inspection.form.location')" prop="location" required>
        <el-input v-model="inspectionReportDetails.location" :placeholder="$t('inspection.form.enter_location')" />
      </el-form-item>

      <!-- Decision -->
      <el-form-item :label="$t('inspection.form.inspection_decision')" prop="inspectionDecision" required>
        <el-radio-group v-model="inspectionReportDetails.inspectionDecision">
          <el-radio :label="INSPECT_DECISION_PASS">{{ $t('inspection.form.decision.pass') }}</el-radio>
          <el-radio :label="INSPECT_DECISION_FAIL">{{ $t('inspection.form.decision.fail') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Status -->
      <el-form-item :label="$t('inspection.form.statuss')" prop="status" required>
        <el-radio-group disabled v-model="inspectionReportDetails.status">
          <el-radio :label="APPROVED_STATUS">{{ $t('inspection.form.status.approved') }}</el-radio>
          <el-radio :label="REJECTED_STATUS">{{ $t('inspection.form.status.rejected') }}</el-radio>
          <el-radio :label="WAIT_FOR_APPROVE">{{ $t('inspection.form.status.wait_for_approve') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- Quality notes -->
      <el-form-item :label="$t('inspection.form.quality_note')">
        <el-input type="textarea" v-model="inspectionReportDetails.qualityNote" rows="3" />
      </el-form-item>

      <!-- Other notes -->
      <el-form-item :label="$t('inspection.form.other_note')">
        <el-input type="textarea" v-model="inspectionReportDetails.otherNote" rows="3" />
      </el-form-item>

      <!-- Attachments -->
      <el-form-item v-if="false" prop="attachment" :label="$t('inspection.form.attachments')">
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FileUpload from '@/components/common/FileUpload.vue';
import { DATE_FORMAT } from '@/constants/application.js';
import {
  APPROVED_STATUS,
  INSPECT_DECISION_FAIL,
  INSPECT_DECISION_PASS,
  REJECTED_STATUS,
  WAIT_FOR_APPROVE
} from '@/constants/inspection.js';

const { t } = useI18n();

const props = defineProps({
  inspectionReportDetails: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  allowEdit: { type: Boolean, default: false }
});

const ruleFormRef = ref(null);
defineExpose({ ruleFormRef });

const handleSelectAttachments = (listFiles) => {
  props.inspectionReportDetails.attachment = listFiles || [];
};

const handleRemoveAttachments = (file) => {
  props.inspectionReportDetails.attachment = props.inspectionReportDetails.attachment.filter((f) => f.uid !== file.uid);
};
</script>

<style scoped>
.inspection-form {
  padding: 20px;
  background: #fff;
}
</style>