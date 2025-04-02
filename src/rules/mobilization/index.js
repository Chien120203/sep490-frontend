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
    ]
  };
};

export const getMobilizationResourceItemRules = () => {
  const {t} = useI18n();
  return {
    unit: [
      { required: true, message: t("E-RR-010"), trigger: "blur" }
    ],
    quantity: [
      { required: true, message: t("E-RR-010"), trigger: "blur" }
    ]
  };
}
