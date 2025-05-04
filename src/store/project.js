import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import PAGE_NAME from "@/constants/route-name.js";
import {RECEIVE_STATUS} from "@/constants/project.js";
import {useRouter} from "vue-router";

export const useProjectStore = defineStore(
  "project",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const router = useRouter();
    const isShowModalConfirm = reactive({value: false});
    const isShowModalCreate = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 1});
    const projectFinancial = reactive({
      labels: [
        "Planned budget",
        "Đã thực hiện",
        "Đã nghiệm thu",
        "Con lai",
      ],
      datasets: [
        {
          data: [],
          backgroundColor: ['#4B77BE', '#F9BF3B', '#1ABC9C', '#E74C3C'],
          hoverBackgroundColor: ['#5D8DC9', '#FCC962', '#26C6A9', '#ED6B5A'],
          hoverOffset: 4,
        },
      ],
    });
    const listProjects = reactive({value: []});
    const projectDetails = reactive({
      value: {
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
        qa: "",
        resourceManager: "",
        attachments: [],
        description: "",
        viewerUserIds: null,
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
      if (isLoading) mixinMethods.startLoading();
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

    const getProjectStatistic = async (projectId = "", isLoading) => {
      if (isLoading) mixinMethods.startLoading();
      await services.ProjectAPI.getStatistic(
        projectId,
        {},
        (response) => {
          projectFinancial.datasets[0].data = response.data.statistics.map(item => item.value);
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.endLoading();
        }
      );
    };

    const getProjectChart = async () => {
      await services.ProjectAPI.getChart(
        {},
        (response) => {
          const {total, ...filteredData} = response.data;
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
          projectDetails.value = {...response.data, customerId: response.data.customer.id};
          validation.value = [];
          router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: response.data.id}});
          mixinMethods.notifySuccess(t("response.message.save_project_success"));
          mixinMethods.endLoading();
          router.push({name: PAGE_NAME.PROJECT.LIST});
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_project_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const updateProjectStatus = async (projectId, status) => {
      await mixinMethods.startLoading();
      await services.ProjectAPI.updateStatus(
        {
          projectId: projectId,
          targetStatus: status,
          notes: ""
        },
        (response) => {
          getProjectDetails(projectId);
          mixinMethods.notifySuccess(t("common.success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("common.failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const getProjectDetails = async (id, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
      await services.ProjectAPI.details(
        id,
        {},
        (response) => {
          projectDetails.value = {
            ...response.data,
            customerCode: response.data?.customer.customerCode,
            customerId: response.data?.customer.id
          };

          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_project_details_failed"));
          mixinMethods.endLoading();
        }
      );
    }

    const handleDeleteProject = async (id) => {
      mixinMethods.startLoading();
      await services.ProjectAPI.deleteProject(
        id,
        (response) => {
          listProjects.value = listProjects.value.filter(project => project.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_project_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_project_failed"));
          mixinMethods.endLoading();
        }
      );
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
        status: 0,
        budget: 0,
        technicalManager: "",
        constructionManager: "",
        resourceManager: "",
        attachment: "",
        description: "",
        viewerUserIds: null,
      };
    };

    return {
      validation,
      listProjects, // temporary
      totalItems,
      currentPage,
      projectFinancial,
      projectDetails,
      isShowModalConfirm,
      chartData,
      isShowModalCreate,
      getProjectDetails,
      updateProjectStatus,
      getProjectChart,
      saveProject,
      clearProjectDetails,
      getListProjects,
      handleGetProjectDtls,
      handleDeleteProject,
      getProjectStatistic
    };
  }
);
