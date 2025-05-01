import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import {CONSTRUCTION_EMPLOYEE} from "@/constants/roles.js";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";

export const useHumanResourcesStore = defineStore(
  "humanResources",
  () => {
    const router = useRouter();
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
        teamManager: 0,
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
          humanResourcesDetails.value = {
            ...response.data,
            teamMemberIds: response.data.members.filter(item => item.role === CONSTRUCTION_EMPLOYEE).map(item => item.id)
          };
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
          humanResourcesDetails.value = response.data;
          getListHumanResources({
            teamManager: "",
            teamName: "",
            pageIndex: 1
          });
          mixinMethods.notifySuccess(t("response.message.save_human_success"));
          mixinMethods.endLoading();
          router.push({name: PAGE_NAME.RESOURCE.HUMAN.LIST})
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
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
          listHumanResources.value = listHumanResources.value.filter(humanResources => humanResources.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_human_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_human_failed"));
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const handleRemoveMember = async (id) => {
      mixinMethods.startLoading();
      await services.HumanResourceAPI.removeMember(
        id,
        (response) => {
          humanResourcesDetails.value.teamMemberIds = humanResourcesDetails.value.teamMemberIds.filter(memId => memId !== id);
          mixinMethods.notifySuccess(t("response.message.remove_member_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.remove_member_failed"));
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const clearHumanResourcesDetails = () => {
      humanResourcesDetails.value = {
        id: 0,
        teamName: "",
        teamManager: 0,
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
      handleRemoveMember,
      clearHumanResourcesDetails,
      saveHumanResources,
      getHumanResourcesDetails,
      getListHumanResources,
      handleDeleteHumanResources,
    };
  }
);