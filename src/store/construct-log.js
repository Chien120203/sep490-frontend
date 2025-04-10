import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
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
          logCode: "LOG-20250409-001",
          logName: "Foundation Work",
          logDate: "2025-04-09",
          resources: [
            {
              id: 1,
              taskIndex: 1,
              resourceType: 1, // Labor
              quantity: 3,
              resourceId: 101,
              startTime: "07:00",
              endTime: "12:00"
            },
            {
              id: 2,
              taskIndex: 2,
              resourceType: 2, // Machinery
              quantity: 1,
              resourceId: 202,
              startTime: "08:00",
              endTime: "14:00"
            },
            {
              id: 3,
              taskIndex: 3,
              resourceType: 3, // Material
              quantity: 50,
              resourceId: 303,
              startTime: "09:00",
              endTime: "11:30"
            }
          ],
          workAmount: [
            {
              id: 1,
              taskIndex: 1,
              workAmount: 15
            },
            {
              id: 2,
              taskIndex: 2,
              workAmount: 10
            },
            {
              id: 3,
              taskIndex: 3,
              workAmount: 12
            }
          ],
          weather: [
            {type: "Điều kiện", values: ["Sunny", "Cloudy", "Sunny", "Clear"]},
            {type: "Nhiệt độ", values: ["26°C", "28°C", "27°C", "25°C"]}
          ],
          safety: "No incidents.",
          quality: "Work passed inspection.",
          progress: "Foundation completed.",
          problem: "Minor delay due to late material delivery.",
          advice: "Confirm supplier schedule in advance.",
          images: ["https://example.com/img/foundation1.jpg"],
          attachments: ["https://example.com/docs/foundation-report.pdf"],
          note: "Ready to move to next phase."
        },
        {
          id: 2,
          logCode: "LOG-20250410-002",
          logName: "Column Erection",
          logDate: "2025-04-10",
          resources: [
            {
              id: 1,
              taskIndex: 2,
              resourceType: 1, // Labor
              quantity: 3,
              resourceId: 101,
              startTime: "07:00",
              endTime: "12:00"
            },
            {
              id: 2,
              taskIndex: 1,
              resourceType: 2, // Machinery
              quantity: 1,
              resourceId: 202,
              startTime: "08:00",
              endTime: "14:00"
            },
            {
              id: 3,
              taskIndex: 3,
              resourceType: 3, // Material
              quantity: 50,
              resourceId: 303,
              startTime: "09:00",
              endTime: "11:30"
            }
          ],
          workAmount: [
            {
              id: 1,
              taskIndex: 2,
              workAmount: 15
            },
            {
              id: 2,
              taskIndex: 1,
              workAmount: 10
            },
            {
              id: 3,
              taskIndex: 3,
              workAmount: 12
            }
          ],
          weather: [
            {type: "Điều kiện", values: ["Cloudy", "Rainy", "Rainy", "Clear"]},
            {type: "Nhiệt độ", values: ["24°C", "23°C", "22°C", "25°C"]}
          ],
          safety: "Minor slip incident reported, no injury.",
          quality: "Columns aligned and set correctly.",
          progress: "50% of columns erected.",
          problem: "Rain caused delay in second half.",
          advice: "Ensure waterproof covers are ready.",
          images: ["https://example.com/img/columns1.jpg"],
          attachments: ["https://example.com/docs/column-work.pdf"],
          note: "Continue remaining columns tomorrow."
        },
        {
          id: 3,
          logCode: "LOG-20250411-003",
          logName: "Slab Pouring",
          logDate: "2025-04-11",
          resources: [
            {
              id: 1,
              taskIndex: 3,
              resourceType: 1, // Labor
              quantity: 3,
              resourceId: 101,
              startTime: "07:00",
              endTime: "12:00"
            },
            {
              id: 2,
              taskIndex: 2,
              resourceType: 2, // Machinery
              quantity: 1,
              resourceId: 202,
              startTime: "08:00",
              endTime: "14:00"
            },
            {
              id: 3,
              taskIndex: 1,
              resourceType: 3, // Material
              quantity: 50,
              resourceId: 303,
              startTime: "09:00",
              endTime: "11:30"
            }
          ],
          workAmount: [
            {
              id: 1,
              taskIndex: 3,
              workAmount: 15
            },
            {
              id: 2,
              taskIndex: 2,
              workAmount: 10
            },
            {
              id: 3,
              taskIndex: 1,
              workAmount: 12
            }
          ],
          weather: [
            {type: "Điều kiện", values: ["Clear", "Sunny", "Cloudy", "Sunny"]},
            {type: "Nhiệt độ", values: ["27°C", "29°C", "28°C", "26°C"]}
          ],
          safety: "All workers wore PPE.",
          quality: "Concrete samples taken for test.",
          progress: "Slab pouring 100% complete.",
          problem: "Mixer truck arrived 1 hour late.",
          advice: "Schedule trucks with buffer time.",
          images: ["https://example.com/img/slab1.jpg"],
          attachments: ["https://example.com/docs/slab-checklist.pdf"],
          note: "Curing to start tomorrow."
        }
      ]
    });
    const constructLogDetails = reactive({
      value: {
        id: 0,
        logCode: "",
        logName: "",
        logDate: "",
        resources: [
          // {
          //   id: 0,
          //   taskIndex: 0,
          //   resourceType: 0,
          //   quantity: 0,
          //   resourceId: 0,
          //   startTime: "",
          //   endTime: "",
          // }
        ],
        workAmount: [
          // {
          //   id: 0,
          //   taskIndex: 0,
          //   workAmount: 0,
          // }
        ],
        weather: [
          {type: "Điều kiện", values: ["", "", "", ""]},
          {type: "Nhiệt độ", values: ["", "", "", ""]},
        ],
        safety: "",
        quality: "",
        progress: "",
        problem: "",
        advice: "",
        images: [],
        attachments: [],
        note: "",
      }
    });
    // const listLogsByTask = reactive({
    //   value: {
    //     resources: [
    //       {
    //         id: 1,
    //         taskIndex: 1,
    //         resourceType: 1, // Labor
    //         quantity: 3,
    //         resourceId: 101,
    //         startTime: "07:00",
    //         endTime: "12:00",
    //         logDate: "2025-04-09"
    //       },
    //       {
    //         id: 2,
    //         taskIndex: 1,
    //         resourceType: 2, // Machinery
    //         quantity: 1,
    //         resourceId: 202,
    //         startTime: "08:00",
    //         endTime: "14:00",
    //         logDate: "2025-04-19"
    //       },
    //       {
    //         id: 3,
    //         taskIndex: 1,
    //         resourceType: 3, // Material
    //         quantity: 50,
    //         resourceId: 303,
    //         startTime: "09:00",
    //         endTime: "11:30",
    //         logDate: "2025-04-29"
    //       },
    //       {
    //         id: 4,
    //         taskIndex: 1,
    //         resourceType: 1,
    //         quantity: 4,
    //         resourceId: 104,
    //         startTime: "06:30",
    //         endTime: "11:00",
    //         logDate: "2025-05-01"
    //       },
    //       {
    //         id: 5,
    //         taskIndex: 1,
    //         resourceType: 2,
    //         quantity: 2,
    //         resourceId: 205,
    //         startTime: "07:45",
    //         endTime: "13:00",
    //         logDate: "2025-05-02"
    //       },
    //       {
    //         id: 6,
    //         taskIndex: 1,
    //         resourceType: 3,
    //         quantity: 40,
    //         resourceId: 307,
    //         startTime: "10:00",
    //         endTime: "12:00",
    //         logDate: "2025-05-03"
    //       }
    //     ],
    //
    //     workAmount: [
    //       {
    //         id: 1,
    //         taskIndex: 1,
    //         workAmount: 15,
    //         logDate: "2025-04-09"
    //       },
    //       {
    //         id: 2,
    //         taskIndex: 1,
    //         workAmount: 10,
    //         logDate: "2025-04-19"
    //       },
    //       {
    //         id: 3,
    //         taskIndex: 1,
    //         workAmount: 12,
    //         logDate: "2025-04-29"
    //       },
    //       {
    //         id: 4,
    //         taskIndex: 1,
    //         workAmount: 18,
    //         logDate: "2025-05-01"
    //       },
    //       {
    //         id: 5,
    //         taskIndex: 1,
    //         workAmount: 20,
    //         logDate: "2025-05-02"
    //       },
    //       {
    //         id: 6,
    //         taskIndex: 1,
    //         workAmount: 14,
    //         logDate: "2025-05-03"
    //       }
    //     ]
    //   }
    // });
    const listLogsByTask = reactive({
      value: {
        workAmount: [
          // April 1 - 30
          ...Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            return {
              logDate: `2025-04-${day.toString().padStart(2, "0")}`,
              workAmount: (day % 5 === 0) ? 3 : 2 // Slight variation every 5th day
            };
          })
        ],
        resources: [
          // Machines (resourceId: 1)
          ...Array.from({ length: 30 }, (_, i) => ({
            logDate: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
            resourceId: 1,
            resourceType: 2,
            unit: "giờ",
            quantity: 8 + (i % 5) // Varies between 8–12
          })),

          // Humans (resourceId: 2)
          ...Array.from({ length: 30 }, (_, i) => ({
            logDate: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
            resourceId: 2,
            resourceType: 1,
            unit: "giờ",
            quantity: 6 + ((i * 3) % 7) // Varies between 6–12
          })),

          // Materials (resourceId: 3)
          ...Array.from({ length: 30 }, (_, i) => ({
            logDate: `2025-04-${(i + 1).toString().padStart(2, "0")}`,
            resourceId: 3,
            resourceType: 3,
            unit: "tấn",
            quantity: 3 + (i % 6) // Varies between 3–8
          }))
        ]
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
      listLogsByTask,
      constructLogDetails,
      isShowModalConfirm,
      isShowModalCreate,
      getListProjectLogs
    };
  }
);
