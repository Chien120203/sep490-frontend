<template>
  <div class="customer-block">
    <div class="customer customer-create customer-detail">
      <div class="customer-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t("customer.details.title") : $t("customer.create.title")
          }}
        </h3>
        <div class="customer-btn-detail">
          <div
              class="item"
          >
            <el-button class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="customer-body mt-0">
        <el-form
            ref="ruleFormRef"
            :model="customerDetails.value"
            :rules="CUSTOMER_RULES"
            class="form-search-box"
        >
          <div class="item item-bib-add">
            <el-form-item
                prop="customer_code"
                class="custom-textarea required"
                :label="$t('customer.details.customer_code')"
            >
              <el-input
                  v-model="customerDetails.value.customer_code"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.customer_code"
              >{{ $t(validation.value.customer_code) }}</label
              >
            </el-form-item>

            <el-form-item
                :label="$t('customer.details.customer_name')"
                class="custom-textarea"
                prop="customer_name"
            >
              <el-input
                  v-model="customerDetails.value.customer_name"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.customer_name"
              >{{ $t(validation.value.customer_name) }}</label
              >
            </el-form-item>

            <el-form-item
                :label="$t('customer.details.tax_code')"
                prop="tax_code"
                class="required"
            >
              <el-input
                  v-model="customerDetails.value.tax_code"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.tax_code"
              >{{ $t(validation.value.tax_code) }}</label>
            </el-form-item>

            <el-form-item
                :label="$t('customer.details.phone')"
                prop="phone"
                class=""
            >
              <el-input
                  v-model="customerDetails.value.phone"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.phone"
              >{{ $t(validation.value.phone) }}</label
              >
            </el-form-item>

            <el-form-item
                class="custom-textarea"
                :label="$t('customer.details.fax')"
                prop="fax"
            >
              <el-input
                  v-model="customerDetails.value.fax"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.fax"
              >{{ $t(validation.value.fax) }}</label>
            </el-form-item>
          </div>

          <div class="item item-bib-add item-customer-add">
            <el-form-item
                prop="bank_name"
                class=""
                :label="$t('customer.details.bank_name')"
            >
              <el-input
                  v-model="customerDetails.value.bank_name"
                  class="custom-textarea"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.bank_name"
              >{{ $t(validation.value.bank_name) }}</label
              >
            </el-form-item>

            <el-form-item
                prop="bank_account"
                :label="$t('customer.details.bank_account')"
                class="input-item"
            >
              <el-input
                  v-model="customerDetails.value.bank_account"
                  type="text"
              ></el-input>
              <label
                  class="error-feedback-customer"
                  v-if="
                  validation.value && validation.value.bank_account
                "
              >{{ $t(validation.value.bank_account) }}</label
              >
            </el-form-item>

            <el-form-item
                class="input-item"
                :label="$t('customer.details.email')"
                prop="contract_signed_cost"
            >
              <el-input
                  v-model="customerDetails.value.email"
                  class="custom-textarea"
              ></el-input>
              <label
                  class="error-feedback-customer"
                  v-if="
                  validation.value && validation.value.email
                "
              >{{ $t(validation.value.email) }}</label
              >
            </el-form-item>

            <el-form-item
                prop="address"
                :label="$t('customer.details.address')"
                class="input-item"
            >
              <el-input
                  v-model="customerDetails.value.address"
                  type="text"
              ></el-input>
              <label
                  class="error-feedback-customer"
                  v-if="
                  validation.value && validation.value.address
                "
              >{{ $t(validation.value.address) }}</label
              >
            </el-form-item>

            <el-form-item
                prop="director_name"
                :label="$t('customer.details.director_name')"
                class="input-item"
            >
              <el-input
                  v-model="customerDetails.value.director_name"
                  type="text"
              ></el-input>
              <label
                  class="error-feedback-customer"
                  v-if="
                  validation.value && validation.value.director_name
                "
              >{{ $t(validation.value.director_name) }}</label
              >
            </el-form-item>

            <el-form-item
                prop="description"
                class="custom-textarea"
                :label="$t('customer.details.description')"
            >
              <el-input
                  v-model="customerDetails.value.description"
                  class="custom-textarea"
                  type="textarea"
                  :rows="4"
              />
              <label
                  class="error-feedback-customer"
                  v-if="validation.value && validation.value.description"
              >
                {{ $t(validation.value.description) }}
              </label>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import {CUSTOMER_RULES} from "@/rules/customer/index.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {useI18n} from "vue-i18n";
import {useCustomerStore} from "@/store/customer.js";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  components: {IconBackMain, SingleOptionSelect},
  setup() {
    const {t} = useI18n();
    const customerStore = useCustomerStore();
    const {
      customerDetails,
      validation,
    } = customerStore;
    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const router = useRouter();
    const handleBack = () => {
      router.push({name: PAGE_NAME.CUSTOMER.LIST});
    };

    onMounted(() => {
    });

    const updateContractDetails = () => {
    };

    const ruleFormRef = ref(null);

    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          console.log("Form is valid:", customerDetails.value);
        } else {
          console.error("Validation failed!");
        }
      });
    };

    return {
      CUSTOMER_RULES,
      ruleFormRef,
      customerDetails,
      isUpdate,
      validation,
      handleBack,
      submitForm,
    };
  },
};
</script>
<style lang="scss" scoped>
.error-feedback-customer {
  display: block;
  color: red;
  text-align: left;
  font-size: 12px;
  margin-top: 5px;
}

.btn-cancel {
  border: 1px solid #3b5a9a !important;
  background: #e8eafb !important;
  color: #3b5a9a !important;
  border-radius: 4px;
}

.mt-0 {
  margin-top: 0 !important;
}

.item__title {
  line-height: 1.88;
}

.customer-btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;

  .btn {
    border: 1px solid #3b5a9a;
    background: #e8eafb;
    color: #3b5a9a;
    line-height: 4px;
    width: 124px;
    height: 37px;

    &-save {
      background: #5a6acf;
      border: 1px solid #3c4ec0;
      color: #fff;
    }
  }

  .item {
    display: flex;
  }
}

.customer-preview {
  resize: horizontal;
  overflow: auto;
  direction: rtl;
  padding: 20px;
  min-width: 35%;
  max-width: 50%;
}
</style>

<style>
.item-customer-add {
  padding: 0 8px;
}

.customer-body .form-search-box .el-select,
.customer-body .form-search-box .el-form-item__content {
  justify-content: space-between;
  font-size: 16px;
  line-height: 21px;
}
</style>
