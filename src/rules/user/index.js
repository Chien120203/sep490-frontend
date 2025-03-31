import { i18n } from '@/utils/i18n.js';
import {
  MAX_CHARACTER, RULES_VALIDATION, DATE_FORMAT
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
  fullName: [
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
      pattern: RULES_VALIDATION.PHONE_FORMAT,
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
};

