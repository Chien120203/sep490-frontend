import {useI18n} from "vue-i18n";
import {
  MAX_CHARACTER,
} from "@/constants/application.js";
import { validateMinMax, validateStartBeforeEnd } from "@/rules/validation/validation.js";
import { useMobilizationStore } from "@/store/mobilization";
export const getMobilizationInfoRules = () => {
  const {t} = useI18n();
  return {
    requestDate: [
      { required: true, message: t("E-RR-FE-001"), trigger: "blur" }
    ],
    requestType: [
      { required: true, message: t("E-RR-FE-006"), trigger: "blur" }
    ]
  };
};

export const getMobilizationResourceItemRules = () => {
  const {t} = useI18n();
  return {
    unit: [
      { required: true, message: t("E-RR-FE-003"), trigger: "blur" }
    ],
    quantity: [
      { required: true, message: t("E-RR-FE-004"), trigger: "blur" },
      {
        min: 1,
        message: t("E-RR-FE-005", {min: 1}),
        trigger: "blur"
      },
    ]
  };
}
