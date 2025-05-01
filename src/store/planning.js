import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import {EXECUTIVE_BOARD} from "@/constants/roles.js";

export const usePlanningStore = defineStore(
  "planning",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listPlannings = reactive({value: []});
    const planSelectedRow = reactive({
      value: {
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
      }
    });
    const planningDetails = reactive({
      value: {
        planName: "",
        projectId: "",
        teamIds: [],
        planItems: [],
        reviewers: []
      }
    });
    const approveStatuses = reactive({value: []});
    const isLocked = reactive({value: false});
    const lockInfo = reactive({value: null});
    const taskPlanDetails = reactive({
      value: {
        id: 1,
        planName: "April Maintenance Plan",
        projectId: 101,
        planItems: [
          {
            id: 1,
            taskName: "Inspect Conveyor Belt",
            startDate: "2025-04-15",
            endDate: "2025-04-16",
            assignedTo: "John Doe",
            status: "Planned"
          },
          {
            id: 2,
            taskName: "Lubricate Gears",
            startDate: "2025-04-17",
            endDate: "2025-04-18",
            assignedTo: "Jane Smith",
            status: "Planned"
          }
        ],
        reviewers: [
          {
            id: 1,
            name: "Emily Johnson",
            role: "Supervisor"
          },
          {
            id: 2,
            name: "Michael Lee",
            role: "Quality Assurance"
          }
        ]
      }
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
          planningDetails.value = {
            ...response.data
          };
          approveStatuses.value = response.data.reviewers;
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
          planningDetails.value = {
            ...response.data,
            reviewers: [...response.data.reviewers.map(reviewer => reviewer.id)]
          };
          validation.value = [];
          mixinMethods.notifySuccess(t("response.message.save_planning_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_planning_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const approvePlanning = async () => {
      mixinMethods.startLoading();
      let currentEmail = localStorage.getItem('email');
      let userId = approveStatuses.value.find(item => item.email === currentEmail)?.id;
      if (!userId) {
        mixinMethods.notifyError(t("response.message.approve_planning_failed"));
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
          getPlanningDetails(planningDetails.value.id);
          mixinMethods.notifySuccess(t("response.message.approve_planning_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.approve_planning_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const rejectPlanning = async () => {
      mixinMethods.startLoading();
      let currentEmail = localStorage.getItem('email');
      let userId = approveStatuses.value.find(item => item.email === currentEmail)?.id;
      if (!userId) {
        mixinMethods.notifyError(t("response.message.reject_planning_failed"));
        await mixinMethods.endLoading();
        return;
      }
      await services.PlanningAPI.reject(
        {
          actionBy: userId,
          planId: planningDetails.value.id,
          isApproved: true,
          rejectReason: "abc"
        },
        (response) => {
          const currentEmail = localStorage.getItem("email");
          approveStatuses.value.find(p => {
            if (p.role === EXECUTIVE_BOARD && p.email === currentEmail) {
              return p.isApproved = false;
            }
          });
          getPlanningDetails(planningDetails.value.id);
          mixinMethods.notifySuccess(t("response.message.reject_planning_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.reject_planning_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeletePlan = async (id) => {
      mixinMethods.startLoading();
      await services.PlanningAPI.deletePlan(
        id,
        (response) => {
          listPlannings.value = listPlannings.value.filter(customer => customer.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_plan_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.delete_plan_failed"));
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

    const acquireLock = async (planId) => {
      // await services.PlanningAPI.acquireLock(
      //   { planId },
      //   (response) => {
      //     lockInfo.value = response.data;
      //     isLocked.value = true;
      //     mixinMethods.endLoading();
      //   },
      //   (error) => {
      //     if (error.responseCode === "E-CP-007") {
      //       // Plan is locked by another user
      //       checkLockStatus(planId);
      //     } else {
      //       mixinMethods.notifyError(t("response.message.acquire_lock_failed"));
      //     }
      //     mixinMethods.endLoading();
      //   }
      // );
    };

    const releaseLock = async (planId) => {
      // if (!isLocked.value || !lockInfo.value) return;
      //
      // mixinMethods.startLoading();
      // await services.PlanningAPI.releaseLock(
      //   { planId },
      //   (response) => {
      //     lockInfo.value = null;
      //     isLocked.value = false;
      //     mixinMethods.endLoading();
      //   },
      //   (error) => {
      //     mixinMethods.notifyError(t("response.message.release_lock_failed"));
      //     mixinMethods.endLoading();
      //   }
      // );
    };

    const checkLockStatus = async (planId) => {
      // await services.PlanningAPI.getLockStatus(
      //   planId,
      //   (response) => {
      //     isLocked.value = response.data.locked;
      //     lockInfo.value = response.data.lockInfo;
      //     mixinMethods.endLoading();
      //   },
      //   (error) => {
      //     mixinMethods.notifyError(t("response.message.check_lock_failed"));
      //     mixinMethods.endLoading();
      //   }
      // );
    };

    const extendLock = async (planId) => {
      // if (!isLocked.value || !lockInfo.value) return;
      //
      // await services.PlanningAPI.extendLock(
      //   { planId },
      //   (response) => {
      //     lockInfo.value = response.data;
      //   },
      //   (error) => {
      //     mixinMethods.notifyError(t("response.message.extend_lock_failed"));
      //   }
      // );
    };

    return {
      validation,
      listPlannings, // temporary
      totalItems,
      currentPage,
      planSelectedRow,
      planningDetails,
      approveStatuses,
      isShowModalConfirm,
      taskPlanDetails,
      isLocked,
      lockInfo,
      approvePlanning,
      rejectPlanning,
      clearPlanningDetails,
      handleDeletePlan,
      savePlanning,
      getListPlannings,
      getPlanningDetails,
      acquireLock,
      releaseLock,
      checkLockStatus,
      extendLock
    };
  }
);