import { useI18n } from "vue-i18n";
import {
    MAX_CHARACTER,
    MAX_DESCRIPTION,
    RULES_VALIDATION,
    MIN_NUMBER,
    MAX_NUMBER,
    MIN_PRICE,
    MAX_PRICE,
    DATE_FORMAT,
} from "@/constants/application.js";
import { validateMinMax } from "@/rules/validation/validation.js";
import { useContractStore } from "@/store/contract.js";

export const getMaterialRules = () => {
    const contractStore = useContractStore();
    const { contractDetails } = contractStore;
    const { t } = useI18n();

    return {
        materialCode: [
            {
                required: true,
                message: t("E-MAT-001"), // Mã vật liệu là bắt buộc
                trigger: "blur",
            },
            {
                pattern: /^[A-Z0-9-]*$/, // Chỉ cho phép chữ cái, số, và dấu gạch ngang
                message: t("E-MAT-002"), // Định dạng mã vật liệu không hợp lệ
                trigger: "change",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        materialName: [
            {
                required: true,
                message: t("E-MAT-003"), // Tên vật liệu là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        unit: [
            {
                required: true,
                message: t("E-MAT-004"), // Đơn vị tính là bắt buộc
                trigger: "blur",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        branch: [
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        madeIn: [
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        chassisNumber: [
            {
                required: true,
                message: t("E-MAT-005"), // Số khung là bắt buộc
                trigger: "blur",
            },
            {
                pattern: /^[A-Z0-9-]*$/, // Chỉ cho phép chữ cái, số, và dấu gạch ngang
                message: t("E-MAT-006"), // Định dạng số khung không hợp lệ
                trigger: "change",
            },
            {
                max: MAX_CHARACTER, // 255
                message: t("E-CM-003", { max: MAX_CHARACTER }), // Vượt quá số ký tự tối đa
                trigger: "change",
            },
        ],
        wholesalePrice: [
            {
                required: true,
                message: t("E-MAT-007"), // Giá bán buôn là bắt buộc
                trigger: "blur",
            },
            {
                type: "number",
                message: t("E-MAT-008"), // Giá bán buôn phải là số hợp lệ
                trigger: "change",
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
        retailPrice: [
            {
                required: true,
                message: t("E-MAT-010"), // Giá bán lẻ là bắt buộc
                trigger: "blur",
            },
            {
                type: "number",
                message: t("E-MAT-011"), // Giá bán lẻ phải là số hợp lệ
                trigger: "change",
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
        inventory: [
            {
                required: true,
                message: t("E-MAT-013"), // Số lượng tồn kho là bắt buộc
                trigger: "blur",
            },
            {
                type: "number",
                message: t("E-MAT-014"), // Số lượng tồn kho phải là số hợp lệ
                trigger: "change",
            },
            {
                pattern: /^\d+$/, // Chỉ chấp nhận số nguyên dương
                message: t("E-MAT-015"), // Số lượng tồn kho phải là số nguyên dương
                trigger: "change",
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
        attachment: [
            {
                validator: (rule, value) => {
                    if (value && value.size > RULES_VALIDATION.ALLOWED_FILE_SIZE_10MB) {
                        return false;
                    }
                    return true;
                },
                message: t("E-MAT-017"), // Kích thước tệp vượt quá 10MB
                trigger: "change",
            },
        ],
        expireDate: [
            {
                type: "date",
                message: t("E-MAT-018"), // Ngày hết hạn phải là ngày hợp lệ
                trigger: "change",
            },
        ],
        productionDate: [
            {
                type: "date",
                message: t("E-MAT-019"), // Ngày sản xuất phải là ngày hợp lệ
                trigger: "change",
            },
            {
                validator: (rule, value) => {
                    if (!value) return true; // Không bắt buộc
                    const currentDate = new Date();
                    return new Date(value) <= currentDate;
                },
                message: t("E-MAT-020"), // Ngày sản xuất không được lớn hơn ngày hiện tại
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
    };
};