import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import PAGE_NAME from "@/constants/route-name.js";
import {CONSTRUCTION_MANAGER} from "@/constants/roles.js";

export const useConstructLog = defineStore(
  "construct-log",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const router = useRouter();
    const isShowModalConfirm = reactive({value: false});
    const isShowModalCreate = reactive({value: false});
    const listConstructLog = reactive({
      value: []
    });
    const constructLogDetails = reactive({
      value: {
        id: 0,
        logCode: "",
        logName: "",
        logDate: "",
        projectId: 0,
        resources: [],
        workAmount: [],
        weather: [
          {type: t("weather.condition"), values: ["", "", "", ""]},
          {type: t("weather.temperature"), values: ["", "", "", ""]},
        ],
        safety: "",
        quality: "",
        progress: "",
        problem: "",
        advice: "",
        status: 2,
        images: [],
        attachmentFiles: [],
        note: "",
      }
    });
    const resourceLogByTask = reactive({
      value: {
        workAmount: [
          // April 1 - 30
          ...Array.from({length: 30}, (_, i) => {
            const day = i + 1;
            return {
              logDate: `2025-04-${day.toString().padStart(2, "0")}`,
              workAmount: (day % 5 === 0) ? 3 : 2 // Slight variation every 5th day
            };
          })
        ],
        resources: [
          // Machines (resourceId: 1)
          ...Array.from({length: 30}, (_, i) => ({
            logDate: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
            resourceId: 1,
            resourceType: 2,
            unit: "giờ",
            quantity: 8 + (i % 5) // Varies between 8–12
          })),

          // Humans (resourceId: 2)
          ...Array.from({length: 30}, (_, i) => ({
            logDate: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
            resourceId: 2,
            resourceType: 1,
            unit: "giờ",
            quantity: 6 + ((i * 3) % 7) // Varies between 6–12
          })),

          // Materials (resourceId: 3)
          ...Array.from({length: 30}, (_, i) => ({
            logDate: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
            resourceId: 3,
            resourceType: 3,
            unit: "tấn",
            quantity: 3 + (i % 6) // Varies between 3–8
          }))
        ]
      }
    });
    const listLogsByTask = reactive({
      value: []
    })

    const getListProjectLogs = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.ConstructLogAPI.list(
        params,
        (response) => {
          listConstructLog.value = response.data;
          if(localStorage.getItem('role') === CONSTRUCTION_MANAGER) {
            listConstructLog.value = listConstructLog.value.filter((item) => item.creator == localStorage.getItem('userId'))
          }
          mixinMethods.endLoading();
        },
        (error) => {
            validation.value = mixinMethods.handleErrorResponse(error.responseCode);
            mixinMethods.notifyError(t("response.message.get_construct_log_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const getConstructLogDetails = async (id, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.ConstructLogAPI.details(
        id,
        {},
        (response) => {
          constructLogDetails.value = {...response.data, images: response.data.images.map(item => item.webContentLink)};
          mixinMethods.endLoading();
        },
        (error) => {
            validation.value = mixinMethods.handleErrorResponse(error.responseCode);
            mixinMethods.notifyError(t("response.message.get_construct_log_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const getListLogsByTask = async (projectId, taskIndex, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.ConstructLogAPI.listLogsByTask(
        projectId,
        taskIndex,
        {},
        (response) => {
          listLogsByTask.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
            validation.value = mixinMethods.handleErrorResponse(error.responseCode);
            mixinMethods.notifyError(t("response.message.get_logs_by_task_failed"))
          mixinMethods.endLoading();
        }
      );
    };

    const saveConstructLog = async (params) => {
      mixinMethods.startLoading();
      const formData = mixinMethods.createFormData(params, [], ["weather", "resources", "workAmount"]);
      await services.ConstructLogAPI.save(
        formData,
        (response) => {
          mixinMethods.endLoading();
          mixinMethods.notifySuccess(t("response.message.save_construct_log_success"));
          if(params.id !== 0) {
            constructLogDetails.value = {...response.data, images: response.data.images.map(item => item.webContentLink)};
          } else {
            router.push({name: PAGE_NAME.CONSTRUCT_LOG.VIEW});
          };
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.save_construct_log_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleChangeLogStatus = async (id, method) => {
      mixinMethods.startLoading();
      await services.ConstructLogAPI[method](
        id,
        {},
        (response) => {
          getConstructLogDetails(id, false);
          mixinMethods.endLoading();
          mixinMethods.notifySuccess(t("response.message.save_construct_log_success"));
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.save_construct_log_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const clearConstructLog = () => {
      constructLogDetails.value = {
        id: 0,
        logCode: "",
        logName: "",
        logDate: "",
        projectId: 0,
        resources: [],
        workAmount: [],
          weather: [
              {type: t("weather.condition"), values: ["", "", "", ""]},
              {type: t("weather.temperature"), values: ["", "", "", ""]},
          ],
        safety: "",
        quality: "",
        progress: "",
        problem: "",
        advice: "",
        status: 2,
        images: [],
        attachmentFiles: [],
        note: "",
      };
    }

    return {
      validation,
      listConstructLog,
      resourceLogByTask,
      listLogsByTask,
      constructLogDetails,
      isShowModalConfirm,
      isShowModalCreate,
      clearConstructLog,
      handleChangeLogStatus,
      getConstructLogDetails,
      getListLogsByTask,
      getListProjectLogs,
      saveConstructLog
    };
  }
);
