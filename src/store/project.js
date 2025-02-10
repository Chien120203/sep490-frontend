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
    const currentPage = reactive({ value: 0 });
    const listProjects = reactive({
      value: [
        {
          id: 1,
          project_code: "PRJ001",
          project_name: "Smart City Development",
          customer_id: 101,
          construct_type: "Infrastructure",
          location: "Ho Chi Minh City, Vietnam",
          area: "5000 sqm",
          timeline: "2024-2026",
          purpose: "Urban development",
          technical_reqs: "Smart grid, IoT sensors",
          start_date: "2024-01-10",
          end_date: "2026-12-15",
          budget: 50000000,
          status: "In Progress",
          attachment: "smart_city_plan.pdf",
          description: "A project focused on developing smart city infrastructure."
        },
        {
          id: 2,
          project_code: "PRJ002",
          project_name: "Renewable Energy Plant",
          customer_id: 102,
          construct_type: "Energy",
          location: "Hanoi, Vietnam",
          area: "12000 sqm",
          timeline: "2023-2025",
          purpose: "Solar power generation",
          technical_reqs: "Solar panels, battery storage",
          start_date: "2023-06-01",
          end_date: "2025-11-30",
          budget: 75000000,
          status: "Planning",
          attachment: "renewable_energy_docs.pdf",
          description: "Construction of a solar power plant for clean energy."
        },
        {
          id: 3,
          project_code: "PRJ003",
          project_name: "E-commerce Platform Upgrade",
          customer_id: 103,
          construct_type: "Software",
          location: "Da Nang, Vietnam",
          area: "N/A",
          timeline: "2024-2025",
          purpose: "Enhance e-commerce capabilities",
          technical_reqs: "Cloud infrastructure, AI recommendation",
          start_date: "2024-03-20",
          end_date: "2025-06-15",
          budget: 15000000,
          status: "Ongoing",
          attachment: "ecommerce_upgrade_specs.pdf",
          description: "Upgrading the e-commerce platform with new AI features."
        }
      ]
    });
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
      // mixinMethods.startLoading();
      await services.ProjectAPI.list(
        params,
        (response) => {


          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(
            error.responseCode
          );
          mixinMethods.notifyError(t("response.message.get_customer_failed"));
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
