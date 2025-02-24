import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useProjectStore = defineStore(
  "project",
  () => {
    const {t} = useI18n();
    const validation = reactive({ value: {} });
    const isShowModalConfirm = reactive({ value: false });
    const isShowModalCreate = reactive({ value: false });
    const totalItems = reactive({ value: 0 });
    const currentPage = reactive({ value: 1 });
    const listProjects = reactive({ value: [] });
    const projectDetails = reactive({
      value:{
        id: 0,
        projectCode: "",
        projectName: "",
        customerId: "",
        constructType: "",
        location: "",
        area: 0,
        timeline: "",
        purpose: "",
        technicalReqs: "",
        startDate: "",
        endDate: "",
        budget: 0,
        status: 0,
        attachment: "",
        description: ""
      }
    });

    const getListProjects = async (params) => {
      mixinMethods.startLoading();
      await services.ProjectAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listProjects.value = response.data;
          } else {
            listProjects.value = [...listProjects.value, ...response.data];
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_projects_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const saveProject = async (params) => {
      mixinMethods.startLoading();
      await services.ProjectAPI.save(
        params,
        (response) => {
          if(response.success) {
            projectDetails.value = {...response.data, customerId: response.data.customer.id};
            mixinMethods.notifySuccess(t("response.message.save_project_success"));
          }else {
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

    const handleDeleteProject = async (id) => {
      alert("delete customer "+ id)
      isShowModalConfirm.value = false;
    }

    const handleGetProjectDtls = () => {
    }

    const clearProjectDetails = () => {
      projectDetails.value = {
        id: 0,
        projectCode: "",
        projectName: "",
        customerId: "",
        constructType: "",
        location: "",
        area: 0,
        timeline: "",
        purpose: "",
        technicalReqs: "",
        startDate: "",
        endDate: "",
        budget: 0,
        status: 0,
        attachment: "",
        description: ""
      };
    };

    return {
      validation,
      listProjects, // temporary
      totalItems,
      currentPage,
      projectDetails,
      isShowModalConfirm,
      isShowModalCreate,
      saveProject,
      clearProjectDetails,
      getListProjects,
      handleGetProjectDtls,
      handleDeleteProject
    };
  }
);
