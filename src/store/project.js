import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";

export const useProjectStore = defineStore(
  "project",
  () => {
    const {t} = useI18n();
    const validation = reactive({ value: {} });
    const router = useRouter();
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
        customerCode: "",
        constructType: "",
        location: "",
        area: "",
        purpose: "",
        technicalReqs: "",
        startDate: "",
        endDate: "",
        budget: 0,
        status: 0,
        technicalManager: "",
        constructionManager: "",
        resourceManager: "",
        attachments: [],
        description: "",
        viewerUserIds: null
      }
    });
    const chartData = reactive({
      labels: [
        t('project.statuses.receive_reqs'),
        t('project.statuses.planning'),
        t('project.statuses.in_progress'),
        t('project.statuses.complete'),
        t('project.statuses.paused'),
        t('project.statuses.close'),
      ],
      datasets: [
        {
          data: [],
          backgroundColor: ["#1f7885", "#1f4261", "#28b5b5", "#3e8e22", "#4c4b4b", "#dc3545"],
          hoverOffset: 4,
        },
      ],
    });

    const getListProjects = async (params, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
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

    const getProjectChart = async () => {
      await services.ProjectAPI.getChart(
        {},
        (response) => {
          const { total, ...filteredData } = response.data;
          chartData.datasets[0].data = Object.values(filteredData);
        },
        (error) => {
        }
      );
    };

    const saveProject = async (params) => {
      mixinMethods.startLoading();
      const formData = mixinMethods.createFormData(params);
      await services.ProjectAPI.save(
        formData,
        (response) => {
          if(response.success) {
            projectDetails.value = {...response.data, customerId: response.data.customer.id};
            validation.value = [];
            router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: response.data.id}});
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

    const getProjectDetails = async (id) => {
      mixinMethods.startLoading();
      await services.ProjectAPI.details(
        id,
        {},
        (response) => {
          projectDetails.value = {...response.data, customerCode: response.data?.customer.customerCode, customerId: response.data?.customer.id};

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_projects_failed"));
          mixinMethods.endLoading();
        }
      );
    }

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
        area: "",
        timeline: "",
        purpose: "",
        technicalReqs: "",
        startDate: "",
        endDate: "",
        budget: 0,
        technicalManager: "",
        constructionManager: "",
        resourceManager: "",
        status: 0,
        attachment: "",
        description: "",
        viewerUserIds: null
      };
    };

    return {
      validation,
      listProjects, // temporary
      totalItems,
      currentPage,
      projectDetails,
      isShowModalConfirm,
      chartData,
      isShowModalCreate,
      getProjectDetails,
      getProjectChart,
      saveProject,
      clearProjectDetails,
      getListProjects,
      handleGetProjectDtls,
      handleDeleteProject
    };
  }
);
