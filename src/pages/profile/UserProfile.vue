<template>
  <div class="profile-header">
    <h3 class="page__ttl">
      <span class="btn-back" @click="handleBack"><IconBackMain /></span>
      {{ $t('profile.details.title') }}
    </h3>
    <div class="profile-btn-detail">
      <div class="item">
        <el-button class="btn btn-save" @click="submitForm">
          {{ $t('common.save') }}
        </el-button>
      </div>
    </div>
  </div>
  <div class="profile-container">
    <!-- Left panel - Profile summary -->
    <div class="profile-card">
      <div class="profile-image-container">
        <ImageUpload
          :fileLimit="1"
          :existingFiles="userDetails.value.picProfile"
          @file-selected="handleSelectFiles"
          @file-removed="handleRemoveFile"
        />
      </div>
      <h2 class="profile-name">{{ userDetails.value.fullName }}</h2>

      <div class="profile-info">
        <div class="info-row">
          <div class="info-label">Mô tả</div>
        </div>
      </div>
    </div>

    <!-- Right panel - Detailed form -->
    <div class="profile-form">
      <!-- Navigation tabs -->
      <div class="nav-tabs">
        <div class="nav-tab active">{{ $t('profile.title') }}</div>
      </div>

      <!-- Active tab content -->
      <div class="tab-content">
        <h3 class="section-title"></h3>

        <el-form
            ref="ruleFormRef"
            :model="userDetails.value"
            :rules="USER_RULES"
            label-width="120px">
          <div class="form-grid">
            <el-form-item :label="$t('profile.details.username')" required>
              <el-input v-model="userDetails.value.username"></el-input>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.username"
              >{{ $t(validation.value.username) }}</label>
            </el-form-item>

            <el-form-item :label="$t('profile.details.fullName')" required>
              <el-input v-model="userDetails.value.fullName"></el-input>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.fullName"
              >{{ $t(validation.value.fullName) }}</label>
            </el-form-item>

            <el-form-item :label="$t('profile.details.email')">
              <el-input v-model="userDetails.value.email" type="email"></el-input>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.email"
              >{{ $t(validation.value.email) }}</label>
            </el-form-item>

            <el-form-item :label="$t('profile.details.phone')">
              <el-input v-model="userDetails.value.phone"></el-input>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.phone"
              >{{ $t(validation.value.phone) }}</label>
            </el-form-item>

            <el-form-item :label="$t('profile.details.gender')">
              <el-select v-model="userDetails.value.gender">
                <el-option label="Male" :value="true"></el-option>
                <el-option label="Female" :value="false"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
                :label="$t('user.details.dob')"
                prop="dob"
            >
              <el-date-picker
                  style="width: 90%"
                  :format="DATE_FORMAT"
                  :value-format="DATE_FORMAT"
                  v-model="userDetails.value.dob"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation.value && validation.value.dob"
              >{{ $t(validation.value.dob) }}</label>
            </el-form-item>

            <el-form-item :label="$t('profile.details.address')">
              <el-input v-model="userDetails.value.address"></el-input>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.address"
              >{{ $t(validation.value.address) }}</label>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';
import IconBackMain from "@/svg/IconBackMain.vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import { useUserStore } from "@/store/user.js";
import {USER_RULES} from "@/rules/user/index.js";
import {DATE_FORMAT} from "@/constants/application.js";
import FileUpload from "@/components/common/FileUpload.vue";

export default {
  components: {FileUpload, ImageUpload, IconBackMain },
  setup() {
    const userStore = useUserStore();

    const {
      userDetails,
      validation,
      getUserDetails,
      updateUserProfile,
    } = userStore;

    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const ruleFormRef = ref(null);
    const isCreateMode = ref(false);

    onMounted(async () => {
      await getUserDetails({userId: localStorage.getItem("userId")});
    });

    const handleBack = () => {
      router.push({ name: PAGE_NAME.HOME });
    };

    const handleSelectFiles = (listFiles) => {
      userDetails.value.picProfile = listFiles;
    }

    const handleRemoveFile = (file) => {
      userDetails.value.picProfile = userDetails.value.filter((f) => f.uid !== file.uid);
    }

    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          updateUserProfile(userDetails.value);
        }
      });
    };

    return {
      USER_RULES,
      DATE_FORMAT,
      ruleFormRef,
      handleBack,
      submitForm,
      route,
      isCreateMode,
      getUserDetails,
      handleSelectFiles,
      handleRemoveFile,
      userDetails,
      validation
    };
  },
};
</script>

<style scoped>
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.profile-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

.profile-card {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  width: 30%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image-container {
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
}

.profile-info {
  width: 100%;
}

.info-row {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 12px 0;
  width: 100%;
}

.info-label {
  font-weight: 500;
  width: 40%;
}

.profile-form {
  background-color: white;
  border-radius: 4px;
  padding: 0;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-tabs {
  display: flex;
  border-bottom: 2px solid #eee;
}

.nav-tab {
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 500;
}

.nav-tab.active {
  color: #00a389;
  border-bottom: 2px solid #00a389;
  margin-bottom: -2px;
}

.tab-content {
  padding: 20px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: #555;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.profile-image-upload {
  position: relative;
  width: 150px;
  height: 150px;
}

.profile-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #ddd;
}

.edit-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.profile-btn-detail {
  display: flex;
  align-items: center;

  .btn {
    border: 1px solid #3b5a9a;
    background: #e8eafb;
    color: #3b5a9a;
    line-height: 4px;
    width: 124px;
    height: 37px;

    &-save {
      background: #5a6acf;
      border: 1px solid #3c4ec0;
      color: #fff;
    }
  }

  .item {
    display: flex;
  }
}

.profile-btn-detail {
  margin-left: auto;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-card {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>