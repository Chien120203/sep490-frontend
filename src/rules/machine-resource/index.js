import { i18n } from "@/utils/i18n.js";
import {
    MAX_CHARACTER,
    MAX_DESCRIPTION,
    MIN_NUMBER,
    MAX_NUMBER,
} from "@/constants/application.js";
import {validateMinMax} from "@/rules/validation/validation.js";

export const getMachineRules = () => {
    const { t } = i18n.global;

    return {
        vehicleName: [
            {
                required: true,
                message: t("E-MACH-004"), // Hãng xe là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "blur",
            },
        ],
        licensePlate: [
            {
                required: true,
                message: t("E-MACH-001"), // Biển số là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "blur",
            },
        ],
        brand: [
            {
                required: true,
                message: t("E-MACH-002"), // Hãng xe là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "blur",
            },
        ],
        yearOfManufacture: [
            {
                required: true,
                message: t("E-MACH-003"), // Năm sản xuất là bắt buộc
                trigger: "blur",
            },
            {
                pattern: /^\d+$/, // Chỉ chấp nhận số nguyên dương
                message: t("E-MACH-022"), // Phải là số nguyên dương
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) => {
                    const currentYear = new Date().getFullYear();
                    const numValue = Number(value);
                    if (Number.isInteger(numValue) && numValue >= 1900 && numValue <= currentYear) {
                        callback();
                    } else {
                        callback(new Error(t("E-MACH-016"))); // Năm sản xuất không hợp lệ
                    }
                },
                trigger: "blur",
            },
        ],
        countryOfManufacture: [
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "blur",
            },
        ],
        vehicleType: [
            {
                required: true,
                message: t("E-MACH-005"), // Loại xe là bắt buộc
                trigger: "blur",
            },
        ],
        chassisNumber: [
            {
                required: true,
                message: t("E-MACH-006"), // Số khung là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
            {
                pattern: /^[A-Z0-9-]*$/, // Chỉ cho phép chữ cái, số, và dấu gạch ngang
                message: t("E-MACH-017"), // Định dạng số khung không hợp lệ
                trigger: "blur",
            },
        ],
        engineNumber: [
            {
                required: true,
                message: t("E-MACH-007"), // Số động cơ là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
            {
                pattern: /^[A-Z0-9-]*$/, // Chỉ cho phép chữ cái, số, và dấu gạch ngang
                message: t("E-MACH-018"), // Định dạng số động cơ không hợp lệ
                trigger: "blur",
            },
        ],
        status: [
            {
                required: true,
                message: t("E-MACH-009"), // Trạng thái là bắt buộc
                trigger: "blur",
            },
        ],
        driver: [
            {
                required: true,
                message: t("E-MACH-010"), // Tài xế là bắt buộc
                trigger: "blur",
            },
        ],
        color: [
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        fuelType: [
            {
                required: true,
                message: t("E-MACH-011"), // Loại nhiên liệu là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        description: [
            {
                max: MAX_DESCRIPTION, // 2000
                message: t("E-CM-003", { max: MAX_DESCRIPTION }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        fuelTankVolume: [
            {
                required: true,
                message: t("E-MACH-012"), // Dung tích bình nhiên liệu là bắt buộc
                trigger: "blur",
            },
            {
                pattern: /^\d+$/,
                message: t("E-MACH-013"), // Phải là số hợp lệ
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateMinMax(
                        rule,
                        value,
                        callback,
                        MIN_NUMBER,
                        MAX_NUMBER,
                        t("E-CM-015", { min: MIN_NUMBER }),
                        t("E-CM-018", { max: MAX_NUMBER })
                    ),
                trigger: "blur",
            },
        ],
        fuelUnit: [
            {
                required: true,
                message: t("E-MACH-014"), // Đơn vị nhiên liệu là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
    };
};