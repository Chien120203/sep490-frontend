import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import PAGE_NAME from "@/constants/route-name.js";
import {useRouter} from "vue-router";

export const useMachineResourcesStore = defineStore(
  "machineResources",
  () => {
    const router = useRouter();
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listMachineResources = reactive({value: []});
    const machineResourcesDetails = reactive({
      value: {
        id: 0,
        vehicleName: "",
        licensePlate: "",
        brand: "",
        yearOfManufacture: 0,
        countryOfManufacture: "",
        vehicleType: 0,
        chassisNumber: "",
        engineNumber: "",
        status: 0,
        driver: 0,
        color: "",
        fuelType: "",
        description: "",
        fuelTankVolume: 0,
        fuelUnit: "",
        attachment: [],
      }
    });

    const getListMachineResources = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.MachineResourceAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listMachineResources.value = response.data;
          } else {
            listMachineResources.value = [...listMachineResources.value, ...response.data];
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_machine_failed"));
          mixinMethods.endLoading();
        }
      );
      mixinMethods.endLoading();
    };

    const getMachineResourcesDetails = async (id) => {
      mixinMethods.startLoading();
      await services.MachineResourceAPI.details(
        id,
        {},
        (response) => {
          machineResourcesDetails.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_machine_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const saveMachineResources = async (params, method) => {
      mixinMethods.startLoading();
      await services.MachineResourceAPI[method](
        params,
        (response) => {
          machineResourcesDetails.value = response.data;
          mixinMethods.notifySuccess(t("response.message.save_machine_success"));
          mixinMethods.endLoading();
          router.push({name: PAGE_NAME.RESOURCE.MACHINE.LIST})
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_machine_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeleteMachineResources = async (id) => {
      mixinMethods.startLoading();
      await services.MachineResourceAPI.deleteMachine(
        id,
        (response) => {
          listMachineResources.value = listMachineResources.value.filter(machineResources => machineResources.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_machine_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_machine_failed"));
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const clearMachineResourcesDetails = () => {
      machineResourcesDetails.value = {
        id: 0,
        vehicleName: "",
        licensePlate: "",
        brand: "",
        yearOfManufacture: 0,
        countryOfManufacture: "",
        vehicleType: 0,
        chassisNumber: "",
        engineNumber: "",
        status: 0,
        driver: 0,
        color: "",
        fuelType: "",
        description: "",
        fuelTankVolume: 0,
        fuelUnit: "",
        attachment: [],
      };
    };

    return {
      validation,
      listMachineResources, // temporary
      totalItems,
      currentPage,
      machineResourcesDetails,
      isShowModalConfirm,
      clearMachineResourcesDetails,
      saveMachineResources,
      getMachineResourcesDetails,
      getListMachineResources,
      handleDeleteMachineResources
    };
  }
);