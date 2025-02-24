import { i18n } from '@/utils/i18n.js';
import {
  MAX_CHARACTER, MAX_DESCRIPTION, PHONE_NUMBER, RULES_VALIDATION,
} from "@/constants/application.js";

export const PROJECT_RULES = {
  projectCode: [
    { required: true, message: i18n.global.t("E-PRJ-001"), trigger: "blur" },
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  projectName: [
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  customerId: [
    { required: true, message: i18n.global.t("E-PRJ-002"), trigger: "blur" },
  ],
  area: [
    { required: true, message: i18n.global.t("E-PRJ-003"), trigger: "blur" },
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "change",
    },
  ],
  startDate: [
    { required: true, message: i18n.global.t("E-PRJ-004"), trigger: "blur" },
    {
      trigger: "change",
    },
  ],
  endDate: [
    { required: true, message: i18n.global.t("E-PRJ-005"), trigger: "blur" },
  ],
  budget: [
    { required: true, message: i18n.global.t("E-PRJ-006"), trigger: "blur" },
    {
      max: MAX_CHARACTER,
      message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
      trigger: "blur",
    },
  ],
  purpose: [
    { required: true, message: i18n.global.t("E-PRJ-007"), trigger: "blur" },
    {
      max: MAX_DESCRIPTION,
      message: i18n.global.t("E-CM-003", { max: MAX_DESCRIPTION }),
      trigger: "change",
    },
  ],
  technicalReqs: [
    { required: true, message: i18n.global.t("E-PRJ-008"), trigger: "blur" },
    {
      max: MAX_DESCRIPTION,
      message: i18n.global.t("E-CM-003", { max: MAX_DESCRIPTION }),
      trigger: "change",
    },
  ],
  description: [
    {
      max: MAX_DESCRIPTION,
      message: i18n.global.t("E-CM-003", { max: MAX_DESCRIPTION }),
      trigger: "change",
    },
  ],
};
