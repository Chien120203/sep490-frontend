import { i18n } from '@/utils/i18n.js';
import {
    MAX_CHARACTER, MAX_DESCRIPTION, PHONE_NUMBER, RULES_VALIDATION
} from "@/constants/application.js";

export const USER_RULES = {
    username: [
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
    password: [
        { required: true, message: i18n.global.t("E-USER-004"), trigger: "blur" },
        {
            min: 6,
            message: i18n.global.t("E-USER-005"),
            trigger: "change",
        },
    ],
    confirm_password: [
        { required: true, message: i18n.global.t("E-USER-006"), trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                if (!value) {
                    callback(new Error(i18n.global.t("E-USER-006")));
                } else {
                    callback();
                }
            },
            trigger: "change",
        },
    ],
    address: [
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    role: [
        { required: true, message: i18n.global.t("E-USER-007"), trigger: "blur" },
    ],
    description: [
        {
            max: MAX_DESCRIPTION,
            message: i18n.global.t("E-CM-003", { max: MAX_DESCRIPTION }),
            trigger: "change",
        },
    ],
};
