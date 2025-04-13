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
        const validation = reactive({value: {}});
        const loadingSaveButton = reactive({value: false});
        const isShowModalConfirm = reactive({value: false});
        const totalItems = reactive({value: 0});
        const currentPage = reactive({value: 1});
        const listUsers = reactive({value: []});
        const userDetails = reactive({
            value: {
                id: 0,
                username: "",
                email: "",
                role: "",
                fullName: "",
                phone: "",
                gender: "",
                dob: ""
            }
        });
        const userProfileDetails = reactive({
            value: {
                id: 0,
                username: "",
                email: "",
                role: "",
                fullName: "",
                phone: "",
                gender: "",
                dob: "",
                picProfile: []
            }
        });

        const getListUsers = async (params, isLoading = true) => {
            if (isLoading) mixinMethods.startLoading();
            await services.UserAPI.list(
                params,
                (response) => {
                    if (currentPage.value === 1) {
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

        const saveUser = async (params, method) => {
            mixinMethods.startLoading();
            await services.UserAPI[method](
                {
                    id: params.userId,
                    userName: params.username,
                    email: params.email,
                    role: params.role,
                    fullName: params.fullName,
                    phone: params.phone,
                    gender: params.gender,
                    isVerify: true,
                    dob: params.dob,
                },
                (response) => {
                    if (response.success) {
                        userDetails.value = response.data;
                        mixinMethods.notifySuccess(t("response.message.save_user_success"));
                    } else {
                        validation.value = mixinMethods.handleErrorResponse(response);
                        mixinMethods.notifyError(t("response.message.save_user_failed"));
                    }
                    mixinMethods.endLoading();
                },
                () => {
                    mixinMethods.notifyError(t("response.message.save_user_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const handleDeleteUser = async (id) => {
            mixinMethods.startLoading();
            await services.UserAPI.deleteUser(
                id,
                (response) => {
                    if (response.success) {
                        listUsers.value = listUsers.value.filter(user => user.id !== id);
                        mixinMethods.notifySuccess(t("response.message.delete_user_success"));
                    } else {
                        mixinMethods.notifyError(t("response.message.delete_user_failed"));
                    }
                    mixinMethods.endLoading();
                },
                (error) => {
                    mixinMethods.endLoading();
                }
            );
            isShowModalConfirm.value = false;
        }

        const getUserIdByRole = (usersForFindIds, role) => {
            let user = listUsers.value.find((user) => {
                return usersForFindIds.some((id) => user.id == id) && user.role == role;
            });
            return user;
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
                address: "",
                dob: ""
            };
        };

        const updateUserProfile = async (params) => {
            mixinMethods.startLoading();3
            let data = {
                username: params.username,
                fullName: params.fullName,
                phone: params.phone,
                gender: params.gender,
                dob: params.dob,
                address: params.address,
                picProfile: params.picProfile?.[0]?.raw ? [params.picProfile[0].raw] : []
            }
            const formData = mixinMethods.createFormData(data);
            await services.AuthenticationAPI.updateUserProfile(
                formData,
                (response) => {
                    userProfileDetails.value = response.data;
                    mixinMethods.notifySuccess(t("response.message.update_success"));
                    mixinMethods.endLoading();
                },
                (error) => {
                    validation.value = mixinMethods.handleErrorResponse(
                        error.responseCode
                    );
                    mixinMethods.notifyError(t("response.message.update_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        return {
            validation,
            listUsers, // temporary
            totalItems,
            currentPage,
            userDetails,
            isShowModalConfirm,
            getUserIdByRole,
            clearUserDetails,
            saveUser,
            getUserDetails,
            getListUsers,
            handleDeleteUser,
            updateUserProfile
        };
    }
);