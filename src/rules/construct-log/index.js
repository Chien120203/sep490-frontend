import {useI18n} from "vue-i18n";
import {validateMinMax, validateStartBeforeEnd} from "@/rules/validation/validation.js";
import {useConstructLog} from "@/store/construct-log.js";
import {MIN_NUMBER, MAX_NUMBER} from "@/constants/application.js";

export const getConstructLogRules = () => {
  const {t} = useI18n();
  const constructLog = useConstructLog();
  return {
    startTime: [
      {
        validator: (rule, value, callback) => {
          const row = rule?.row; // we'll pass the row manually in the rule
          if(!value) return callback(new Error(t("E-CM-002")));
          if (!row?.endTime) {
            return callback();
          }
          if (new Date(value).getTime() >= new Date(row.endTime).getTime()) {
            return callback(new Error(t('E-CM-031')));
          }
          callback();
        }
      }
    ],
    endTime: [
      {
        validator: (rule, value, callback) => {
          const row = rule?.row;
          if(!value) return callback(new Error(t("E-CM-002")));
          if (!row?.startTime) {
            return callback();
          }
          if (new Date(value).getTime() <= new Date(row.startTime).getTime()) {
            return callback(new Error(t('E-CM-030')));
          }
          callback();
        },
        trigger: 'change',
      }
    ],
    logDate: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
            validateStartBeforeEnd(rule, value, callback, value, new Date(), "E-CM-029"),
        trigger: "blur",
      }
    ],
    logName: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    safety: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    quality: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    progress: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    quantity: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
            validateMinMax(
                rule,
                value,
                callback,
                MIN_NUMBER,
                MAX_NUMBER,
                t("E-CM-015", { min: MIN_NUMBER }),
                t("E-CM-018", { max: MAX_NUMBER })
            ),
        trigger: "blur",
      }
    ],
    workAmount: [
      {
        validator: (rule, value, callback) => {
          const task = rule?.task;
          if(!value) return callback(new Error(t("E-CM-002")));
          if (value > task.quantity - task.usedQuantity) {
            return callback(new Error(t('E-LOG-002')));
          }
          callback();
        },
        trigger: 'blur',
      }
    ],
  }
};