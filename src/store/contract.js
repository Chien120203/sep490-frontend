import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useContractStore = defineStore(
  "contract",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listContracts = reactive({value: []});
    const contractDetails = reactive({
      value: {
        id: 0,
        contractCode: "",
        contractName: "",
        projectId: null,
        startDate: null,
        endDate: null,
        estimatedDays: 0,
        tax: 0,
        signDate: null,
        attachments: [],
        contractDetails: []
      }
    });

    const getContractDetails = async (id, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
      await services.ContractAPI.details(
        id,
        {},
        (response) => {
          contractDetails.value = {...response.data, projectId: response.data?.project.id, attachments: response.data.attachments || []};
            mixinMethods.endLoading();
        },
        (error) => {
          clearContractDetails();
          mixinMethods.endLoading();
        }
      );
    }

    const saveContract = async (params) => {
      mixinMethods.startLoading();
      const formData = mixinMethods.createFormData(params);
      await services.ContractAPI.save(
        formData,
        (response) => {
          contractDetails.value = {...response.data, projectId: response.data?.project.id, attachments: response.data.attachments || []};
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
      listContracts, // temporary
      totalItems,
      currentPage,
      contractDetails,
      isShowModalConfirm,
      getContractDetails,
      clearContractDetails,
      saveContract,
    };
  }
);