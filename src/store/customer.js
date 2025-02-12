import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useCustomerStore = defineStore(
    "customer",
    () => {
      const {t} = useI18n();
      const validation = reactive({ value: {} });
      const isShowModalConfirm = reactive({ value: false });
      const totalItems = reactive({ value: 0 });
      const currentPage = reactive({ value: 0 });
      const listCustomers = reactive({ value: []});
      const customerDetails = reactive({
        value:{
          id: 0,
          customer_code: "",
          customer_name: "",
          phone: "",
          tax_code: "",
          fax: "",
          address: "",
          email: "",
          director_name: "",
          bank_account: "",
          bank_name: "",
          description: ""
        }
      })

      const getListCustomers = async (params) => {
        // mixinMethods.startLoading();
        await services.CustomerAPI.list(
            params,
            (response) => {


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