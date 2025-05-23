import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import {QUALITY_ASSURANCE} from "@/constants/roles.js";
import {INSPECT_DECISION_FAIL, WAIT_FOR_APPROVE} from "@/constants/inspection.js";
import {useRouter} from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {useProgressStore} from "@/store/progress.js";

export const useInspectionReportStore = defineStore(
  "inspectionReport",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const router = useRouter();
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 1});
    const listInspectionReports = reactive({value: []});
    const progressStore = useProgressStore();
    const {clearAllCache} = progressStore;
    const inspectionReportDetails = reactive({
      value: {
        id: 0,
        inspectCode: "",
        inspectionName: "",
        constructionProgressItemId: "",
        inspectorId: 0,
        inspectStartDate: "",
        inspectEndDate: "",
        location: "",
        attachment: [],
        inspectionDecision: INSPECT_DECISION_FAIL,
        status: WAIT_FOR_APPROVE,
        qualityNote: "",
        otherNote: "",
      }
    });

    const getListInspectionReport = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.InspectionReportAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listInspectionReports.value = response.data;
          } else {
            listInspectionReports.value = [...listInspectionReports.value, ...response.data];
          }
          totalItems.value = response.meta?.total;
          currentPage.value = response.meta?.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_inspection_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const getInspectionReportDetails = async (id) => {
      mixinMethods.startLoading();
      await services.InspectionReportAPI.details(
        id,
        {},
        (response) => {
          inspectionReportDetails.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_inspection_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const saveInspectionReport = async (params) => {
      mixinMethods.startLoading();
      if(localStorage.getItem("role") === QUALITY_ASSURANCE) {
        params.inspectorId = localStorage.getItem("userId");
      } else {
        mixinMethods.notifyError(t("response.message.save_inspection_failed"));
        return;
      }
      const formData = mixinMethods.createFormData(params);
      await services.InspectionReportAPI.save(
        formData,
        (response) => {
          inspectionReportDetails.value = response.data;
          mixinMethods.notifySuccess(t("response.message.save_inspection_success"));
          mixinMethods.endLoading();
          router.push({name: PAGE_NAME.INSPECTION_REPORT.LIST})
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.save_inspection_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeleteInspectionReport = async (id) => {
      mixinMethods.startLoading();
      await services.InspectionReportAPI.deleteInspectionReport(
        id,
        (response) => {
          if (response.success) {
            listInspectionReports.value = listInspectionReports.value.filter(inspectionReport => inspectionReport.id !== id);
            mixinMethods.notifySuccess(t("response.message.delete_inspection_success"));
          } else {
            mixinMethods.notifyError(t("response.message.delete_inspection_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const handleInspectStatus = async (id, method) => {
      mixinMethods.startLoading();
      await services.InspectionReportAPI[method](
        id,
        (response) => {
          getInspectionReportDetails(id);
          clearAllCache();
          mixinMethods.notifySuccess(t("response.message.save_inspection_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.save_inspection_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const clearInspectionReportDetails = () => {
      inspectionReportDetails.value = {
        id: 0,
        projectId: 0,
        inspectCode: "",
        inspectionName: "",
        inspectorId: 0,
        inspectorName: "",
        inspectStartDate: "",
        inspectEndDate: "",
        progressId: 0,
        progressName: "",
        planId: 0,
        planName: "",
        location: "",
        attachment: [],
        inspectionDecision: INSPECT_DECISION_FAIL,
        status: WAIT_FOR_APPROVE,
        qualityNote: "",
        otherNote: "",
      };
    };

    return {
      validation,
      listInspectionReports,
      totalItems,
      currentPage,
      inspectionReportDetails,
      isShowModalConfirm,
      clearInspectionReportDetails,
      saveInspectionReport,
      getInspectionReportDetails,
      getListInspectionReport,
      handleDeleteInspectionReport,
      handleInspectStatus
    };
  }
);