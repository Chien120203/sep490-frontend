import { i18n } from '@/utils/i18n.js';
import {
  FAX_NUMBER,
  MAX_CHARACTER, MAX_DESCRIPTION, PHONE_NUMBER, RULES_VALIDATION,
  TAX_CODE
} from "@/constants/application.js";

export const CUSTOMER_RULES = {
  customerCode: [
    { required: true, message: i18n.global.t("E-CUS-001"), trigger: "blur" },
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  customerName: [
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  taxCode: [
    { required: true, message: i18n.global.t("E-CUS-004"), trigger: "blur" },
    {
      pattern: TAX_CODE,
      message: i18n.global.t("E-CUS-005"),
      trigger: "change",
    },
  ],
  phone: [
    {
      pattern: PHONE_NUMBER,
      message: i18n.global.t("E-CUS-005"),
      trigger: "change",
    },
  ],
  fax: [
    {
      pattern: FAX_NUMBER,
      message: i18n.global.t("E-CUS-006"),
      trigger: "change",
    },
  ],
  bankName: [
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-027"),
      trigger: "change",
    },
  ],
  bankAccount: [
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  email: [
    {
      pattern: RULES_VALIDATION.EMAIL_FORMAT,
      message: i18n.global.t("E-CM-027"),
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
  directorName: [
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  description: [
    {
      max: MAX_DESCRIPTION,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
};

