<template>
  <div class="custom-file-upload">
    <label for="fileInput" class="upload-label">
      {{$t('common.upload')}}
    </label>
    <input
        type="file"
        id="fileInput"
        @change="handleFileChange"
        :accept="allowedTypes"
        multiple
    />

    <div v-if="fileList.length" class="file-list">
      <div
          v-for="(file, index) in fileList"
          :key="index"
          class="file-item"
      >
        <span class="file-name">{{ file.name }}</span>
        <button class="remove-btn" @click="removeFile(index)">✖</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  allowedTypes: {
    type: String,
    default: ".jpg,.png,.pdf,.docx",
  },
  fileLimit: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(["file-selected"]);

const fileList = ref([]);

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);

  if (files.length + fileList.value.length > props.fileLimit) {
    alert(`You can only upload up to ${props.fileLimit} files.`);
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      fileList.value.push({ name: file.name, content: reader.result });
      emit("file-selected", fileList.value);
    };
    reader.readAsDataURL(file);
  });

  event.target.value = ""; // Reset file input to allow re-uploading the same file
};

const removeFile = (index) => {
  fileList.value.splice(index, 1);
  emit("file-selected", fileList.value);
};
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
  padding: 8px 16px;
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
}

.file-name {
  font-size: 14px;
  color: #333;
}

.remove-btn {
  color: #2b2929;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0px 2px;
  margin: 0 12px;
  border-radius: 3px;
}

.remove-btn:hover {
  background: #d3cfcf;
}
</style>
