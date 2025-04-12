import {useI18n} from "vue-i18n";

export const getAllocationRules = () => {
  const {t} = useI18n();
  return {
    requestDate: [
      { required: true, message: t("E-RR-FE-001"), trigger: "blur" }
    ]
  };
};

export const getAllocationResourceItemRules = () => {
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
