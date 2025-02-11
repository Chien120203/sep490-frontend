import {defineStore} from "pinia";
import {reactive} from "vue";
import {mixinMethods} from "@/utils/variables";
import services from "@/plugins/services";
import {useI18n} from "vue-i18n";

export const useUserStore = defineStore(
    "user",
    () => {
        const {t} = useI18n();
        const validation = reactive({ value: {} });
        const isShowModalConfirm = reactive({ value: false });
        const totalItems = reactive({ value: 0 });
        const currentPage = reactive({ value: 0 });
        const listUsers = reactive({ value: [
                    {
                        "id": 1,
                        "user_code": "USR001",
                        "user_name": "Alice Johnson",
                        "phone": "1112223333",
                        "email": "alice.johnson@example.com",
                        "address": "456 Elm St, Los Angeles, USA",
                        "age": 28,
                        "gender": "Female",
                        "occupation": "Software Engineer"
                    },
                    {
                        "id": 2,
                        "user_code": "USR002",
                        "user_name": "Bob Smith",
                        "phone": "2223334444",
                        "email": "bob.smith@example.com",
                        "address": "789 Pine St, Chicago, USA",
                        "age": 35,
                        "gender": "Male",
                        "occupation": "Marketing Manager"
                    },
                    {
                        "id": 3,
                        "user_code": "USR003",
                        "user_name": "Charlie Davis",
                        "phone": "3334445555",
                        "email": "charlie.davis@example.com",
                        "address": "159 Maple St, Miami, USA",
                        "age": 30,
                        "gender": "Male",
                        "occupation": "Financial Analyst"
                    },
                    {
                        "id": 4,
                        "user_code": "USR004",
                        "user_name": "Diana Martinez",
                        "phone": "4445556666",
                        "email": "diana.martinez@example.com",
                        "address": "753 Birch St, Houston, USA",
                        "age": 26,
                        "gender": "Female",
                        "occupation": "Graphic Designer"
                    },
                    {
                        "id": 5,
                        "user_code": "USR005",
                        "user_name": "Edward Wilson",
                        "phone": "5556667777",
                        "email": "edward.wilson@example.com",
                        "address": "852 Oak St, Seattle, USA",
                        "age": 40,
                        "gender": "Male",
                        "occupation": "Project Manager"
                    },
                    {
                        "id": 6,
                        "user_code": "USR006",
                        "user_name": "Fiona Brown",
                        "phone": "6667778888",
                        "email": "fiona.brown@example.com",
                        "address": "963 Cedar St, Denver, USA",
                        "age": 32,
                        "gender": "Female",
                        "occupation": "HR Specialist"
                    },
                    {
                        "id": 7,
                        "user_code": "USR007",
                        "user_name": "George Clark",
                        "phone": "7778889999",
                        "email": "george.clark@example.com",
                        "address": "741 Spruce St, Boston, USA",
                        "age": 29,
                        "gender": "Male",
                        "occupation": "Civil Engineer"
                    },
                    {
                        "id": 8,
                        "user_code": "USR008",
                        "user_name": "Hannah Lewis",
                        "phone": "8889990000",
                        "email": "hannah.lewis@example.com",
                        "address": "369 Redwood St, Austin, USA",
                        "age": 27,
                        "gender": "Female",
                        "occupation": "Data Scientist"
                    },
                    {
                        "id": 9,
                        "user_code": "USR009",
                        "user_name": "Ian Walker",
                        "phone": "9990001111",
                        "email": "ian.walker@example.com",
                        "address": "852 Walnut St, San Francisco, USA",
                        "age": 31,
                        "gender": "Male",
                        "occupation": "IT Consultant"
                    },
                    {
                        "id": 10,
                        "user_code": "USR010",
                        "user_name": "Jessica Adams",
                        "phone": "0001112222",
                        "email": "jessica.adams@example.com",
                        "address": "123 Ash St, Phoenix, USA",
                        "age": 34,
                        "gender": "Female",
                        "occupation": "Sales Executive"
                    },
                    {
                        "id": 11,
                        "user_code": "USR011",
                        "user_name": "Kevin Carter",
                        "phone": "1122334455",
                        "email": "kevin.carter@example.com",
                        "address": "234 Fir St, Philadelphia, USA",
                        "age": 36,
                        "gender": "Male",
                        "occupation": "Architect"
                    },
                    {
                        "id": 12,
                        "user_code": "USR012",
                        "user_name": "Laura Hill",
                        "phone": "2233445566",
                        "email": "laura.hill@example.com",
                        "address": "345 Cherry St, San Diego, USA",
                        "age": 30,
                        "gender": "Female",
                        "occupation": "Nurse"
                    },
                    {
                        "id": 13,
                        "user_code": "USR013",
                        "user_name": "Michael Scott",
                        "phone": "3344556677",
                        "email": "michael.scott@example.com",
                        "address": "456 Poplar St, Dallas, USA",
                        "age": 37,
                        "gender": "Male",
                        "occupation": "Business Analyst"
                    },
                    {
                        "id": 14,
                        "user_code": "USR014",
                        "user_name": "Nancy Green",
                        "phone": "4455667788",
                        "email": "nancy.green@example.com",
                        "address": "567 Dogwood St, Detroit, USA",
                        "age": 33,
                        "gender": "Female",
                        "occupation": "Teacher"
                    },
                    {
                        "id": 15,
                        "user_code": "USR015",
                        "user_name": "Oliver Baker",
                        "phone": "5566778899",
                        "email": "oliver.baker@example.com",
                        "address": "678 Magnolia St, Portland, USA",
                        "age": 29,
                        "gender": "Male",
                        "occupation": "Photographer"
                    }
            ]
        });
        const userDetails = reactive({
            value: {
                id: 0,
                user_code: "",
                user_name: "",
                phone: "",
                email: "",
                address: "",
                age: 0,
                gender: "",
                occupation: "",
                description: ""
            }
        });


        const getListUsers = async (params) => {
            // mixinMethods.startLoading();
            await services.UserAPI.list(
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

        const handleDeleteUser = async (id) => {
            alert("delete user "+ id)
            isShowModalConfirm.value = false;
        }

        return {
            validation,
            listUsers, // temporary
            totalItems,
            currentPage,
            userDetails,
            isShowModalConfirm,
            getListUsers,
            handleDeleteUser
        };
    }
);