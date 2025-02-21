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
    const totalItems = reactive({ value: 0 });
    const currentPage = reactive({ value: 1 });
    const listProjects = reactive({ value: [] });
    const projectDetails = reactive({
      value:{
        id: 0,
        project_code: "",
        project_name: "",
        customer_id: 0,
        construct_type: "",
        location: "",
        area: "",
        timeline: "",
        purpose: "",
        technical_reqs: "",
        start_date: "",
        end_date: "",
        budget: 0,
        status: 0,
        attachment: "",
        description: ""
      }
    })

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

    const handleDeleteProject = async (id) => {
      alert("delete customer "+ id)
      isShowModalConfirm.value = false;
    }

    const handleGetProjectDtls = () => {

    }

    return {
      validation,
      listProjects, // temporary
      totalItems,
      currentPage,
      projectDetails,
      isShowModalConfirm,
      getListProjects,
      handleGetProjectDtls,
      handleDeleteProject
    };
  }
);
