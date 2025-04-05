import {useI18n} from "vue-i18n";
import {
  MAX_CHARACTER,
} from "@/constants/application.js";
import { MAX_ESTIMATE_DAYS, MAX_TAX, MIN_ESTIMATE_DAYS, MIN_TAX } from "@/constants/contract.js";
import { validateMinMax, validateStartBeforeEnd } from "@/rules/validation/validation.js";
import {useContractStore} from "@/store/contract.js";

export const getContractRules = () => {
  const contractStore = useContractStore();
  const { contractDetails } = contractStore;
  const {t} = useI18n();
  return {
    contractCode: [
      { required: true, message: t("E-CTR-001"), trigger: "blur" },
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "blur",
      },
    ],
    projectId: [
      { required: true, message: t("E-CTR-002"), trigger: "blur" },
    ],
    startDate: [
      { required: true, message: t("E-CTR-003"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, value, contractDetails.value.endDate, "E-CM-020"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
        trigger: "blur",
      }
    ],
    endDate: [
      { required: true, message: t("E-CTR-004"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, contractDetails.value.startDate, value, "E-CM-028"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
        trigger: "blur",
      }
    ],
    signDate: [
      { required: true, message: t("E-CTR-005"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, value, contractDetails.value.startDate, "E-CTR-012"),
        trigger: "blur",
      }
    ],
    tax: [
      { required: true, message: t("E-CTR-009"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateMinMax(
            rule,
            value,
            callback,
            MIN_TAX,
            MAX_TAX,
            t("E-CTR-010", { min: MIN_TAX }),
            t("E-CTR-011", { max: MAX_TAX })
          ),
        trigger: "blur",
      }
    ],
    estimatedDays: [
      { required: true, message: t("E-CTR-006"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateMinMax(
            rule,
            value,
            callback,
            MIN_ESTIMATE_DAYS,
            MAX_ESTIMATE_DAYS,
            t("E-CTR-007", { min: MIN_ESTIMATE_DAYS }),
            t("E-CTR-008", { max: MAX_ESTIMATE_DAYS })
          ),
        trigger: "blur",
      }
    ]
  };
};
