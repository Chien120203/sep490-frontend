import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useMobilizationStore = defineStore(
  "mobilization",
  () => {
    const {t} = useI18n();
    const validation = reactive({ value: {} });
    const isShowModalConfirm = reactive({ value: false });
    const totalItems = reactive({ value: 0 });
    const currentPage = reactive({ value: 0 });
    const listMobilizations = reactive({ value: [] });
    const customerDetails = reactive({value: {}});

    const getListMobilizations = async (params, isLoading = true) => {
      if(isLoading) mixinMethods.startLoading();
      await services.MobilizationAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listMobilizations.value = response.data;
          } else {
            listMobilizations.value = [...listMobilizations.value, ...response.data];
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_mobilization_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    return {
      validation,
      totalItems,
      currentPage,
      customerDetails,
      isShowModalConfirm,
      listMobilizations,
      getListMobilizations,
    };
  }
);
