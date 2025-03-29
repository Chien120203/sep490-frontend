import {useI18n} from "vue-i18n";
import {
  MAX_CHARACTER, MAX_DESCRIPTION,
} from "@/constants/application.js";
import { MAX_ESTIMATE_DAYS, MAX_TAX, MIN_ESTIMATE_DAYS, MIN_TAX } from "@/constants/contract.js";
import { validateMinMax, validateStartBeforeEnd } from "@/rules/validation/validation.js";
import {useContractStore} from "@/store/contract.js";
import {useSiteSurveyStore} from "@/store/site-survey.js";

export const getSiteSurveyRules = () => {
  const siteSurveyStore = useSiteSurveyStore();
  const { siteSurveyDetails } = siteSurveyStore;
  const {t} = useI18n();
  return {
    siteSurveyName: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "blur",
      },
    ],
    constructionRequirements: [
      { required: true, message:t("E-CM-002"), trigger: 'blur' },
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "blur",
      },
    ],
    equipmentRequirements: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "blur",
      },
    ],
    humanResourceCapacity: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "blur",
      },
    ],
    riskAssessment: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "blur",
      },
    ],
    biddingDecision: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    profitAssessment: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    bidWinProb: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateMinMax(
            rule,
            value,
            callback,
            0,
            100,
            t("E-SV-001", { min: 0 }),
            t("E-SV-002", { max: 100 })
          ),
        trigger: "blur",
      }
    ],
    estimatedExpenses: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    estimatedProfits: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    tenderPackagePrice: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    totalBidPrice: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    discountRate: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateMinMax(
            rule,
            value,
            callback,
            0,
            100,
            t("E-SV-003", { min: 0 }),
            t("E-SV-004", { max: 100 })
          ),
        trigger: "blur",
      }
    ],
    projectCost: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    finalProfit: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' },
    ],
    status: [
      { required: true, message: t("E-CM-002"), trigger: 'change' },
    ],
  };
};
