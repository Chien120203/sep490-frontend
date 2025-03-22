<template>
  <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :on-change="handleFileChange"
      :on-remove="handleRemove"
      v-model:file-list="fileList"
      :limit="fileLimit"
      :disabled="disabled"
      :accept="allowedTypes"
  >
    <el-icon><IconPlus/></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><IconEye :fill="'#8f9ba5'"/></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><IconDownload :fill="'#8f9ba5'"/></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><IconTrash :fill="'#8f9ba5'"/></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog style="margin-top: 50vh !important" v-model="dialogVisible">
    <img class="img-preview" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from "vue";
import type { UploadFile } from "element-plus";
import IconPlus from "@/svg/IconPlus.vue";
import IconDownload from "@/svg/IconDownload.vue";
import IconTrash from "@/svg/IconTrash.vue";
import IconEye from "@/svg/IconEye.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  allowedTypes: {
    type: String,
    default: ".jpg,.png,.pdf,.docx",
  },
  fileLimit: {
    type: Number,
    default: 3,
  },
  existingFiles: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["file-selected", "file-removed"]);
const route = useRoute();
const isUpdate = computed(() => route.params.id);
const fileList = ref<UploadFile[]>(props.existingFiles || []);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleFileChange = (file: UploadFile, fileList: UploadFile[]) => {
  if (fileList.length > props.fileLimit) {
    alert(`You can only upload up to ${props.fileLimit} files.`);
    return;
  }
  emit("file-selected", fileList);
};

const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid);
  emit("file-removed", file);
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleDownload = (file: UploadFile) => {
  window.open(file.url, "_blank");
};
</script>

<style lang="scss" scoped>
.img-preview {
  width: 100%;
  height: 80%;
}
</style>
