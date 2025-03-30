<template>
  <div class="user-block">
    <div class="user user-create user-detail">
      <div class="user-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t("user.details.title") : $t("user.create.title")
          }}
        </h3>
        <div class="user-btn-detail">
          <div class="item">
            <el-button class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="user-body mt-0">
        <el-form
            ref="ruleFormRef"
            :model="userDetails.value"
            :rules="USER_RULES"
            class="form-search-box"
        >
          <div class="item item-bib-add">
            <el-form-item
                prop="username"
                class="custom-textarea required"
                :label="$t('user.details.username')"
            >
              <el-input v-model="userDetails.value.username"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.username"
              >{{ $t(validation.value.username) }}</label>
            </el-form-item>

            <el-form-item
                prop="fullName"
                class="custom-textarea required"
                :label="$t('user.details.fullName')"
            >
              <el-input v-model="userDetails.value.fullName"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.fullName"
              >{{ $t(validation.value.fullName) }}</label>
            </el-form-item>

            <el-form-item
                prop="email"
                class="custom-textarea required"
                :label="$t('user.details.email')"
            >
              <el-input v-model="userDetails.value.email"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.email"
              >{{ $t(validation.value.email) }}</label>
            </el-form-item>

            <el-form-item
                :label="$t('user.details.dob')"
                prop="dob"
            >
              <el-date-picker
                  v-model="userDetails.value.dob"
                  type="date"
                  placeholder="Select Date"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation.value && validation.value.dob"
              >{{ $t(validation.value.dob) }}</label>
            </el-form-item>
          </div>

          <div class="item item-bib-add item-user-add">
            <el-form-item
                prop="gender"
                class="custom-textarea required"
                :label="$t('user.details.gender')"
            >
              <el-input v-model="genderDisplay"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.gender"
              >{{ $t(validation.value.gender) }}</label>
            </el-form-item>

            <el-form-item
                prop="role"
                class="custom-textarea required"
                :label="$t('user.details.role')"
            >
              <el-input v-model="userDetails.value.role"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.role"
              >{{ $t(validation.value.role) }}</label>
            </el-form-item>

            <el-form-item
                prop="phone"
                class="custom-textarea required"
                :label="$t('user.details.phone')"
            >
              <el-input v-model="userDetails.value.phone"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.phone"
              >{{ $t(validation.value.phone) }}</label>
            </el-form-item>

            <el-form-item
                prop="description"
                class="custom-textarea"
                :label="$t('user.details.description')"
            >
              <el-input
                  v-model="userDetails.value.description"
                  class="custom-textarea"
                  type="textarea"
                  :rows="4"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation.value && validation.value.description"
              >
                {{ $t(validation.value.description) }}
              </label>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted,onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import {USER_RULES} from "@/rules/user/index.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {useUserStore} from "@/store/user.js";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  components: {IconBackMain, SingleOptionSelect},
  setup() {
    const userStore = useUserStore();
    const {
      userDetails,
      validation,
      getUserDetails,
      saveUser,
      clearUserDetails
    } = userStore;
    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const router = useRouter();

    onMounted(() => {
      if(isUpdate.value) {
        getUserDetails({userId: route.params.id})
      }
    });

    onUnmounted(() => {
      clearUserDetails();
    });

    const handleBack = () => {
      router.push({name: PAGE_NAME.USER.LIST});
    };

    const ruleFormRef = ref(null);

    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          let method = isUpdate.value ? "update" : "create";
          saveUser(userDetails.value, method);
        }
      });
    };

    const genderDisplay = computed({
      get() {
        return userDetails.value.gender ? 'male' : 'female';
      },
      set(value) {
        userDetails.value.gender = value === 'male';
      }
    });

    return {
      USER_RULES,
      ruleFormRef,
      userDetails,
      isUpdate,
      validation,
      handleBack,
      submitForm,
      genderDisplay,
    };
  },
};
</script>
<style lang="scss" scoped>
.error-feedback-user {
  display: block;
  color: red;
  text-align: left;
  font-size: 12px;
  margin-top: 5px;
}

.btn-cancel {
  border: 1px solid #3b5a9a !important;
  background: #e8eafb !important;
  color: #3b5a9a !important;
  border-radius: 4px;
}

.mt-0 {
  margin-top: 0 !important;
}

.item__title {
  line-height: 1.88;
}

.user-btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;

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

.user-preview {
  resize: horizontal;
  overflow: auto;
  direction: rtl;
  padding: 20px;
  min-width: 35%;
  max-width: 50%;
}
</style>

<style>
.item-user-add {
  padding: 0 8px;
}

.user-body .form-search-box .el-select,
.user-body .form-search-box .el-form-item__content {
  justify-content: space-between;
  font-size: 16px;
  line-height: 21px;
}
</style>