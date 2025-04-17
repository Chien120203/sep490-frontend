<template>
  <el-card class="construction-log">
    <el-form label-position="top" :model="logDetails" ref="ruleFormRef" :rules="rules">
      <el-form-item label="Ảnh thi công">
        <ImageUpload
            :existingFiles="logDetails.images"
            @file-selected="handleSelectFiles"
            @file-removed="handleRemoveFile"
        />
      </el-form-item>
      <el-form-item label="Tệp đính kèm">
        <FileUpload
            :existingFiles="logDetails.attachmentFiles"
            :allowedTypes="'.jpg,.png,.pdf,.docx'"
            :fileLimit="3"
            @file-selected="handleSelectAttachments"
            @file-removed="handleRemoveAttachments"
        />
      </el-form-item>
      <el-form-item label="Mã nhật ký">
        <el-input v-model="logDetails.logCode" disabled/>
      </el-form-item>

      <el-form-item label="Tên nhật ký" prop="logName">
        <el-input v-model="logDetails.logName" required/>
      </el-form-item>

      <el-form-item label="Nhật ký ngày" required prop="logDate">
        <el-date-picker style="width: 100%" v-model="logDetails.logDate" :format="DATE_FORMAT" :value-format="DATE_FORMAT" type="date" placeholder="Chọn ngày"/>
      </el-form-item>

      <el-form-item label="Thời tiết">
        <el-table :data="logDetails.weather" border style="width: 100%">
          <el-table-column prop="time" label="" width="100">
            <template #default="{ row }">
              <strong>{{ row.type }}</strong>
            </template>
          </el-table-column>

          <el-table-column v-for="(col, index) in timesOfDay" :key="index" :label="col">
            <template #default="{ row }">
              <el-input v-model="row.values[index]" placeholder="Nhập dữ liệu" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="Công tác an toàn" prop="safety">
        <el-radio-group v-model="logDetails.safety">
          <el-radio label="Tốt" :value="GOOD_CONDITION">Tốt</el-radio>
          <el-radio label="Trung bình" :value="MEDIUM_CONDITION">Trung bình</el-radio>
          <el-radio label="Kém" :value="BAD_CONDITION">Kém</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Chất lượng thi công" prop="quality">
        <el-radio-group v-model="logDetails.quality">
          <el-radio label="Tốt" :value="GOOD_CONDITION">Tốt</el-radio>
          <el-radio label="Trung bình" :value="MEDIUM_CONDITION">Trung bình</el-radio>
          <el-radio label="Kém" :value="BAD_CONDITION">Kém</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Tiến độ thi công" prop="progress">
        <el-radio-group v-model="logDetails.progress">
          <el-radio label="Tốt" :value="GOOD_CONDITION">Tốt</el-radio>
          <el-radio label="Trung bình" :value="MEDIUM_CONDITION">Trung bình</el-radio>
          <el-radio label="Kém" :value="BAD_CONDITION">Kém</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Báo cáo sự cố">
        <el-input type="textarea" v-model="logDetails.problem"/>
      </el-form-item>
      <el-form-item label="Đề xuất - kiến nghị">
        <el-input type="textarea" v-model="logDetails.advice"/>
      </el-form-item>
      <el-form-item label="Ghi chú">
        <el-input type="textarea" v-model="logDetails.note"/>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import {ref} from "vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import FileUpload from "@/components/common/FileUpload.vue";
import {BAD_CONDITION, GOOD_CONDITION, MEDIUM_CONDITION} from "@/constants/construct-log.js";
import {DATE_FORMAT} from "@/constants/application.js";

const props = defineProps({
  logDetails: {
    type: Object,
    default: () => {
    }
  },
  rules: {
    type: Object,
    default: () => {
    }
  }
});
const timesOfDay = ref(["Sáng", "Chiều", "Tối", "Đêm"]);
const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const handleSelectFiles = (listFiles) => {
  props.logDetails.images = listFiles.map(item => item.raw);
}
const handleSelectAttachments = (listFiles) => {
  props.logDetails.attachmentFiles = listFiles || [];
}
const handleRemoveFile = (file) => {
  props.logDetails.images =  props.logDetails.images.filter((f) => f.uid !== file.uid);
}
const handleRemoveAttachments = (file) => {
  props.logDetails.attachmentFiles = props.logDetails.attachmentFiles.filter((f) => f.uid !== file.uid);
}

</script>

<style scoped>
.construction-log {
  padding: 20px;
  background: #fff;
}
</style>
