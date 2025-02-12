import { i18n } from '@/utils/i18n.js';
import {
    MAX_CHARACTER, MAX_DESCRIPTION, MAX_MONTH, MIN_MONTH, PHONE_NUMBER, RULES_VALIDATION
} from "@/constants/application.js";

export const USER_RULES = {
    user_code: [
        { required: true, message: i18n.global.t("E-USER-001"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    full_name: [
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    email: [
        { required: true, message: i18n.global.t("E-USER-002"), trigger: "blur" },
        {
            pattern: RULES_VALIDATION.EMAIL_FORMAT,
            message: i18n.global.t("E-CM-027"),
            trigger: "change",
        },
    ],
    phone: [
        {
            pattern: PHONE_NUMBER,
            message: i18n.global.t("E-USER-003"),
            trigger: "change",
        },
    ],
    role: [
        { required: true, message: i18n.global.t("E-USER-007"), trigger: "change" },
    ],
    gender: [
        { required: true, message: i18n.global.t("E-USER-008"), trigger: "change" },
    ],
    dob: [
        { required: true, message: i18n.global.t("E-USER-009"), trigger: "change" },
        {
            max: MAX_MONTH,
            min: MIN_MONTH,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
};

