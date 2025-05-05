import {useI18n} from "vue-i18n";
import {
    MAX_NUMBER, MAX_PRICE, MIN_NUMBER, MIN_PRICE,
} from "@/constants/application.js";
import {
    validateChooseDateRelation,
    validateMinMax,
    validateStartBeforeEnd,
    validateChooseTypeRelation,
    validateDateBetween
} from "@/rules/validation/validation.js";
import {useProgressStore} from "@/store/progress.js";

export const getChangeRequestRule = () => {
    const progressStore = useProgressStore();
    const {selectedProgressItem, progressDetails} = progressStore;
    const getParentTask = (index) => {
        return progressDetails.value.progressItems.find(item => item.index === index) || null;
    }
    const {t} = useI18n();
    return {
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
        planStartDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, value, selectedProgressItem.value.planEndDate, "E-CM-020"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateChooseDateRelation(rule, value, callback, selectedProgressItem.value, progressDetails.value.progressItems, false),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, getParentTask(selectedProgressItem.value.parentIndex)?.planStartDate, value, "E-CM-032"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback,  value, getParentTask(selectedProgressItem.value.parentIndex)?.planEndDate, "E-CM-035"),
                trigger: "blur",
            }
        ],
        planEndDate: [
            { required: true, message: t("E-CM-002"), trigger: "blur" },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, selectedProgressItem.value.planStartDate, value, "E-CM-028"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateChooseDateRelation(rule, value, callback, selectedProgressItem.value, progressDetails.value.progressItems, false),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, value, getParentTask(selectedProgressItem.value.parentIndex)?.planEndDate, "E-CM-033"),
                trigger: "blur",
            }
        ],
        actualStartDate: [
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, value, selectedProgressItem.value.actualEndDate, "E-CM-020"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, getParentTask(selectedProgressItem.value.parentIndex)?.actualStartDate, value, "E-CM-032"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateChooseDateRelation(rule, value, callback, selectedProgressItem.value, progressDetails.value.progressItems, false, true),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback,  value, getParentTask(selectedProgressItem.value.parentIndex)?.actualEndDate, "E-CM-035"),
                trigger: "blur",
            }
        ],
        actualEndDate: [
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, selectedProgressItem.value.actualStartDate, value, "E-CM-028"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, new Date(), value, "E-CM-022"),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateChooseDateRelation(rule, value, callback, selectedProgressItem.value, progressDetails.value.progressItems, false, true),
                trigger: "blur",
            },
            {
                validator: (rule, value, callback) =>
                    validateStartBeforeEnd(rule, value, callback, value, getParentTask(selectedProgressItem.value.parentIndex)?.actualEndDate, "E-CM-033"),
                trigger: "blur",
            }
        ],
        dependency: [
            {
                validator: (rule, value, callback) =>
                    validateChooseTypeRelation(rule, value, callback, selectedProgressItem.value, progressDetails.value.progressItems, false),
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
                        (selectedProgressItem.value.quantity * selectedProgressItem.value.unitPrice),
                        "",
                        t("E-PLAN-001"),
                    ),
                trigger: "change",
            }
        ],
    }
};
