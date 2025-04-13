import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const usePlanningStore = defineStore(
  "planning",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listPlannings = reactive({value: []});
    const planSelectedRow = reactive({value: {
        createdAt: "",
        updatedAt: "",
        creator: "",
        updater: "",
        workName: "",
        index: "",
        parentIndex: "",
        itemRelations: [],
        details: [],
        quantity: "",
        startDate: "",
        endDate: "",
        total: 0,
        unit: "",
        unitPrice: 0,
      }});
    const planningDetails = reactive({
      value: {
        planName: "",
        projectId: "",
        teamIds: [],
        planItems: [],
        reviewers: []
      }
    });
    // const approveStatuses = reactive({value: []});
    const approveStatuses = reactive({
      value: [
        {
          id: 4,
          name: "Technical Manager",
          role: "Technical Manager",
          email: "longrpk200315@gmail.com",
          isApproved: true
        },
        {
          id: 6,
          name: "Executive Board",
          role: "Executive Board",
          email: "longrpk200317@gmail.com",
          isApproved: ""
        },
        {
          id: 8,
          name: "Resource Manager",
          role: "Resource Manager",
          email: "longrpk200319@gmail.com",
          isApproved: true
        }
      ]
    });
    const getListPlannings = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.PlanningAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listPlannings.value = response.data;
          } else {
            listPlannings.value = [...listPlannings.value, ...response.data];
          }
          totalItems.value = response.meta?.total;
          currentPage.value = response.meta?.index;

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_planning_failed"));
          mixinMethods.endLoading();
        }
      );
      await mixinMethods.endLoading();
    };

    const getPlanningDetails = async (id) => {
      mixinMethods.startLoading();
      await services.PlanningAPI.details(
        id,
        {},
        (response) => {
          planningDetails.value = {...response.data, reviewers: [...response.data.reviewers.map(reviewer => reviewer.id)]};
          // approveStatuses.value = [...response.data.reviewers, {isBODApprove: response.data.isApproved}];
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.get_planning_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const savePlanning = async (params, method = "create") => {
      mixinMethods.startLoading();
      await services.PlanningAPI[method](
        params,
        (response) => {
          if (response.success) {
            planningDetails.value = {...response.data, reviewers: [...response.data.reviewers.map(reviewer => reviewer.id)]};
            validation.value = [];
            mixinMethods.notifySuccess(t("response.message.save_project_success"));
          } else {
            validation.value = mixinMethods.handleErrorResponse(response);
            mixinMethods.notifyError(t("response.message.save_project_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.save_project_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const approvePlanning = async () => {
      mixinMethods.startLoading();
      let currentEmail = localStorage.getItem('email');
      let userId = approveStatuses.value.find(item => item.email === currentEmail)?.id;
      if(!userId) {
        mixinMethods.notifyError(t("response.message.save_project_failed"));
        await mixinMethods.endLoading();
        return;
      }
      await services.PlanningAPI.approve(
        {
          actionBy: userId,
          planId: planningDetails.value.id,
          isApproved: true,
          rejectReason: "abc"
        },
        (response) => {
          if (response.success) {
            mixinMethods.notifySuccess(t("response.message.save_project_success"));
          } else {
            validation.value = mixinMethods.handleErrorResponse(response);
            mixinMethods.notifyError(t("response.message.save_project_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.save_project_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeletePlan = async (id) => {
      mixinMethods.startLoading();
      await services.PlanningAPI.deletePlan(
        id,
        (response) => {
          if(response.success) {
            listPlannings.value = listPlannings.value.filter(customer => customer.id !== id);
            mixinMethods.notifySuccess(t("response.message.delete_plan_success"));
          } else {
            mixinMethods.notifyError(t("response.message.delete_plan_failed"));
          }
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.endLoading();
        }
      );
    }

    const clearPlanningDetails = () => {
      planningDetails.value = {
        planName: "",
        projectId: "",
        teamIds: [],
        planItems: [],
        reviewers: []
      };
    }

    return {
      validation,
      listPlannings, // temporary
      totalItems,
      currentPage,
      planSelectedRow,
      planningDetails,
      approveStatuses,
      isShowModalConfirm,
      approvePlanning,
      clearPlanningDetails,
      handleDeletePlan,
      getListPlannings,
      getPlanningDetails,
      savePlanning
    };
  }
);