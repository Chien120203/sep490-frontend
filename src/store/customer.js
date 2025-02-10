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
    const listCustomers = reactive({ value: [
        {
          "id": 1,
          "customer_code": "CUST001",
          "customer_name": "ABC Corporation",
          "phone": "1234567890",
          "tax_code": "TX12345",
          "fax": "9876543210",
          "address": "123 Business St, NY, USA",
          "email": "abc@corporation.com",
          "director_name": "John Doe",
          "description": "Leading industrial supplier",
          "bank_account": "1234567890123",
          "bank_name": "Bank of America"
        },
        {
          "id": 2,
          "customer_code": "CUST002",
          "customer_name": "XYZ Ltd.",
          "phone": "9876543210",
          "tax_code": "TX67890",
          "fax": "1234567890",
          "address": "456 Market St, CA, USA",
          "email": "xyz@xyzltd.com",
          "director_name": "Jane Smith",
          "description": "Software development firm",
          "bank_account": "9876543210987",
          "bank_name": "Chase Bank"
        },
        {
          "id": 3,
          "customer_code": "CUST003",
          "customer_name": "Global Tech",
          "phone": "5551234567",
          "tax_code": "TX54321",
          "fax": "5559876543",
          "address": "789 Tech Ave, TX, USA",
          "email": "global@tech.com",
          "director_name": "Robert Brown",
          "description": "IT solutions provider",
          "bank_account": "1112223334445",
          "bank_name": "Wells Fargo"
        },
        {
          "id": 4,
          "customer_code": "CUST004",
          "customer_name": "Delta Inc.",
          "phone": "6667891234",
          "tax_code": "TX98765",
          "fax": "4445556667",
          "address": "321 Innovation Rd, FL, USA",
          "email": "delta@inc.com",
          "director_name": "Sarah Johnson",
          "description": "Electronics manufacturer",
          "bank_account": "5556667778889",
          "bank_name": "CitiBank"
        },
        {
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },{
          "id": 5,
          "customer_code": "CUST005",
          "customer_name": "Omega Solutions",
          "phone": "7774561230",
          "tax_code": "TX19283",
          "fax": "2223334445",
          "address": "654 Business Park, WA, USA",
          "email": "omega@solutions.com",
          "director_name": "Michael Green",
          "description": "Consulting services",
          "bank_account": "9998887776665",
          "bank_name": "HSBC"
        },
      ]
    });
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
