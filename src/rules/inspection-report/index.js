import { useI18n } from "vue-i18n";
import {
    validateStartBeforeEnd,
    validateChooseDateRelation,
} from "@/rules/validation/validation.js";

export const getInspectionRules = (inspectionReportDetails) => {
    const { t } = useI18n();

    // Ensure inspectionReportDetails exists to avoid undefined errors
    if (!inspectionReportDetails) {
        console.error("Error: inspectionReportDetails is undefined or null.");
        return {};
    }

    return {
        inspectionName: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        inspectStartDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(
                        rule,
                        value,
                        callback,
                        new Date(), // Ngày hiện tại
                        value,
                        t("E-CM-022") // "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại"
                    ),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(
                        rule,
                        value,
                        callback,
                        value,
                        inspectionReportDetails?.inspectEndDate,
                        t("E-CM-031") // "Ngày bắt đầu phải trước ngày kết thúc"
                    ),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateChooseDateRelation(
                        rule,
                        value,
                        callback,
                        inspectionReportDetails,
                        [],
                        false
                    ),
                trigger: "blur",
            }
        ],
        inspectEndDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(
                        rule,
                        value,
                        callback,
                        inspectionReportDetails?.inspectStartDate,
                        value,
                        t("E-CM-030") // "Ngày kết thúc phải sau ngày bắt đầu"
                    ),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(
                        rule,
                        value,
                        callback,
                        new Date(), // Ngày hiện tại
                        value,
                        t("E-CM-022") // "Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại"
                    ),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateChooseDateRelation(
                        rule,
                        value,
                        callback,
                        inspectionReportDetails,
                        [],
                        false
                    ),
                trigger: "blur",
            }
        ],
        location: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        inspectionDecision: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        status: [
            { required: true, message: t("E-CM-002"), trigger: "blur" }
        ],
        attachment: [
            {
                validator: (rule, value, callback) => {
                    if (value && value.length > 3) {
                        return callback(new Error(t("E-CM-050"))); // "Tối đa 3 tệp được phép tải lên"
                    }
                    callback();
                },
                trigger: "change",
            }
        ]
    };
};