import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const usePlanningStore = defineStore(
  "planning",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listPlannings = reactive({value: []});
    const contractDetails = reactive({
      value: {
      }
    });

    const getListPlannings = async (params, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
      await services.PlanningAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listPlannings.value = response.data;
          } else {
            listPlannings.value = [...listPlannings.value, ...response.data];
          }
          // totalItems.value = response.meta?.total;
          // currentPage.value = response.meta?.index;

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_planning_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const getContractDetails = async (id) => {
      mixinMethods.startLoading();
      await services.ContractAPI.details(
        id,
        {},
        (response) => {
          contractDetails.value = {...response.data, projectId: response.data?.project.id, attachments: response.data.attachments || []};

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_contract_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    }

    const saveContract = async (params) => {
      mixinMethods.startLoading();
      const formData = mixinMethods.createFormData(params);
      var object = {};
      formData.forEach(function(value, key){
        object[key] = value;
      });
      var json = JSON.stringify(object);
      console.log(json);
      await services.ContractAPI.save(
        formData,
        (response) => {
          contractDetails.value = response.data;
          mixinMethods.notifySuccess(t("response.message.save_contract_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(
            error.responseCode
          );
          mixinMethods.notifyError(t("response.message.save_contract_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const clearContractDetails = () => {
      contractDetails.value = {
        id: 0,
        contractCode: "",
        projectId: null,
        startDate: null,
        endDate: null,
        estimatedDays: "",
        tax: "",
        signDate: null,
        attachments: [],
        contractDetails: []
      };
    };

    return {
      validation,
      listPlannings, // temporary
      totalItems,
      currentPage,
      contractDetails,
      isShowModalConfirm,
      getContractDetails,
      clearContractDetails,
      saveContract,
      getListPlannings
    };
  }
);