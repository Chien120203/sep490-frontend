import { useI18n } from "vue-i18n";
import {useInspectionReportStore} from "@/store/inspection.js";
import {validateStartBeforeEnd} from "@/rules/validation/validation.js";

export const getInspectionRules = () => {
    const { t } = useI18n();
    const inspectStore = useInspectionReportStore();
    const {inspectionReportDetails} = inspectStore;
    return {
        inspectCode: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        inspectorId: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            { type: 'number', message: t("E-CM-XXX"), trigger: "blur" }
        ],
        inspectorName: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        inspectStartDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, value, inspectionReportDetails.value.inspectEndDate, "E-CM-020"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
                trigger: "blur",
            }
        ],
        inspectEndDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, inspectionReportDetails.value.inspectStartDate, value, "E-CM-028"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
                trigger: "blur",
            }
        ],
        progressId: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            { type: 'number', message: t("E-CM-XXX"), trigger: "blur" }
        ],
        progressName: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        planId: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            { type: 'number', message: t("E-CM-XXX"), trigger: "blur" }
        ],
        planName: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        location: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        inspectionDecision: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            { type: 'number', message: t("E-CM-XXX"), trigger: "blur" }
        ],
        status: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            { type: 'number', message: t("E-CM-XXX"), trigger: "blur" }
        ]
    };
};