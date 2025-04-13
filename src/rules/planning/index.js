import {useI18n} from "vue-i18n";
import {
  MAX_CHARACTER, MAX_NUMBER, MAX_PRICE, MIN_NUMBER, MIN_PRICE,
} from "@/constants/application.js";
import {validateChooseDateRelation, validateMinMax, validateStartBeforeEnd, validateChooseTypeRelation} from "@/rules/validation/validation.js";
import {usePlanningStore} from "@/store/planning.js";
import {MAX_TAX, MIN_TAX} from "@/constants/contract.js";

export const getPlanningRules = () => {
  const planningStore = usePlanningStore();
  const { planningDetails, planSelectedRow } = planningStore;
  const {t} = useI18n();
  const getSelectedRow = (field) => {
    const index = field.split(".")[1];
    return planningDetails.value.planItems[index];
  }
  const getParentRow = (index, byId = false) => {
    if(!index) return null;
    let currentRow = byId ? planningDetails.value.planItems[index] : planningDetails.value.planItems.find(item => item.index === index);
    if(!currentRow.parentIndex) return null;
    return planningDetails.value.planItems.find(item => item.index === currentRow.parentIndex) || null;
  }
  return {
    planName: [
      {required: true, message: t("E-CM-002"), trigger: "blur"},
      {
        max: MAX_CHARACTER,
        message: t("E-CM-003", {max: MAX_CHARACTER}),
        trigger: "blur",
      },
    ],
    selectedFollowers: [
      {required: true, message: t("E-CM-002"), trigger: "blur"}
    ],
    workName: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' }
    ],
    unit: [
      { required: true, message: t("E-CM-002"), trigger: 'blur' }
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
    unitPrice: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateMinMax(
            rule,
            value,
            callback,
            MIN_PRICE,
            MAX_PRICE,
            t("E-CM-015", { min: MIN_PRICE }),
            t("E-CM-018", { max: MAX_PRICE })
          ),
        trigger: "blur",
      }
    ],
    startDate: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, value, planSelectedRow.value.endDate || getSelectedRow(rule.field).endDate, "E-CM-020"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateChooseDateRelation(rule, value, callback, planSelectedRow.value, planningDetails.value),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, getParentRow(planSelectedRow.value.index)?.startDate || getParentRow(rule.field.split(".")[1], true)?.startDate, value, "E-CM-032"),
        trigger: "blur",
      },
    ],
    endDate: [
      { required: true, message: t("E-CM-002"), trigger: "blur" },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, planSelectedRow.value.startDate || getSelectedRow(rule.field).startDate, value, "E-CM-028"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateChooseDateRelation(rule, value, callback, planSelectedRow.value, planningDetails.value),
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) =>
          validateStartBeforeEnd(rule, value, callback, value, getParentRow(planSelectedRow.value.index)?.endDate || getParentRow(rule.field.split(".")[1], true)?.endDate, "E-CM-033"),
        trigger: "blur",
      },
    ],
    dependency: [
      {
        validator: (rule, value, callback) =>
          validateChooseTypeRelation(rule, value, callback, planSelectedRow.value, planningDetails.value),
        trigger: "change",
      }
    ],
    totalPrice: [
      {
        validator: (rule, value, callback) =>
          validateMinMax(rule,
            value,
            callback,
            MIN_NUMBER,
            (planSelectedRow.value.quantity * planSelectedRow.value.unitPrice),
            "",
            t("E-PLAN-001"),
          ),
        trigger: "change",
      }
    ],
  }
};
