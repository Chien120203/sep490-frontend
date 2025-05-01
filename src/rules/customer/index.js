import {useI18n} from "vue-i18n";
import {
  FAX_NUMBER,
  MAX_CHARACTER, MAX_DESCRIPTION, PHONE_NUMBER, RULES_VALIDATION,
  TAX_CODE
} from "@/constants/application.js";

export const getCustomerRules = () => {
  const {t} = useI18n();
  return {
    customerCode: [
      { required: true, message: t("E-CUS-001"), trigger: "blur" },
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    customerName: [
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    taxCode: [
      { required: true, message: t("E-CUS-007"), trigger: "blur" },
      {
        pattern: TAX_CODE,
        message: t("E-CUS-005"),
        trigger: "change",
      },
    ],
    phone: [
      {
        pattern: PHONE_NUMBER,
        message: t("E-CUS-008"),
        trigger: "change",
      },
    ],
    fax: [
      {
        pattern: FAX_NUMBER,
        message: t("E-CUS-006"),
        trigger: "change",
      },
    ],
    bankName: [
      {
        max: MAX_CHARACTER,
        message: t("E-CM-027"),
        trigger: "change",
      },
    ],
    bankAccount: [
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    email: [
      {
        pattern: RULES_VALIDATION.EMAIL_FORMAT,
        message: t("E-CM-027"),
        trigger: "change",
      },
    ],
    directorName: [
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
    description: [
      {
        max: MAX_DESCRIPTION,
        message: t("E-CM-003", { max: MAX_CHARACTER }),
        trigger: "change",
      },
    ],
  };
};

