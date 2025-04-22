import { defineStore } from "pinia";
import {reactive} from "vue";
import { mixinMethods } from "@/utils/variables";
import services from "@/plugins/services";
import { useI18n } from "vue-i18n";
import {InspectionReportAPI} from "@/services/InspectionReportAPI.js";

export const useInspectionReportStore = defineStore(
    "inspectionReport",
    () => {
        const {t} = useI18n();
        const validation = reactive({ value: {} });
        const isShowModalConfirm = reactive({ value: false });
        const totalItems = reactive({ value: 0 });
        const currentPage = reactive({ value: 0 });
        const listInspectionReports = reactive({ value: [] });
        const inspectionReportDetails = reactive({
            value: {
                id: 0,
                projectId: 0,
                inspectCode: 0,
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
                inspectionDecision: 0,
                status: 0,
                qualityNote: "",
                otherNote: "",
            }
        });

        const getListInspectionReport = async (params, isLoading = true) => {
            if(isLoading) mixinMethods.startLoading();
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

        const saveInspectionReport = async (params, method) => {
            mixinMethods.startLoading();
            const formData = mixinMethods.createFormData(params);
            await services.InspectionReportAPI[method](
                formData,
                (response) => {
                    if(response.success) {
                        inspectionReportDetails.value = response.data;
                        mixinMethods.notifySuccess(t("response.message.save_inspection_success"));
                        mixinMethods.endLoading();
                    }else {
                        validation.value = mixinMethods.handleErrorResponse(response);
                        mixinMethods.notifyError(t("response.message.save_inspection_failed"));
                    }
                    mixinMethods.endLoading();
                },
                () => {
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
                    if(response.success) {
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

        const handleChangeRequestStatus = async (id, method) => {
            mixinMethods.startLoading();
            await services.InspectionReportAPI[method](
                id,
                (response) => {
                    // mobilizationDetails.value = response.data;
                    mixinMethods.notifySuccess(t("response.message.save_inspection_success"));
                    mixinMethods.endLoading();
                },
                () => {
                    validation.value = mixinMethods.handleErrorResponse(response);
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
                inspectCode: 0,
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
                inspectionDecision: 0,
                status: 0,
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
            handleChangeRequestStatus
        };
    }
);