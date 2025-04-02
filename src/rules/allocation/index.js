import {useI18n} from "vue-i18n";
import {
  MAX_CHARACTER,
} from "@/constants/application.js";
import { MAX_ESTIMATE_DAYS, MAX_TAX, MIN_ESTIMATE_DAYS, MIN_TAX } from "@/constants/contract.js";
import { validateMinMax, validateStartBeforeEnd } from "@/rules/validation/validation.js";
import {useAllocationStore} from "@/store/allocation.js";

export const getAllocationRules = () => {
  const allocationStore = useAllocationStore();
  const { allocationDetails } = allocationStore;
  const {t} = useI18n();
  return {
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
