
<template>
  <div class="custom-upload">
    <!-- File input button -->
    <label
        v-if="!disabled && fileList.length < (fileLimit ?? 3)"
        class="upload-button"
        for="file-input"
    >
      <el-icon><IconPlus /></el-icon>
      <input
          id="file-input"
          type="file"
          :accept="allowedTypes"
          multiple
          @change="onFileInputChange"
          style="display: none"
      />
    </label>

    <!-- File list as picture cards -->
    <div class="file-list">
      <div
          v-for="file in fileList"
          :key="file.uid"
          class="file-card"
      >
        <img
            v-if="file.url"
            :src="file.url"
            alt="file preview"
            class="file-thumbnail"
            @click="handlePictureCardPreview(file)"
        />
        <div class="file-actions">
          <span class="action-icon" @click="handlePictureCardPreview(file)">
            <el-icon><IconEye fill="#8f9ba5" /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="action-icon"
              @click="handleDownload(file)"
          >
            <el-icon><IconDownload fill="#8f9ba5" /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="action-icon"
              @click="handleRemove(file)"
          >
            <el-icon><IconTrash fill="#8f9ba5" /></el-icon>
          </span>
        </div>
      </div>
    </div>

    <!-- Preview dialog -->
    <el-dialog
        style="margin-top: 50vh !important"
        v-model="dialogVisible"
        width="50%"
    >
      <img class="img-preview" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch, onBeforeUnmount } from "vue";
import IconPlus from "@/svg/IconPlus.vue";
import IconDownload from "@/svg/IconDownload.vue";
import IconTrash from "@/svg/IconTrash.vue";
import IconEye from "@/svg/IconEye.vue";

export default {
  name: "CustomUpload",
  components: {
    IconPlus,
    IconDownload,
    IconTrash,
    IconEye,
  },
  props: {
    allowedTypes: {
      type: String,
      default: "",
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
  },
  emits: ["file-selected", "file-removed"],
  setup(props, { emit }) {
    const fileList = ref([]);
    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);

    // Convert Google Drive "view" URL to "thumbnail" URL
    const convertGoogleDriveUrl = (url) => {
      if (typeof url === "object" && url.url) return url.url;
      if (typeof url !== "string") return "";
      let match = url.match(/\/d\/(.*?)\/view/);
      if (match && match[1]) {
        const imageId = match[1];
        return `https://drive.google.com/thumbnail?id=${imageId}`;
      }
      match = url.match(/[?&]id=([^&]+)/);
      if (match && match[1]) {
        const imageId = match[1];
        return `https://drive.google.com/thumbnail?id=${imageId}`;
      }
      return url;
    };

    // Update fileList from existingFiles
    const updateFileList = (existingFiles) => {
      fileList.value = existingFiles.map((url, index) => ({
        name: `file_${index}`,
        url: convertGoogleDriveUrl(url),
        status: "success",
        uid: String(Date.now() + index),
        raw: undefined,
      }));
    };

    // Watch for existingFiles prop changes
    watch(
        () => props.existingFiles,
        (newVal) => {
          if (newVal && newVal.length > 0) {
            updateFileList(newVal);
          } else {
            fileList.value = [];
          }
        },
        { immediate: true }
    );

    // Handle local file input change
    const onFileInputChange = (event) => {
      const input = event.target;
      if (!input.files) return;
      const selectedFiles = Array.from(input.files);

      if (fileList.value.length + selectedFiles.length > (props.fileLimit ?? 3)) {
        alert(`You can only upload up to ${props.fileLimit} files.`);
        input.value = "";
        return;
      }

      const newFiles = selectedFiles.map((file) => {
        const url = URL.createObjectURL(file);
        return {
          name: file.name,
          raw: file,
          url,
          status: "success",
          uid: String(Date.now() + Math.random()),
        };
      });

      fileList.value = [...fileList.value, ...newFiles];
      emit("file-selected", fileList.value);
      input.value = "";
    };

    // Remove file (no revoke)
    const handleRemove = (file) => {
      fileList.value = fileList.value.filter((f) => f.uid !== file.uid);
      emit("file-removed", file);
    };

    const handlePictureCardPreview = (file) => {
      dialogImageUrl.value = file.url ?? "";
      dialogVisible.value = true;
    };

    const handleDownload = (file) => {
      if (file.url) {
        if (file.raw) {
          const link = document.createElement("a");
          link.href = file.url;
          link.download = file.name || "download";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(file.url, "_blank");
        }
      }
    };

    // No cleanup needed on unmount

    return {
      fileList,
      dialogImageUrl,
      dialogVisible,
      onFileInputChange,
      handleRemove,
      handlePictureCardPreview,
      handleDownload,
    };
  }
};
</script>

<style lang="scss" scoped>
.custom-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .upload-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 180px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    color: #8f9ba5;
    font-size: 28px;
    transition: border-color 0.3s;

    &:hover {
      border-color: rgba(197, 207, 216, 0.45);
      color: rgba(197, 207, 216, 0.45);
    }
  }

  .file-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .file-card {
      position: relative;
      width: 180px;
      height: 180px;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      overflow: hidden;
      background: #f5f7fa;
      cursor: pointer;

      .file-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .file-actions {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 6px;
        border-radius: 8px;
        padding: 4px 8px;
        pointer-events: auto;

        .action-icon {
          background: rgba(255, 253, 253, 0.12);
          border-radius: 50%;
          padding: 6px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background: rgba(133, 136, 143, 0.16);
            svg {
              fill: white !important;
            }
          }
        }
      }
    }
  }
}

.img-preview {
  width: 100%;
  height: 80%;
}
</style>