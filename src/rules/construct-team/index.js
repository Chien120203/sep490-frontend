import {useI18n} from "vue-i18n";
import {validateMinMax, validateStartBeforeEnd} from "@/rules/validation/validation.js";
import {useConstructLog} from "@/store/construct-log.js";
import {MIN_NUMBER, MAX_NUMBER} from "@/constants/application.js";

export const getConstructionTeamRule = () => {
  const {t} = useI18n();
  return {};
};
