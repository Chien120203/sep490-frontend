import { defineStore } from "pinia";
import { reactive } from "vue";
import { mixinMethods } from "@/utils/variables";
import services from "@/plugins/services";
import { useI18n } from "vue-i18n";
import {usePersistenceStore} from "@/store/persistence.js";

export const useSiteSurveyStore = defineStore(
    "siteSurvey",
    () => {
        const { t } = useI18n();
        const persist = usePersistenceStore();
        const {projectId} = persist;
        const validation = reactive({ value: {} });
        const isShowModalConfirm = reactive({ value: false });
        const totalItems = reactive({ value: 0 });
        const currentPage = reactive({ value: 0 });
        const isSiteSurveyNull = reactive({ value: false });
        const siteSurveyDetails = reactive({
            value: {
                id: 0,
                projectId: projectId.value,
                siteSurveyName: "",
                constructionRequirements: "",
                equipmentRequirements: "",
                humanResourceCapacity: "",
                riskAssessment: "",
                biddingDecision: 0,
                profitAssessment: "",
                bidWinProb: null,
                estimatedExpenses: null,
                estimatedProfits: null,
                tenderPackagePrice: null,
                totalBidPrice: null,
                discountRate: null,
                projectCost: null,
                finalProfit: null,
                status: 1,
                comments: "",
                attachments: [],
                surveyDetails: null
            }
        });

        const getSurveyDetails = async (id) => {
            mixinMethods.startLoading();
            await services.SiteSurveyAPI.details(
                {projectId: id},
                (response) => {
                    if (!response.data) isSiteSurveyNull.value = true;
                    else siteSurveyDetails.value = response.data;
                    mixinMethods.endLoading();
                },
                (error) => {
                    mixinMethods.notifyError(t("response.message.get_survey_dtls_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const saveSurvey = async (params) => {
            mixinMethods.startLoading();
            const formData = mixinMethods.createFormData(params);
            await services.SiteSurveyAPI.save(
                formData,
                (response) => {
                    siteSurveyDetails.value = response.data;
                    mixinMethods.notifySuccess(t("response.message.save_survey_success"));
                    mixinMethods.endLoading();
                },
                (error) => {
                    validation.value = mixinMethods.handleErrorResponse(error.responseCode);
                    mixinMethods.notifyError(t("response.message.save_survey_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const clearSurveyDetails = () => {
            siteSurveyDetails.value = {
                id: 0,
                siteSurveyName: "",
                constructionRequirements: "",
                equipmentRequirements: "",
                humanResourceCapacity: "",
                riskAssessment: "",
                biddingDecision: null,
                profitAssessment: "",
                bidWinProb: null,
                estimatedExpenses: null,
                estimatedProfits: null,
                tenderPackagePrice: null,
                totalBidPrice: null,
                discountRate: null,
                projectCost: null,
                finalProfit: null,
                status: null,
                comments: "",
                attachments: "",
                surveyDetails: null
            };
        };

        return {
            validation,
            totalItems,
            currentPage,
            siteSurveyDetails,
            isShowModalConfirm,
            isSiteSurveyNull,
            getSurveyDetails,
            clearSurveyDetails,
            saveSurvey
        };
    }
);
