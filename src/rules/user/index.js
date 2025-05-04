import {i18n} from '@/utils/i18n.js';
import dayjs from 'dayjs';
import {
    MAX_CHARACTER, RULES_VALIDATION, DATE_FORMAT, PHONE_NUMBER
} from "@/constants/application.js";

export const USER_RULES = {
    username: [
        {required: true, message: i18n.global.t("E-USER-001"), trigger: "blur"},
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", {max: MAX_CHARACTER}),
            trigger: "change",
        },
    ],
    email: [
        {required: true, message: i18n.global.t("E-USER-002"), trigger: "blur"},
        {
            pattern: RULES_VALIDATION.EMAIL_FORMAT,
            message: i18n.global.t("E-CM-027"),
            trigger: "change",
        },
    ],
    fullName: [
        {required: true, message: i18n.global.t("E-USER-003"), trigger: "blur"},
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", {max: MAX_CHARACTER}),
            trigger: "change",
        },
    ],
    phone: [
        {required: true, message: i18n.global.t("E-USER-004"), trigger: "blur"},
        {
            pattern: PHONE_NUMBER,
            message: i18n.global.t("E-CM-034"),
            trigger: "blur",
        },
    ],
    role: [
        {required: true, message: i18n.global.t("E-USER-005"), trigger: "change"},
    ],
    gender: [
        {required: true, message: i18n.global.t("E-USER-006"), trigger: "change"},
    ],
    dob: [
        { required: true, message: i18n.global.t("E-USER-007"), trigger: "change" },
        {
            validator: (rule, value, callback) => {
                // Check if value exists and is a valid date
                if (!value) {
                    callback();
                    return;
                }

                // Parse the date of birth using dayjs
                const dobDate = dayjs(value);

                // Check if it's a valid date
                if (!dobDate.isValid()) {
                    callback(new Error(i18n.global.t("E-USER-008")));
                    return;
                }

                // Get current date
                const today = dayjs();

                // Check if date of birth is in the future
                if (dobDate.isAfter(today)) {
                    callback(new Error(i18n.global.t("E-USER-009")));
                    return;
                }

                // Calculate age
                const age = today.diff(dobDate, 'year');

                // Check if age is between 18 and 60
                if (age < 18 || age >= 60) {
                    callback(new Error(i18n.global.t("E-USER-010")));
                    return;
                }

                // If all conditions pass
                callback();
            },
            trigger: 'change'
        }
    ]
};

