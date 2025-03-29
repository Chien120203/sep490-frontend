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
    const planningDetails = reactive({
      value: {
        planName: "",
        projectId: "",
        teamIds: [],
        planItems: [],
        qaIds: []
      }
    });

    const getListPlannings = async (params, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
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
      mixinMethods.endLoading();
    };

    return {
      validation,
      listPlannings, // temporary
      totalItems,
      currentPage,
      planningDetails,
      isShowModalConfirm,
      getListPlannings
    };
  }
);