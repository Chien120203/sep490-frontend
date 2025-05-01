import { i18n } from '@/utils/i18n.js';
import {
  MAX_CHARACTER, MAX_DESCRIPTION, MAX_NUMBER, MAX_PRICE, MIN_NUMBER, MIN_PRICE, PHONE_NUMBER, RULES_VALIDATION,
} from "@/constants/application.js";
import {useProjectStore} from "@/store/project.js";
import {useI18n} from "vue-i18n";
import {validateMinMax, validateStartBeforeEnd} from "@/rules/validation/validation.js";

export const getProjectRules = () => {
  const projectStore = useProjectStore();
  const {projectDetails} = projectStore;
  const {t} = useI18n();
  return {
    projectCode: [
      { required: true, message: t("E-PRJ-009"), trigger: "blur" },
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    projectName: [
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    customerId: [
      { required: true, message: t("E-PRJ-010"), trigger: "blur" },
    ],
    area: [
      { required: true, message: t("E-PRJ-003"), trigger: "blur" },
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    startDate: [
      { required: true, message: t("E-PRJ-004"), trigger: "blur" },
      {
        trigger: "change",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, value, projectDetails.value.endDate, "E-CM-020"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
        trigger: "blur",
      }
    ],
    endDate: [
      { required: true, message: i18n.global.t("E-PRJ-005"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, projectDetails.value.startDate, value, "E-CM-028"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
        trigger: "blur",
      }
    ],
    budget: [
      { required: true, message: t("E-PRJ-006"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateMinMax(
            rule,
            value,
            callback,
            MIN_PRICE,
            MAX_PRICE,
            t("E-CM-015", { min: MIN_PRICE }),
            t("E-CM-018", { max: MAX_PRICE })
          ),
        trigger: "blur",
      }
    ],
    purpose: [
      { required: true, message: t("E-PRJ-007"), trigger: "blur" },
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "change",
      }
    ],
    technicalReqs: [
      { required: true, message: t("E-PRJ-008"), trigger: "blur" },
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "change",
      },
    ],
    description: [
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "change",
      },
    ],
  }
}
