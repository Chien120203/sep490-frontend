import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useCustomerStore = defineStore(
  "customer",
  () => {
    const {t} = useI18n();
    const validation = reactive({value: {}});
    const isShowModalConfirm = reactive({value: false});
    const totalItems = reactive({value: 0});
    const currentPage = reactive({value: 0});
    const listCustomers = reactive({value: []});
    const customerDetails = reactive({
      value: {
        id: 0,
        customerCode: "",
        customerName: "",
        phone: "",
        taxCode: "",
        fax: "",
        address: "",
        email: "",
        directorName: "",
        bankAccount: "",
        bankName: "",
        description: ""
      }
    });

    const getListCustomers = async (params, isLoading = true) => {
      if (isLoading) mixinMethods.startLoading();
      await services.CustomerAPI.list(
        params,
        (response) => {
          if (currentPage.value === 1) {
            listCustomers.value = response.data;
          } else {
            listCustomers.value = [...listCustomers.value, ...response.data];
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;
          mixinMethods.endLoading();
        },
        (error) => {
          mixinMethods.notifyError(t("response.message.get_customer_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const getCustomerDetails = async (params) => {
      mixinMethods.startLoading();
      await services.CustomerAPI.details(
        params,
        (response) => {
          customerDetails.value = response.data;
          mixinMethods.endLoading();
        },
        (error) => {
          // validation.value = mixinMethods.handleErrorResponse(
          //   error.responseCode
          // );
          mixinMethods.notifyError(t("response.message.get_customer_dtls_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const saveCustomer = async (params, method) => {
      mixinMethods.startLoading();
      await services.CustomerAPI[method](
        params,
        (response) => {
          customerDetails.value = response.data;
          mixinMethods.notifySuccess(t("response.message.save_customer_success"));
          validation.value = {};
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(error.responseCode);
          mixinMethods.notifyError(t("response.message.save_customer_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeleteCustomer = async (id) => {
      mixinMethods.startLoading();
      await services.CustomerAPI.deleteCustomer(
        id,
        (response) => {
          listCustomers.value = listCustomers.value.filter(customer => customer.id !== id);
          mixinMethods.notifySuccess(t("response.message.delete_customer_success"));
          mixinMethods.endLoading();
        },
        () => {
          mixinMethods.notifyError(t("response.message.delete_customer_failed"));
          mixinMethods.endLoading();
        }
      );
      isShowModalConfirm.value = false;
    }

    const clearCustomerDetails = () => {
      customerDetails.value = {
        id: 0,
        customerCode: "",
        customerName: "",
        phone: "",
        taxCode: "",
        fax: "",
        address: "",
        email: "",
        directorName: "",
        bankAccount: "",
        bankName: "",
        description: ""
      };
    };

    return {
      validation,
      listCustomers, // temporary
      totalItems,
      currentPage,
      customerDetails,
      isShowModalConfirm,
      clearCustomerDetails,
      saveCustomer,
      getCustomerDetails,
      getListCustomers,
      handleDeleteCustomer
    };
  }
);
