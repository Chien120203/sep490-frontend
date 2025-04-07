import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";

export const useConstructLog = defineStore(
  "construct-log",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const router = useRouter();
    const isShowModalConfirm = reactive({value: false});
    const isShowModalCreate = reactive({value: false});
    const listConstructLog = reactive({
      value: [
        {
          id: 1,
          name: "Log date 20/2",
          date: "2024-04-16"
        }
      ]
    });
    // const constructLogDetails = reactive({
    //   value: {
    //     id: 0,
    //     logCode: "",
    //     logName: "",
    //     logDate: "",
    //     resources:[
    //       {
    //         id: 0,
    //         taskIndex: 0,
    //         resourceType: 0,
    //         quantity: 0,
    //         resourceId: 0,
    //         startTime: "",
    //         endTime: "",
    //       }
    //     ],
    //     weather: [
    //       { type: "Điều kiện", values: ["", "", "", ""] },
    //       { type: "Nhiệt độ", values: ["", "", "", ""] },
    //     ],
    //     safety: "",
    //     quality: "",
    //     progress: "",
    //     problem: "",
    //     advice: "",
    //     images:[],
    //     attachments: [],
    //     note: "",
    //   }
    // });

    const constructLogDetails = reactive({
      value: {
        id: 101,
        logCode: "CLD-20240407",
        logName: "Log name 1",
        logDate: "2025-04-07",
        resources: [
          {
            id: 1,
            taskIndex: 0,
            resourceType: 1,
            quantity: 5,
            resourceId: 101,
            startTime: "Mon Apr 07 2025 21:37:01 GMT+0700",
            endTime: "Mon Apr 07 2025 21:37:01 GMT+0700",
          },
          {
            id: 2,
            taskIndex: 1,
            resourceType: 2,
            quantity: 3,
            resourceId: 102,
            startTime: "Mon Apr 07 2025 21:37:01 GMT+0700",
            endTime: "Mon Apr 07 2025 21:37:01 GMT+0700",
          }
        ],
        weather: [
          { type: "Điều kiện", values: ["Nắng", "Âm u", "Mưa nhẹ", "Mưa to"] },
          { type: "Nhiệt độ", values: ["30°C", "29°C", "27°C", "26°C"] },
        ],
        safety: "Không có sự cố an toàn",
        quality: "Đảm bảo chất lượng thi công",
        progress: "Đã hoàn thành 80% công việc trong ngày",
        problem: "Chậm trễ do thiếu vật liệu",
        advice: "Cần chuẩn bị vật tư sớm hơn",
        images: [],
        attachments: [
        ],
        note: "Ngày làm việc hiệu quả"
      }
    });
    const getListProjectLogs = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.ConstructLogAPI.list(
        params,
        (response) => {
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.endLoading();
        }
      );
    };

    return {
      validation,
      listConstructLog,
      constructLogDetails,
      isShowModalConfirm,
      isShowModalCreate,
      getListProjectLogs
    };
  }
);
