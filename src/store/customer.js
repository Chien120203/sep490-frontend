import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";
import customerList from "@/pages/customer/CustomerList.vue";

export const useCustomerStore = defineStore(
  "customer",
  () => {
    const {t} = useI18n();
    const validation = reactive({ value: {} });
    const isShowModalConfirm = reactive({ value: false });
    const totalItems = reactive({ value: 0 });
    const currentPage = reactive({ value: 0 });
    const listCustomers = reactive({ value: [

      ]
    });
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

    const getListCustomers = async (params) => {
      mixinMethods.startLoading();
      await services.CustomerAPI.list(
        params,
        (response) => {
          if (currentPage.value === 0) {
            listCustomers.value = response.data;
          } else {
            listCustomers.value = [...listCustomers.value, ...response.data];
          }
          totalItems.value = response.meta.total;
          currentPage.value = response.meta.index;
          mixinMethods.endLoading();
        },
        (error) => {
          validation.value = mixinMethods.handleErrorResponse(
            error.responseCode
          );
          mixinMethods.notifyError(t("response.message.get_customer_failed"));
          mixinMethods.endLoading();
        }
      );
    };

    const handleDeleteCustomer = async (id) => {
      alert("delete customer "+ id)
      isShowModalConfirm.value = false;
    }

    return {
      validation,
      listCustomers, // temporary
      totalItems,
      currentPage,
      customerDetails,
      isShowModalConfirm,
      getListCustomers,
      handleDeleteCustomer
    };
  }
);
