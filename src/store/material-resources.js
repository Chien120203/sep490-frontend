import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useMaterialResourcesStore = defineStore(
  "materialResources",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listMaterialResources = reactive({value: []});
    const materialResourcesDetails = reactive({
      value: {
        id: 0,
        materialCode: "",
        materialName: "",
        unit: "",
        branch: "",
        madeIn: "",
        chassisNumber: "",
        wholesalePrice: 0,
        retailPrice: 0,
        inventory: 0,
        attachment: "",
        canRollBack: false,
        expireDate: "",
        productionDate: "",
        description: "",
          isFlag: ""
      }
    });

    const getListMaterialResources = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.MaterialResourceAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listMaterialResources.value = response.data;
          } else {
            listMaterialResources.value = [...listMaterialResources.value, ...response.data];
          }
          totalItems.value = response.meta?.total;
          currentPage.value = response.meta?.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_material_failed"));
          mixinMethods.endLoading();
        }
      );
      mixinMethods.endLoading();
    };

    const getMaterialResourcesDetails = async (id) => {
      mixinMethods.startLoading();
      await services.MaterialResourceAPI.details(
        id,
        {},
        (response) => {
          materialResourcesDetails.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_material_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const saveMaterialResources = async (params) => {
      mixinMethods.startLoading();
      await services.MaterialResourceAPI.save(
        params,
        (response) => {
          materialResourcesDetails.value = response.data;
          mixinMethods.notifySuccess(t("response.message.save_material_success"));
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_material_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeleteMaterialResources = async (id) => {
      mixinMethods.startLoading();
      await services.MaterialResourceAPI.deleteMaterial(
        id,
        (response) => {
          listMaterialResources.value = listMaterialResources.value.filter(materialResources => materialResources.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_material_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_material_failed"));
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const clearMaterialResourcesDetails = () => {
      materialResourcesDetails.value = {
        id: 0,
        materialCode: "",
        materialName: "",
        unit: "",
        branch: "",
        madeIn: "",
        chassisNumber: "",
        wholesalePrice: 0,
        retailPrice: 0,
        inventory: 0,
        attachment: "",
        expireDate: "",
        canRollBack: false,
        productionDate: "",
        description: "",
          isFlag: ""
      };
    };

    return {
      validation,
      listMaterialResources,
      totalItems,
      currentPage,
      materialResourcesDetails,
      isShowModalConfirm,
      clearMaterialResourcesDetails,
      saveMaterialResources,
      getMaterialResourcesDetails,
      getListMaterialResources,
      handleDeleteMaterialResources
    };
  }
);