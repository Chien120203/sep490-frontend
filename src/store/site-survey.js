import { defineStore } from "pinia";
import { reactive } from "vue";
import { mixinMethods } from "@/utils/variables";
import services from "@/plugins/services";
import { useI18n } from "vue-i18n";

export const useSiteSurveyStore = defineStore(
    "siteSurvey",
    () => {
        const { t } = useI18n();
        const validation = reactive({ value: {} });
        const isShowModalConfirm = reactive({ value: false });
        const totalItems = reactive({ value: 0 });
        const currentPage = reactive({ value: 0 });
        const listSurveys = reactive({ value: [] });
        const siteSurveyDetails = reactive({
            value: {
                id: 0,
                projectId: null,
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
            }
        });

        const getListSurveys = async (params, isLoading = true) => {
            if (isLoading) mixinMethods.startLoading();
            await services.SiteSurveyAPI.list(
                params,
                (response) => {
                    if (currentPage.value === 1) {
                        listSurveys.value = response.data;
                    } else {
                        listSurveys.value = [...listSurveys.value, ...response.data];
                    }
                    totalItems.value = response.meta.total;
                    currentPage.value = response.meta.index;
                    mixinMethods.endLoading();
                },
                (error) => {
                    mixinMethods.notifyError(t("response.message.get_surveys_failed"));
                    mixinMethods.endLoading();
                }
            );
        };

        const getSurveyDetails = async (id) => {
            mixinMethods.startLoading();
            await services.SiteSurveyAPI.details(
                id,
                {},
                (response) => {
                    siteSurveyDetails.value = {
                        ...response.data,
                        projectId: response.data?.project.id,
                        attachments: response.data.attachments || []
                    };
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
            listSurveys,
            totalItems,
            currentPage,
            siteSurveyDetails,
            isShowModalConfirm,
            getSurveyDetails,
            clearSurveyDetails,
            saveSurvey,
            getListSurveys
        };
    }
);
