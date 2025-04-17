import { i18n } from "@/utils/i18n.js";
import {
    MAX_CHARACTER,
    MAX_DESCRIPTION,
    RULES_VALIDATION,
    MIN_NUMBER,
    MAX_NUMBER,
    LICENSE_PLATE_PATTERN,
} from "@/constants/application.js";

export const MACHINE_RULES = {
    vehicleName: [
        {
            required: true,
            message: i18n.global.t("E-MACH-004"), // Hãng xe là bắt buộc
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "blur",
        },
    ],
    licensePlate: [
        {
            required: true,
            message: i18n.global.t("E-MACH-001"), // Biển số là bắt buộc
            trigger: "blur",
        },
        {
            pattern: LICENSE_PLATE_PATTERN, // /^\d{2}[A-Z]-[A-Z0-9]{1,2}\s?\d{3,5}(\.\d{2})?$/
            message: i18n.global.t("E-MACH-015"), // Định dạng biển số không hợp lệ
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "blur",
        },
    ],
    brand: [
        {
            required: true,
            message: i18n.global.t("E-MACH-002"), // Hãng xe là bắt buộc
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "blur",
        },
    ],
    yearOfManufacture: [
        {
            required: true,
            message: i18n.global.t("E-MACH-003"), // Năm sản xuất là bắt buộc
            trigger: "blur",
        },
        {
            pattern: /^\d+$/, // Chỉ chấp nhận số nguyên dương
            message: i18n.global.t("E-MACH-022"), // Phải là số nguyên dương
            trigger: "blur",
        },
        {
            validator: (rule, value) => {
                const currentYear = new Date().getFullYear();
                return Number.isInteger(value) && value >= 1900 && value <= currentYear;
            },
            message: i18n.global.t("E-MACH-016"), // Năm sản xuất không hợp lệ
            trigger: "blur",
        },
    ],
    countryOfManufacture: [
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "blur",
        },
    ],
    vehicleType: [
        {
            required: true,
            message: i18n.global.t("E-MACH-005"), // Loại xe là bắt buộc
            trigger: "blur",
        },
    ],
    chassisNumber: [
        {
            required: true,
            message: i18n.global.t("E-MACH-006"), // Số khung là bắt buộc
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "change",
        },
        {
            pattern: /^[A-Z0-9-]*$/, // Chỉ cho phép chữ cái, số, và dấu gạch ngang
            message: i18n.global.t("E-MACH-017"), // Định dạng số khung không hợp lệ
            trigger: "blur",
        },
    ],
    engineNumber: [
        {
            required: true,
            message: i18n.global.t("E-MACH-007"), // Số động cơ là bắt buộc
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "change",
        },
        {
            pattern: /^[A-Z0-9-]*$/, // Chỉ cho phép chữ cái, số, và dấu gạch ngang
            message: i18n.global.t("E-MACH-018"), // Định dạng số động cơ không hợp lệ
            trigger: "blur",
        },
    ],
    status: [
        {
            required: true,
            message: i18n.global.t("E-MACH-009"), // Trạng thái là bắt buộc
            trigger: "blur",
        },
    ],
    driver: [
        {
            required: true,
            message: i18n.global.t("E-MACH-010"), // Tài xế là bắt buộc
            trigger: "blur",
        },
    ],
    color: [
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "change",
        },
    ],
    fuelType: [
        {
            required: true,
            message: i18n.global.t("E-MACH-011"), // Loại nhiên liệu là bắt buộc
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "change",
        },
    ],
    description: [
        {
            max: MAX_DESCRIPTION, // 2000
            message: i18n.global.t("E-CM-003", { max: MAX_DESCRIPTION }), // Vượt quá số ký tự tối đa
            trigger: "change",
        },
    ],
    fuelTankVolume: [
        {
            required: true,
            message: i18n.global.t("E-MACH-012"), // Dung tích bình nhiên liệu là bắt buộc
            trigger: "blur",
        },
        {
            type: "number",
            message: i18n.global.t("E-MACH-013"), // Phải là số hợp lệ
            trigger: "blur",
        },
        {
            min: MIN_NUMBER, // 0
            max: MAX_NUMBER, // 1000000
            message: i18n.global.t("E-MACH-020"), // Dung tích phải từ 0 đến 1,000,000
            trigger: "blur",
        },
    ],
    fuelUnit: [
        {
            required: true,
            message: i18n.global.t("E-MACH-014"), // Đơn vị nhiên liệu là bắt buộc
            trigger: "blur",
        },
        {
            max: MAX_CHARACTER, // 255
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
            trigger: "change",
        },
    ],
};