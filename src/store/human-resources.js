import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useHumanResourcesStore = defineStore(
  "humanResources",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listHumanResources = reactive({value: []});
    const humanResourcesDetails = reactive({
      value: {
        id: 0,
        teamName: "",
        teamManager: "",
        description: "",
        teamMemberIds: [],
      }
    });

    const getListHumanResources = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.HumanResourceAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listHumanResources.value = response.data;
          } else {
            listHumanResources.value = [...listHumanResources.value, ...response.data];
          }
          totalItems.value = response.meta?.total;
          currentPage.value = response.meta?.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_human_failed"));
          mixinMethods.endLoading();
        }
      );
      mixinMethods.endLoading();
    };

    const getHumanResourcesDetails = async (id) => {
      mixinMethods.startLoading();
      await services.HumanResourceAPI.details(
        id,
        {},
        (response) => {
          humanResourcesDetails.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_human_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const saveHumanResources = async (params) => {
      mixinMethods.startLoading();
      await services.HumanResourceAPI.save(
        params,
        (response) => {
          if (response.success) {
            humanResourcesDetails.value = response.data;
            mixinMethods.notifySuccess(t("response.message.save_human_success"));
            mixinMethods.endLoading();
          } else {
            validation.value = mixinMethods.handleErrorResponse(response);
            mixinMethods.notifyError(t("response.message.save_human_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.save_human_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeleteHumanResources = async (id) => {
      mixinMethods.startLoading();
      await services.HumanResourceAPI.deleteHuman(
        id,
        (response) => {
          if(response.success) {
            listHumanResources.value = listHumanResources.value.filter(humanResources => humanResources.id !== id);
            mixinMethods.notifySuccess(t("response.message.delete_human_success"));
          } else {
              mixinMethods.notifyError(t("response.message.delete_human_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_human_failed"));
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const clearHumanResourcesDetails = () => {
      humanResourcesDetails.value = {
        id: 0,
        teamName: "",
        teamManager: "",
        description: "",
        manager: null,
        teamMemberIds: [],
      };
    };

    return {
      validation,
      listHumanResources,
      totalItems,
      currentPage,
      humanResourcesDetails,
      isShowModalConfirm,
      clearHumanResourcesDetails,
      saveHumanResources,
      getHumanResourcesDetails,
      getListHumanResources,
      handleDeleteHumanResources
    };
  }
);