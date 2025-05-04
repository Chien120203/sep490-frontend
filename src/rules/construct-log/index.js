import {useI18n} from "vue-i18n";
import {validateStartBeforeEnd} from "@/rules/validation/validation.js";

export const getConstructLogRules = () => {
  const {t} = useI18n();
  return {
    logName: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    logDate: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
            validateStartBeforeEnd(rule, value, callback, value, new Date(), "E-CM-029"),
        trigger: "blur",
      }
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
    problem: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    advice: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ],
    note: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
    ]
  };
};