<template>
  <el-card class="construction-log">
    <el-form :disabled="!allowEdit" label-position="top" :model="logDetails" ref="ruleFormRef" :rules="rules">
      <el-form-item :label="$t('construct_log.form.images')">
        <ImageUpload
            :fileLimit="3"
            :existingFiles="logDetails.images"
            @file-selected="handleSelectFiles"
            @file-removed="handleRemoveFile"
        />
      </el-form-item>
      <el-form-item v-if="false" :label="$t('construct_log.form.attachments')">
        <FileUpload
            :existingFiles="logDetails.attachmentFiles"
            :allowedTypes="'.jpg,.png,.pdf,.docx'"
            :fileLimit="3"
            @file-selected="handleSelectAttachments"
            @file-removed="handleRemoveAttachments"
        />
      </el-form-item>
      <el-form-item :label="$t('construct_log.form.log_code')">
        <el-input v-model="logDetails.logCode" disabled />
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.log_name')" prop="logName">
        <el-input v-model="logDetails.logName" required />
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.log_date')" required prop="logDate">
        <el-date-picker
            style="width: 100%"
            disabled
            v-model="logDetails.logDate"
            :format="DATE_FORMAT"
            :value-format="DATE_FORMAT"
            type="date"
            :placeholder="$t('construct_log.form.enter_date')"
        />
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.status')" required prop="status">
        <el-select disabled v-model="logDetails.status">
          <el-option
              v-for="(label, index) in LIST_LOG_STATUSES"
              :key="index"
              :label="$t(label)"
              :value="index"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.weather')">
        <el-table :data="logDetails.weather" border style="width: 100%">
          <el-table-column prop="time" :label="$t('construct_log.form.weather_time')" width="100">
            <template #default="{ row }">
              <strong>{{ row.type }}</strong>
            </template>
          </el-table-column>

          <el-table-column v-for="(col, index) in timesOfDay" :key="index" :label="$t(col)">
            <template #default="{ row }">
              <el-input v-model="row.values[index]" :placeholder="$t('construct_log.form.enter_weather_data')" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.safety')" prop="safety">
        <el-radio-group v-model="logDetails.safety">
          <el-radio :label="$t('construct_log.form.condition.good')" :value="String(GOOD_CONDITION)">{{ $t('construct_log.form.condition.good') }}</el-radio>
          <el-radio :label="$t('construct_log.form.condition.medium')" :value="String(MEDIUM_CONDITION)">{{ $t('construct_log.form.condition.medium') }}</el-radio>
          <el-radio :label="$t('construct_log.form.condition.bad')" :value="String(BAD_CONDITION)">{{ $t('construct_log.form.condition.bad') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.quality')" prop="quality">
        <el-radio-group v-model="logDetails.quality">
          <el-radio :label="$t('construct_log.form.condition.good')" :value="String(GOOD_CONDITION)">{{ $t('construct_log.form.condition.good') }}</el-radio>
          <el-radio :label="$t('construct_log.form.condition.medium')" :value="String(MEDIUM_CONDITION)">{{ $t('construct_log.form.condition.medium') }}</el-radio>
          <el-radio :label="$t('construct_log.form.condition.bad')" :value="String(BAD_CONDITION)">{{ $t('construct_log.form.condition.bad') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('construct_log.form.progress')" prop="progress">
        <el-radio-group v-model="logDetails.progress">
          <el-radio :label="$t('construct_log.form.condition.good')" :value="String(GOOD_CONDITION)">{{ $t('construct_log.form.condition.good') }}</el-radio>
          <el-radio :label="$t('construct_log.form.condition.medium')" :value="String(MEDIUM_CONDITION)">{{ $t('construct_log.form.condition.medium') }}</el-radio>
          <el-radio :label="$t('construct_log.form.condition.bad')" :value="String(BAD_CONDITION)">{{ $t('construct_log.form.condition.bad') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('construct_log.form.problem')" prop="problem">
        <el-input type="textarea" v-model="logDetails.problem" />
      </el-form-item>
      <el-form-item :label="$t('construct_log.form.advice')" prop="advice">
        <el-input type="textarea" v-model="logDetails.advice" />
      </el-form-item>
      <el-form-item :label="$t('construct_log.form.note')" prop="note">
        <el-input type="textarea" v-model="logDetails.note" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ImageUpload from '@/components/common/ImageUpload.vue';
import FileUpload from '@/components/common/FileUpload.vue';
import { BAD_CONDITION, GOOD_CONDITION, LIST_LOG_STATUSES, MEDIUM_CONDITION } from '@/constants/construct-log.js';
import { DATE_FORMAT } from '@/constants/application.js';

const { t } = useI18n();

const props = defineProps({
  logDetails: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  allowEdit: { type: Boolean, default: false }
});

const timesOfDay = ref([
  'construct_log.form.weather_morning',
  'construct_log.form.weather_afternoon',
  'construct_log.form.weather_evening',
  'construct_log.form.weather_night'
]);
const ruleFormRef = ref(null);
defineExpose({ ruleFormRef });

const handleSelectAttachments = (listFiles) => {
  props.logDetails.attachmentFiles = listFiles || [];
};

const handleSelectFiles = (listFiles) => {
  props.logDetails.images = listFiles;
};

const handleRemoveFile = (file) => {
  // props.logDetails.images = props.logDetails.images.filter((f) => f.uid !== file.uid);
};

const handleRemoveAttachments = (file) => {
  props.logDetails.attachmentFiles = props.logDetails.attachmentFiles.filter((f) => f.uid !== file.uid);
};
</script>

<style scoped>
.construction-log {
  padding: 20px;
  background: #fff;
}
</style>