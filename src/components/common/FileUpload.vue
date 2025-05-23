<template>
  <div class="custom-file-upload">
    <label :for="inputId" class="upload-label">
      {{ message || $t('common.upload') }}
    </label>
    <label>({{ allowedTypes }})</label>
    <input
        type="file"
        :id="inputId"
        :disabled="disabled"
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
        <span class="file-name">{{ file.Name || file.name }}</span>
        <button :disabled="disabled" type="button" class="remove-btn" @click="removeFile(index, file)">✖</button>
        <button v-if="isUpdate" class="download-btn" @click="downloadFile(file.WebContentLink)">
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
  message: {
    type: String,
    default: "",
  },
  existingFiles: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoRemove: {
    type: Boolean,
    default: false,
  },
  componentId: {
    type: String,
    default: "default"
  }
});

// Create a unique ID for the file input element based on componentId
const inputId = computed(() => `fileInput_${props.componentId}`);

const emit = defineEmits(["file-selected", "file-removed"]);
const route = useRoute();
const isUpdate = computed(() => route.params.id);
const fileList = computed(() => props.existingFiles || []);

const handleFileChange = (event) => {
  const files = [...event.target.files];

  // Validate file types
  const allowedTypesArray = props.allowedTypes.split(',');
  const invalidFiles = files.filter(file => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return !allowedTypesArray.includes(extension);
  });

  if (invalidFiles.length > 0) {
    const fileNames = invalidFiles.map(f => f.name).join(', ');
    alert(`Invalid file type(s): ${fileNames}\nAllowed types: ${props.allowedTypes}`);
    event.target.value = "";
    return;
  }

  if (props.autoRemove) {
    // Remove all existing files first
    const removedFiles = [...fileList.value];
    fileList.value.length = 0;

    // Emit removed files
    removedFiles.forEach(file => {
      emit("file-removed", file);
    });
  }

  if (!props.autoRemove && files.length + fileList.value.length > props.fileLimit) {
    alert(`You can only upload up to ${props.fileLimit} files.`);
    return;
  } else if (props.autoRemove && files.length > props.fileLimit) {
    alert(`You can only upload up to ${props.fileLimit} files.`);
    return;
  }

  files.forEach((file) => {
    fileList.value.push(file);
  });

  event.target.value = "";
  emit("file-selected", fileList.value);
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
