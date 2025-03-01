 import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import userList from "@/pages/user/UserList.vue";

export const useUserStore = defineStore(
    "user",
    () => {
        const {t} = useI18n();
        const validation = reactive({ value: {} });
        const isShowModalConfirm = reactive({ value: false });
        const totalItems = reactive({ value: 0 });
        const currentPage = reactive({ value: 0 });
        const listUsers = reactive({ value: []});
        const userDetails = reactive({
            value: {
                id: 0,
                username: "",
                email: "",
                role: "",
                fullName: "",
                phone: "",
                gender: "",
                dob:""
            }
        });


        const getListUsers = async (params) => {
            mixinMethods.startLoading();
            await services.UserAPI.list(
                params,
                (response) => {
                    if (currentPage.value === 0) {
                        listUsers.value = response.data;
                    } else {
                        listUsers.value = [...listUsers.value, ...response.data];
                    }
                    totalItems.value = response.meta.total;
                    currentPage.value = response.meta.index;
                    mixinMethods.endLoading();
                },
                (error) => {
                    validation.value = mixinMethods.handleErrorResponse(
                        error.responseCode
                    );
                    mixinMethods.notifyError(t("response.message.get_user_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const getUserDetails = async (params) => {
            mixinMethods.startLoading();
            await services.UserAPI.details(
                params,
                (response) => {
                    userDetails.value = response.data;
                    mixinMethods.endLoading();
                },
                (error) => {
                    validation.value = mixinMethods.handleErrorResponse(
                        error.responseCode
                    );
                    mixinMethods.notifyError(t("response.message.get_user_dtls_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const saveCustomer = async (params, method) => {
            mixinMethods.startLoading();
            await services.UserAPI[method](
                params,
                (response) => {
                    userDetails.value = response.data;
                    mixinMethods.notifySuccess(t("response.message.save_user_success"));
                    mixinMethods.endLoading();
                },
                (error) => {
                    validation.value = mixinMethods.handleErrorResponse(
                        error.responseCode
                    );
                    mixinMethods.notifyError(t("response.message.save_user_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const handleDeleteUser = async (id) => {
            mixinMethods.startLoading();
            await services.UserAPI.deleteUser(
                {customerId: id},
                (response) => {
                    userDetails.value = response.data;
                    mixinMethods.notifySuccess(t("response.message.delete_user_success"));
                    mixinMethods.endLoading();
                },
                (error) => {
                    validation.value = mixinMethods.handleErrorResponse(
                        error.responseCode
                    );
                    mixinMethods.notifyError(t("response.message.delete_user_failed"));
                    mixinMethods.endLoading();
                }
            );
            isShowModalConfirm.value = false;
        }

        const clearUserDetails = () => {
            userDetails.value = {
                id: 0,
                username: "",
                email: "",
                role: "",
                fullName: "",
                phone: "",
                gender: "",
                dob:""
            };
        };

        return {
            validation,
            listUsers, // temporary
            totalItems,
            currentPage,
            userDetails,
            isShowModalConfirm,
            clearUserDetails,
            saveCustomer,
            getUserDetails,
            getListUsers,
            handleDeleteUser
        };
    }
);