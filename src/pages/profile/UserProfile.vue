<template>
  <div class="profile-header">
    <h3 class="page__ttl">
      <span class="btn-back" @click="handleBack"><IconBackMain /></span>
      {{ isCreateMode ? $t('profile.create.title') : $t('profile.details.title') }}
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
        <img :src="userDetails.profileImage" alt="Profile picture" class="profile-image" />
      </div>
      <h2 class="profile-name">{{ userDetails.fullName }}</h2>

      <div class="profile-info">
        <div class="info-row">
          <div >Hồ sơ của tôi</div>
          <div >Thiết lập chữ ký</div>
        </div>
      </div>
    </div>

    <!-- Right panel - Detailed form -->
    <div class="profile-form">
      <!-- Navigation tabs -->
      <div class="nav-tabs">
        <div class="nav-tab active">Hồ sơ của tôi</div>
        <div class="nav-tab">Thiết lập chữ ký</div>
        <div class="nav-tab">Thiết lập kết nối Email</div>
        <div class="nav-tab">Thiết lập thông báo</div>
        <div class="nav-tab">Thiết lập tiêu điểm</div>
      </div>

      <!-- Active tab content -->
      <div class="tab-content">
        <h3 class="section-title"></h3>

        <el-form label-width="120px">
          <div class="form-grid">
            <el-form-item label="UserName" required>
              <el-input v-model="userDetails.username"></el-input>
            </el-form-item>

            <el-form-item label="Role" required>
              <el-input v-model="userDetails.role"></el-input>
            </el-form-item>

            <el-form-item label="Họ tên" required>
              <el-input v-model="userDetails.fullName"></el-input>
            </el-form-item>

            <el-form-item label="Email">
              <el-input v-model="userDetails.email" type="email"></el-input>
            </el-form-item>

            <el-form-item label="Số điện thoại">
              <el-input v-model="userDetails.phone"></el-input>
            </el-form-item>


            <el-form-item label="Giới tính">
              <el-select v-model="userDetails.gender">
                <el-option label="Nam" value="Nam"></el-option>
                <el-option label="Nữ" value="Nữ"></el-option>
                <el-option label="Khác" value="Khác"></el-option>
              </el-select>
            </el-form-item>

          </div>

          <el-form-item label="Ảnh đại diện">
            <div class="profile-image-upload">
              <img :src="userDetails.profileImage" alt="Profile picture" class="profile-image-preview" />
              <div class="edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';
import IconBackMain from "@/svg/IconBackMain.vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {useUserStore} from "@/store/user.js";

export default {
  components: {ImageUpload, IconBackMain },
  setup() {
    const userStore = useUserStore();
    const {
      userDetails,
      getUserDetails,
    } = userStore;

    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const ruleFormRef = ref(null);
    const isCreateMode = ref(false);

    onMounted(async () => {
      getUserDetails({userId: route.params.id})
    });


    const handleBack = () => {
      router.push({ name: PAGE_NAME.HOME });
    };


    const submitForm = () => {
    };

    return {
      ruleFormRef,
      handleBack,
      submitForm,
      route,
      isCreateMode,
      getUserDetails,
      userDetails
    };
  },
};
</script>

<style scoped>
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
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
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

.info-value {
  width: 60%;
  text-align: right;
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

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.required {
  color: red;
}

.form-input, .form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
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