import {i18n} from '@/utils/i18n.js';
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
                // Chuyển đổi giá trị thành đối tượng Date
                let dob;
                try {
                    dob = new Date(value);
                    if (isNaN(dob.getTime())) {
                        callback(new Error(i18n.global.t("E-USER-008")));
                        return;
                    }
                } catch (e) {
                    callback(new Error(i18n.global.t("E-USER-008")));
                    return;
                }

                // Lấy ngày hiện tại
                const today = new Date();

                // Kiểm tra xem dob có ở quá khứ không
                if (dob >= today) {
                    callback(new Error(i18n.global.t("E-USER-009")));
                    return;
                }

                // Tính ngày cách dob 18 năm
                const maxYearsLater = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
                const minYearsLater = new Date(dob.getFullYear() - 60, dob.getMonth(), dob.getDate());

                // Kiểm tra xem người dùng đã đủ 18 tuổi chưa
                if (minYearsLater < today < maxYearsLater) {
                    callback(new Error(i18n.global.t("E-USER-010")));
                    return;
                }

                // Nếu tất cả điều kiện đều thỏa mãn
                callback();
            },
            trigger: 'change'
        }
    ],
};

