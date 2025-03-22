<template>
  <el-card class="construction-log">
    <el-form label-position="top" :model="form">
      <el-form-item label="Ảnh thi công">
        <ImageUpload
            @file-selected="handleSelectFiles"
            @file-removed="handleRemoveFile"
        />
      </el-form-item>
      <el-form-item label="Tệp đính kèm">
        <FileUpload
            :existingFiles="attachments"
            :allowedTypes="'.jpg,.png,.pdf,.docx'"
            :fileLimit="3"
            @file-selected="handleSelectAttachments"
        />
      </el-form-item>
      <el-form-item label="Mã nhật ký">
        <el-input v-model="form.logCode" disabled/>
      </el-form-item>

      <el-form-item label="Nhật ký ngày" required>
        <el-date-picker style="width: 100%" v-model="form.logDate" type="date" placeholder="Chọn ngày"/>
      </el-form-item>

      <el-form-item label="Tổ đội thi công">
        <el-input v-model="form.team" placeholder="Nhập tổ đội thi công"/>
      </el-form-item>

      <el-form-item label="Người theo dõi">
        <el-select v-model="form.observer" placeholder="Chọn người theo dõi">
          <el-option label="Nguyễn Văn A" value="Nguyễn Văn A"></el-option>
          <el-option label="Trần Thị B" value="Trần Thị B"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Thời tiết">
        <el-table :data="weatherData" border style="width: 100%">
          <el-table-column prop="time" label="" width="100">
            <template #default="{ row }">
              <strong>{{ row.time }}</strong>
            </template>
          </el-table-column>

          <el-table-column v-for="(col, index) in timesOfDay" :key="index" :label="col">
            <template #default="{ row }">
              <el-input v-model="row.values[index]" placeholder="Nhập dữ liệu" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="Công tác an toàn">
        <el-radio-group v-model="form.safety">
          <el-radio label="Tốt">Tốt</el-radio>
          <el-radio label="Trung bình">Trung bình</el-radio>
          <el-radio label="Kém">Kém</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Chất lượng thi công">
        <el-radio-group v-model="form.quality">
          <el-radio label="Tốt">Tốt</el-radio>
          <el-radio label="Trung bình">Trung bình</el-radio>
          <el-radio label="Kém">Kém</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Tiến độ thi công">
        <el-radio-group v-model="form.progress">
          <el-radio label="Tốt">Tốt</el-radio>
          <el-radio label="Trung bình">Trung bình</el-radio>
          <el-radio label="Kém">Kém</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Báo cáo sự cố">
        <el-input type="textarea" v-model="form.problem"/>
      </el-form-item>
      <el-form-item label="Đề xuất - kiến nghị">
        <el-input type="textarea" v-model="form.advice"/>
      </el-form-item>
      <el-form-item label="Ghi chú">
        <el-input type="textarea" v-model="form.note"/>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import {ref} from "vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import FileUpload from "@/components/common/FileUpload.vue";

const form = ref({
  logCode: "NK/0300/2025",
  logDate: "26/02/2025",
  team: "",
  observer: "",
  weather: {Sáng: "", Chiều: "", Tối: "", Đêm: ""},
  safety: "Tốt",
  quality: "Tốt",
  progress: "Tốt",
  problem: "",
  advice: "",
  note: "",
});
const timesOfDay = ref(["Sáng", "Chiều", "Tối", "Đêm"]);

const weatherData = ref([
  { time: "Điều kiện", values: ["", "", "", ""] },
  { time: "Nhiệt độ", values: ["", "", "", ""] },
]);
const listWorkingImages = ref([]);
const attachments = ref([]);

const handleSelectFiles = (listFiles) => {
  listWorkingImages.value = listFiles;
}
const handleSelectAttachments = (listFiles) => {
  attachments.value = listFiles;
}
const handleRemoveFile = (file) => {
  listWorkingImages.value = listWorkingImages.value.filter((f) => f.uid !== file.uid);
}
</script>

<style scoped>
.construction-log {
  padding: 20px;
  background: #fff;
}
</style>
