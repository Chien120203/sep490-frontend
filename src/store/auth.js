import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import services from "@/plugins/services";
import PAGE_NAME from "@/constants/route-name.js";
import {usePersistenceStore} from "@/store/persistence.js";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const persist = usePersistenceStore();
    const {loggedIn} = persist;
    const {t} = useI18n();
    const isShowModal = reactive({value: false});
    const resetPasswordForm = reactive({
      value: {
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      },
    });
    const loadingButton = reactive({value: false});
    const loadingSaveButton = reactive({value: false});
    const validation = reactive({value: {}});
    const router = useRouter();

    const handleLogin = async (params) => {
      mixinMethods.startLoading();
      await services.AuthenticationAPI.login(
        params,
        (response) => {
          loggedIn.value = true;
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('isVerify', response.data.isVerify);
          validation.value = {};

          router.push({name: PAGE_NAME.HOME});

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.login_fail"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleLogout = () => {
      loggedIn.value = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isVerify");
        mixinMethods.notifySuccess(t("response.message.logout_success"));
      router.push({name: PAGE_NAME.LOGIN});
    };


    const getOTPCode = async (sentEmail) => {
      loadingButton.value = true;
      await services.AuthenticationAPI.getOTP(
        {
          email: sentEmail,
          type: "reset_password_email",
          subject: "Reset Password OTP",
        },
        (response) => {
          if (response.success) {
            mixinMethods.notifySuccess(t("response.message.get_otp_success"));
          }
          validation.value = {};
          loadingButton.value = false;
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(
            error.responseCode
          );
          mixinMethods.notifyError(t("response.message.get_otp_failed"));
          loadingButton.value = false;
        }
      );
    };

    const resetNewPassword = async () => {
      loadingSaveButton.value = true;
      await services.AuthenticationAPI.resetPassword(
        {
          email: resetPasswordForm.value.email,
          otpCode: resetPasswordForm.value.otp,
          newPassword: resetPasswordForm.value.confirmPassword,
        },
        (response) => {
          if (response.success) {
            mixinMethods.notifySuccess(
              t("response.message.reset_password_success")
            );
          }
          validation.value = {};
          isShowModal.value = false;
          loadingSaveButton.value = false;
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(
            error.responseCode
          );
          loadingSaveButton.value = false;
          mixinMethods.notifyError(t("response.message.reset_password_failed"));
        }
      );
    };

    return {
      validation,
      loadingButton,
      resetPasswordForm,
      loadingSaveButton,
      isShowModal,
      getOTPCode,
      handleLogin,
      handleLogout,
      resetNewPassword
    };
  }
);
