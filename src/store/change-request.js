import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

export const useChangeRequestStore = defineStore(
  "change-request",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const router = useRouter();
    const isShowModalConfirm = reactive({value: false});
    const isShowModalCreate = reactive({value: false});
    const listChangeRequests = reactive({
      value: [
        {
          id: 1,
          name: "Add new server configuration",
          requestType: 1, // corresponds to CHANGE_REQUEST_TYPE_ADD
          requestDate: "2025-04-10T09:00:00Z",
          creator: "Alice Nguyen",
          status: 1, // corresponds to CR_STATUS_WAIT
        },
        {
          id: 2,
          name: "Update firewall rules",
          requestType: 2,
          requestDate: "2025-04-09T14:30:00Z",
          creator: "Bob Tran",
          status: 2, // corresponds to CR_STATUS_APPROVED
        },
        {
          id: 3,
          name: "Change database backup schedule",
          requestType: 2,
          requestDate: "2025-04-08T08:15:00Z",
          creator: "Charlie Le",
          status: 0, // corresponds to CR_STATUS_REJECTED
        },
        {
          id: 4,
          name: "Install monitoring tools",
          requestType: 1,
          requestDate: "2025-04-07T10:45:00Z",
          creator: "Dana Vu",
          status: 1,
        },
        {
          id: 5,
          name: "Upgrade RAM on all servers",
          requestType: 2,
          requestDate: "2025-04-06T11:00:00Z",
          creator: "Eddie Pham",
          status: 2,
        },
      ]
    });
    // const changeRequestDetails = reactive({
    //   value: {
    //     id: 0,
    //     requestName: "",
    //     requestDate: "",
    //     workCode: "",
    //     index: "",
    //     parentIndex: null,
    //     workName: "",
    //     unit: "",
    //     quantity: 0,
    //     unitPrice: 0,
    //     totalPrice: 0,
    //     progress: 0,
    //     status: 0,
    //     planStartDate: "",
    //     planEndDate: "",
    //     actualStartDate: "",
    //     actualEndDate: "",
    //     itemRelations: {},
    //     details: [],
    //     teams: []
    //   },
    // })
    const changeRequestDetails = reactive({
      value: {
        id: 101,
        requestName: "Upgrade Network Infrastructure",
        requestDate: "2025-04-10T09:00:00Z",
        workCode: "NET-2025-04",
        index: "1.2",
        parentIndex: "1",
        workName: "Install fiber optic cables",
        unit: "meter",
        quantity: 250,
        unitPrice: 150000,
        totalPrice: 37500000,
        progress: 60,
        status: 1, // You can map this to actual status labels
        planStartDate: "2025-04-15",
        planEndDate: "2025-04-25",
        actualStartDate: "2025-04-16",
        actualEndDate: "",
        itemRelations: {
          prerequisite: [100],
          related: [102, 103]
        },
        details: [
          {
            description: "Trenching",
            cost: 10000000,
            progress: 100
          },
          {
            description: "Cable Laying",
            cost: 20000000,
            progress: 50
          },
          {
            description: "Testing",
            cost: 7500000,
            progress: 0
          }
        ],
        teams: [
          {
            teamId: 1,
            teamName: "Network Ops",
            members: [
              { name: "Alice Nguyen", role: "Lead Engineer" },
              { name: "Tom Le", role: "Technician" }
            ]
          },
          {
            teamId: 2,
            teamName: "QA",
            members: [
              { name: "Charlie Tran", role: "QA Engineer" }
            ]
          }
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

    const saveChangeRequest = (params) => {}

    return {
      validation,
      listChangeRequests,
      changeRequestDetails,
      isShowModalConfirm,
      isShowModalCreate,
      saveChangeRequest,
      getListProjectLogs
    };
  }
);
