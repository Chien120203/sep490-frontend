import { useI18n } from "vue-i18n";

export const getInspectionRules = () => {
    const { t } = useI18n();

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
                validator: (rule, value, callback) => {
                    if (!value) return callback(new Error(t("E-CM-002")));
                    const inspection = rule.inspection; // Assume inspection object is passed
                    if (!inspection?.inspectEndDate) {
                        return callback();
                    }
                    if (new Date(value).getTime() >= new Date(inspection.inspectEndDate).getTime()) {
                        return callback(new Error(t("E-CM-031")));
                    }
                    callback();
                },
                trigger: "blur"
            }
        ],
        inspectEndDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) => {
                    if (!value) return callback(new Error(t("E-CM-002")));
                    const inspection = rule.inspection;
                    if (!inspection?.inspectStartDate) {
                        return callback();
                    }
                    if (new Date(value).getTime() <= new Date(inspection.inspectStartDate).getTime()) {
                        return callback(new Error(t("E-CM-030")));
                    }
                    callback();
                },
                trigger: "blur"
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