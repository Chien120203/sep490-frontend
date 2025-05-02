import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import dayjs from "dayjs";
import {EXECUTIVE_BOARD, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {DRAFT_STATUS} from "@/constants/allocation.js";

export const useMobilizationStore = defineStore(
  "mobilization",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listMobilizations = reactive({value: []});
    const mobilizationDetails = reactive({
      value: {
        id: null,
        requestCode: "",
        projectId: 0,
        requestName: "",
        requestType: 1,
        resourceMobilizationDetails: [],
        description: "",
        priorityLevel: 0,
        status: 0,
        attachments: "",
        requestDate: dayjs()
      }
    });

    const setMobilizationDefault = () => {
      mobilizationDetails.value = {
        id: null,
        requestCode: "",
        projectId: 0,
        requestName: "",
        requestType: 1,
        resourceMobilizationDetails: [],
        description: "",
        priorityLevel: 0,
        status: 0,
        attachments: "",
        requestDate: dayjs()
      }
    }

    const getListMobilizations = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.MobilizationAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listMobilizations.value = response.data;
          } else {
            listMobilizations.value = [...listMobilizations.value, ...response.data];
          }
          if (localStorage.getItem('role') === TECHNICAL_MANAGER || localStorage.getItem('role') === EXECUTIVE_BOARD) {
            listMobilizations.value = listMobilizations.value.filter((item) => item.status !== DRAFT_STATUS);
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_mobilization_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const getMobilizationDetails = async (id, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.MobilizationAPI.details(
        id,
        {},
        (response) => {
          mobilizationDetails.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_mobilization_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const saveRequest = async (params) => {
      mixinMethods.startLoading();
      await services.MobilizationAPI.save(
        params,
        (response) => {
          mobilizationDetails.value = response.data;
          listMobilizations.value.push(response.data);
          mixinMethods.notifySuccess(t("response.message.save_mobilize_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_mobilize_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const handleDeleteMobilization = async (id) => {
      mixinMethods.startLoading();
      await services.MobilizationAPI.deleteMobilization(
        id,
        (response) => {
          listMobilizations.value = listMobilizations.value.filter(mobilize => mobilize.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_mobilize_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_mobilize_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const handleChangeRequestStatus = async (id, method, message) => {
      mixinMethods.startLoading();
      let params = method === 'approve' ? {comments: message} : {reason: message};
      await services.MobilizationAPI[method](
        id,
        params,
        (response) => {
          // mobilizationDetails.value = response.data;
          mixinMethods.notifySuccess(t("response.message.update_mobilization_status_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.update_mobilization_status_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    return {
      validation,
      totalItems,
      currentPage,
      mobilizationDetails,
      listMobilizations,
      handleDeleteMobilization,
      getListMobilizations,
      getMobilizationDetails,
      setMobilizationDefault,
      handleChangeRequestStatus,
      saveRequest
    };
  }
);
