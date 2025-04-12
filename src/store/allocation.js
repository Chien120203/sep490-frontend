import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useAllocationStore = defineStore(
  "allocation",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listAllocations = reactive({value: []});
    const allocationDetails = reactive({
      value: {
        // id: null,
        requestCode: "",
        fromProjectId: 0,
        toProjectId: 0,
        requestName: "",
        resourceAllocationDetails: [],
        description: "",
        priorityLevel: 0,
        status: 0,
        attachments: "",
        requestDate: ""
      }
    });

    const getListAllocations = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.AllocationAPI.list(
        params,
        (response) => {
          if (!response.success) {
            mixinMethods.notifyError(t("response.message.get_allocation_failed"));
            mixinMethods.endLoading();
            return;
          } else {
            if (currentPage.value === 1) {
              listAllocations.value = response.data;
            } else {
              listAllocations.value = [...listAllocations.value, ...response.data];
            }
            totalItems.value = response.meta.total;
            currentPage.value = response.meta.index;
          }
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_allocation_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const getAllocationDtls = async (id) => {
      mixinMethods.startLoading();
      await services.AllocationAPI.details(
        id,
        {},
        (response) => {
          allocationDetails.value = response.data;

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_allocation_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    }

    const saveRequest = async (params) => {
      mixinMethods.startLoading();
      await services.AllocationAPI.save(
        params,
        (response) => {
          if (response.success) {
            allocationDetails.value = response.data;
            mixinMethods.notifySuccess(t("response.message.save_mobilize_success"));
          } else {
            validation.value = mixinMethods.handleErrorResponse(response);
            mixinMethods.notifyError(t("response.message.save_mobilize_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.save_mobilize_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    return {
      validation,
      totalItems,
      currentPage,
      allocationDetails,
      listAllocations,
      saveRequest,
      getListAllocations,
      getAllocationDtls,
    };
  }
);
