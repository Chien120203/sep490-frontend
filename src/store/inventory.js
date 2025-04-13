import {defineStore} from "pinia";
import {reactive} from "vue";
import services from "@/plugins/services"; // You can later hook this to actual API calls
import {useI18n} from "vue-i18n";
import {mixinMethods} from "@/utils/variables.js";

export const useInventoryStore = defineStore(
  "inventory",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({ value: 0 });
    // const inventoryData = reactive({
    //   value: [
    //     {
    //       "id": 1,
    //       "name": "Excavator",
    //       "description": "Heavy construction equipment used for digging",
    //       "resourceId": 101,
    //       "projectId": 1001,
    //       "resourceType": 1,
    //       "quantity": 2,
    //       "unit": "units",
    //       "status": true,
    //       "createdAt": "2025-04-10T09:15:00.000Z",
    //       "updatedAt": "2025-04-12T14:00:00.000Z"
    //     },
    //     {
    //       "id": 2,
    //       "name": "Cement Bags",
    //       "description": "Ordinary Portland Cement, 50kg bags",
    //       "resourceId": 102,
    //       "projectId": 1001,
    //       "resourceType": 2,
    //       "quantity": 100,
    //       "unit": "bags",
    //       "status": true,
    //       "createdAt": "2025-04-11T08:30:00.000Z",
    //       "updatedAt": "2025-04-13T09:00:00.000Z"
    //     },
    //     {
    //       "id": 3,
    //       "name": "Electrical Engineer",
    //       "description": "Certified engineer for site wiring and panels",
    //       "resourceId": 103,
    //       "projectId": 1002,
    //       "resourceType": 3,
    //       "quantity": 1,
    //       "unit": "person",
    //       "status": true,
    //       "createdAt": "2025-04-12T10:45:00.000Z",
    //       "updatedAt": "2025-04-13T10:45:00.000Z"
    //     },
    //     {
    //       "id": 4,
    //       "name": "Bulldozer",
    //       "description": "Heavy machinery for pushing earth and debris",
    //       "resourceId": 104,
    //       "projectId": 1003,
    //       "resourceType": 1,
    //       "quantity": 1,
    //       "unit": "unit",
    //       "status": false,
    //       "createdAt": "2025-04-05T07:20:00.000Z",
    //       "updatedAt": "2025-04-10T08:00:00.000Z"
    //     },
    //     {
    //       "id": 5,
    //       "name": "Steel Rods",
    //       "description": "TMT steel rods for concrete reinforcement",
    //       "resourceId": 105,
    //       "projectId": 1002,
    //       "resourceType": 2,
    //       "quantity": 500,
    //       "unit": "kg",
    //       "status": true,
    //       "createdAt": "2025-04-08T06:45:00.000Z",
    //       "updatedAt": "2025-04-13T07:00:00.000Z"
    //     },
    //     {
    //       "id": 6,
    //       "name": "Site Supervisor",
    //       "description": "On-site supervisor for project management",
    //       "resourceId": 106,
    //       "projectId": 1003,
    //       "resourceType": 3,
    //       "quantity": 1,
    //       "unit": "person",
    //       "status": true,
    //       "createdAt": "2025-04-09T12:00:00.000Z",
    //       "updatedAt": "2025-04-13T11:00:00.000Z"
    //     }
    //   ]
    // });
    const inventoryData = reactive({
      value: []
    });
    const getListInventory = async (params, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
      await services.InventoryAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            inventoryData.value = response.data;
          } else {
            inventoryData.value = [...inventoryData.value, ...response.data];
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_list_inventory_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    return {
      validation,
      totalItems,
      inventoryData,
      currentPage,
      getListInventory
    };
  }
);
