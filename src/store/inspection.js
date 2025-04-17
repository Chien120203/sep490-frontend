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
                inspect_code: 0,
                inspector: 0,
                inspect_start_date: "",
                inspect_end_date: "",
                progress_id: 0,
                plan_id: 0,
                location: "",
                attachment: [],
                inspection_decision: 0,
                status: 0,
                quality_note: "",
                other_note: "",
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
            mixinMethods.endLoading();
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

        const clearInspectionReportDetails = () => {
            inspectionReportDetails.value = {
                id: 0,
                projectId: 0,
                inspect_code: 0,
                inspector: 0,
                inspect_start_date: "",
                inspect_end_date: "",
                progress_id: 0,
                plan_id: 0,
                location: "",
                attachment: [],
                inspection_decision: 0,
                status: 0,
                quality_note: "",
                other_note: "",
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
        };
    }
);