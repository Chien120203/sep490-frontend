<template>
  <div class="login">
    <div class="login-screen">
      <div class="login-item">
        <div class="login-icon">
            <img src="@/assets/image-removebg-preview.png" alt="logo" />
        </div>
        <div class="login-language">
          <button
              @click="changeLocale(VI_LOCALE)"
              :class="{
              'btn-language active': selectedLanguage.value === VI_LOCALE,
              'btn-language': selectedLanguage.value !== VI_LOCALE,
            }"
          >
            Tiếng Việt
          </button>
          <button
              @click="changeLocale(EN_LOCALE)"
              :class="{
              'btn-language active': selectedLanguage.value === EN_LOCALE,
              'btn-language': selectedLanguage.value !== EN_LOCALE,
            }"
          >
            English
          </button>
        </div>
        <div class="login-form-container">
          <Form
              class="login-form"
              @submit="handleSubmit"
              :validation-schema="validate"
          >
            <div class="form-group">
              <p class="login_label">{{ $t("common.username") }}</p>
              <Field
                  name="username"
                  type="text"
                  class="form-control login-field"
                  :placeholder="$t('common.username')"
                  v-model="dataRequest.username"
                  maxlength="50"
                  id="login-name"
              />
              <ErrorMessage name="username" class="error-feedback" as="p" />
              <p v-if="validation.value.username" class="error-feedback">
                {{
                  $t(
                      validation.value.username.code,
                      validation.value.username.options
                  )
                }}
              </p>
            </div>
            <div class="form-group">
              <p class="login_label">{{ $t("common.password") }}</p>
              <Field
                  name="password"
                  type="password"
                  class="form-control login-field"
                  :placeholder="$t('common.password')"
                  v-model="dataRequest.password"
                  maxlength="50"
                  id="login-pass"
              />
              <ErrorMessage name="password" class="error-feedback" as="p" />
              <p v-if="validation.value.password" class="error-feedback">
                {{
                  $t(
                      validation.value.password.code,
                      validation.value.password.options
                  )
                }}
              </p>
            </div>
            <div class="form-group forgot-password">
              <!-- Forgot password styled as orange and aligned right -->
              <a @click="openResetPassModal()" href="#" class="forgot-password-link">
                <span>{{ $t("common.forgot_password") }}</span>
              </a>
            </div>

            <button
                class="btn btn-primary btn-block js--btn-login"
                :disabled="disabledSubmit"
            >
              {{ $t("common.btn_login") }}
            </button>
          </Form>
        </div>
      </div>
    </div>
    <Modal
        :show="isShowModal.value"
        :width="'60%'"
        :isShowFooter="false"
        @close="handleCloseModal"
    >
      <template #body>
        <el-form :model="resetPasswordForm.value" label-width="18%">
          <el-form-item :label="$t('user.label_email')">
            <div class="input-button-group">
              <el-input
                  v-model="resetPasswordForm.value.email"
                  :placeholder="$t('user.placeholder_email')"
              ></el-input>
              <el-button
                  :loading="loadingButton.value"
                  class="btn btn-save"
                  @click="getOtpCode()"
              >{{ $t("common.get_otp") }}</el-button>
            </div>
            <p v-if="validation.value.email" class="error-feedback">
              {{
                $t(validation.value.email.code, validation.value.email.options)
              }}
            </p>
          </el-form-item>

          <el-form-item :label="$t('user.label_otp')">
            <el-input
                v-model="resetPasswordForm.value.otp"
                :placeholder="$t('user.placeholder_otp')"
            ></el-input>
            <p v-if="validation.value.otpCode" class="error-feedback">
              {{
                $t(
                    validation.value.otpCode.code,
                    validation.value.otpCode.options
                )
              }}
            </p>
          </el-form-item>

          <el-form-item :label="$t('user.label_new_password')">
            <el-input
                type="password"
                v-model="resetPasswordForm.value.newPassword"
                :placeholder="$t('user.placeholder_new_password')"
            ></el-input>
            <p v-if="validation.value.newPassword" class="error-feedback">
              {{
                $t(
                    validation.value.newPassword.code,
                    validation.value.newPassword.options
                )
              }}
            </p>
          </el-form-item>

          <el-form-item :label="$t('user.label_confirmed_password')">
            <el-input
                type="password"
                v-model="resetPasswordForm.value.confirmPassword"
                :placeholder="$t('user.placeholder_confirmed_password')"
            ></el-input>
            <p v-if="validation.value.confirmPassword" class="error-feedback">
              {{
                $t(
                    validation.value.confirmPassword.code,
                    validation.value.confirmPassword.options
                )
              }}
            </p>
          </el-form-item>

          <el-form-item class="confirm-button">
            <el-button
                :loading="loadingSaveButton.value"
                class="btn btn-save"
                @click="resetPassword"
            >{{ $t("common.save") }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { VI_LOCALE, EN_LOCALE } from "@/constants/application";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/auth.js";
import { $globalLocale } from "@/utils/variables";
import { i18n } from "@/utils/i18n";
import Modal from "@/components/common/Modal.vue";

export default {
  name: "Login",
  components: { Form, Field, ErrorMessage, Modal },
  setup() {
    const {t} = useI18n();
    const authStore = useAuthStore();
    const {
      loadingButton,
      loadingSaveButton,
      handleLogin,
      validation,
      getOTPCode,
      resetNewPassword,
      resetPasswordForm,
      isShowModal,
    } = authStore;
    const selectedLanguage = ref(localStorage.getItem('CurrentLanguage') || EN_LOCALE);
    const dataRequest = ref({
      username: "",
      password: "",
    });

    const validate = computed(() => {
      return yup.object().shape({
        username: yup
            .string()
            .trim()
            .required(t("E-CM-002", {item: t("common.username")})),
        password: yup
            .string()
            .trim()
            .required(t("E-CM-002", {item: t("common.password")})),
      });
    });

    const disabledSubmit = computed(() => {
      return (
          !dataRequest.value.username.trim() || !dataRequest.value.password.trim()
      );
    });

    onMounted(() => {
      handleCloseModal();
    });

    const changeLocale = (val) => {
      selectedLanguage.value = val;
      // Save the new language in cookies
      localStorage.setItem("CurrentLanguage", val);
      i18n.global.locale.value = val;
      $globalLocale.update(val);
    };

    const openResetPassModal = () => {
      isShowModal.value = true;
    };

    // Lưu thông tin đăng nhập vào localStorage sau khi đăng nhập thành công
    const handleSubmit = (user) => {
      handleLogin(user);
    };

    const getOtpCode = () => {
      getOTPCode(resetPasswordForm.value.email);
    };

    const resetPassword = async () => {
      // Validate that passwords match and the form is complete
      if (
          resetPasswordForm.value.newPassword !==
          resetPasswordForm.value.confirmPassword
      ) {
        validation.value.confirmPassword = {};
        validation.value.confirmPassword.code = "E-CM-005";
        validation.value.confirmPassword.options = {};
        return;
      }
      await resetNewPassword();
    };

    const handleCloseModal = () => {
      isShowModal.value = false;
      validation.value = {};
      resetPasswordForm.value = {};
    };

    return {
      selectedLanguage,
      resetPasswordForm,
      VI_LOCALE,
      EN_LOCALE,
      dataRequest,
      validate,
      validation,
      disabledSubmit,
      changeLocale,
      handleSubmit,
      isShowModal,
      openResetPassModal,
      resetPassword,
      getOtpCode,
      loadingButton,
      loadingSaveButton,
      handleCloseModal
    };
  },
};
</script>

<style scoped>
.js--btn-login {
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.forgot-password-link {
  color: #3C4EC0;
  text-align: right;
  display: block;
}
</style>

