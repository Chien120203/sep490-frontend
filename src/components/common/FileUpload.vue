<template>
  <div class="custom-file-upload">
    <label for="fileInput" class="upload-label">
      {{ $t('common.upload') }}
    </label>
    <input
        type="file"
        id="fileInput"
        @change="handleFileChange"
        :accept="allowedTypes"
        multiple
    />

    <div v-if="fileList?.length" class="file-list">
      <div
          v-for="(file, index) in fileList"
          :key="index"
          class="file-item"
      >
        <span class="file-name">{{ file.name }}</span>
        <button type="button" class="remove-btn" @click="removeFile(index, file)">✖</button>
        <button v-if="isUpdate" class="download-btn" @click="downloadFile(file.webContentLink)">
          <IconDownload/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import IconDownload from "@/svg/IconDownload.vue";

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
});

const emit = defineEmits(["file-selected", "file-removed"]);
const route = useRoute();
const isUpdate = computed(() => route.params.id);
const fileList = computed(() => props.existingFiles || []);

const handleFileChange = (event) => {
  const files = [...event.target.files];

  if (files.length + fileList.value.length > props.fileLimit) {
    alert(`You can only upload up to ${props.fileLimit} files.`);
    return;
  }

  files.forEach((file) => {
    fileList.value.push(file);
  });

  event.target.value = "";
};

const removeFile = (index, file) => {
  fileList.value.splice(index, 1);
  emit("file-removed", file);
  emit("file-selected", fileList.value);
};

const downloadFile = (url) => {
  window.open(url, "_blank");
}

</script>

<style scoped>
.custom-file-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: Arial, sans-serif;
}

.upload-label {
  background-color: #3b3cac;
  color: white;
  width: 160px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  transition: 0.3s;
}

.upload-label:hover {
  background-color: #445d8e;
}

input[type="file"] {
  display: none;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f4f4;
  padding: 5px 10px;
  border-radius: 5px;
  min-width: 250px; /* Adjust based on your layout */
}

.file-name {
  font-size: 14px;
  color: #333;
  flex-grow: 1; /* Ensures the name takes up remaining space */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.download-btn, .remove-btn {
  flex-shrink: 0; /* Prevents shrinking */
  border: 0;
  text-decoration: none;
  font-size: 14px;
  color: #3b3cac;
  cursor: pointer;
  padding: 5px;
}

.download-btn:hover, .remove-btn:hover {
  color: #445d8e;
  background: #d3cfcf;
  border-radius: 3px;
}
</style>
