import {useI18n} from "vue-i18n";
import {validateMinMax, validateStartBeforeEnd} from "@/rules/validation/validation.js";
import {useConstructLog} from "@/store/construct-log.js";
import {MIN_NUMBER, MAX_NUMBER, MAX_CHARACTER, MAX_DESCRIPTION} from "@/constants/application.js";

export const getConstructionTeamRule = () => {
  const {t} = useI18n();
  return {
    teamName: [
      { required: true, message: t("E-CTR-001"), trigger: "blur" },
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "blur",
      },
    ],
    teamManager: [
      { required: true, message: t("E-CTR-001"), trigger: "blur" }
    ],
    description: [
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_DESCRIPTION }),
        trigger: "change",
      },
    ],
  };
};
