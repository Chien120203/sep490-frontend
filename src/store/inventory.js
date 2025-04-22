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
