<template>
  <div class="user-block">
    <div class="user user-create user-detail">
      <div class="user-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t('project.edit.title') : $t('project.create.title')
          }}
        </h3>
        <div class="user-btn-detail">
          <div class="item">
            <el-button class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="user-body mt-0">
        <el-form
            ref="ruleFormRef"
            :model="projectDetails.value"
            :rules="PROJECT_RULES"
            class="form-search-box"
        >
          <div class="item item-bib-add">
            <el-form-item
                prop="projectCode"
                class="custom-textarea required"
                :label="$t('project.create.project_code')"
            >
              <el-input v-model="projectDetails.value.projectCode"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.projectCode"
              >{{ $t(validation.value.projectCode) }}</label>
            </el-form-item>

            <el-form-item
                prop="projectName"
                class="custom-textarea"
                :label="$t('project.create.project_name')"
            >
              <el-input v-model="projectDetails.value.projectName"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.projectName"
              >{{ $t(validation.value.projectName) }}</label>
            </el-form-item>

            <el-form-item
                prop="customerId"
                class="custom-textarea required"
                :label="$t('project.create.customer')"
            >
              <SingleOptionSelect
                  v-model="projectDetails.value.customerId"
                  :optionKeys="{ id: 'id', value: 'customerCode' }"
                  :listData="listCustomers.value"
                  :isRemote="true"
                  :disabled="false"
                  @remoteSearch="handleSearchCustomer"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.customerId"
              >{{ $t(validation.value.customerId) }}</label>
            </el-form-item>

            <el-form-item
                :label="$t('project.create.construct_type')"
                prop="constructType"
            >
              <el-input v-model="projectDetails.value.constructType"/>
              <label
                  class="error-feedback-user"
                  v-if="validation.value && validation.value.constructType"
              >{{ $t(validation.value.constructType) }}</label>
            </el-form-item>

            <el-form-item
                prop="area"
                class="custom-textarea required"
                :label="$t('project.create.area')"
            >
              <el-input
                  v-model="projectDetails.value.area"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.area"
              >{{ $t(validation.value.area) }}</label>
            </el-form-item>

            <div style="display: flex; justify-content: space-between;">
              <el-form-item
                  prop="startDate"
                  class="date-time-select required"
                  :label="$t('project.create.start_date')"
              >
                <el-date-picker
                    style="width: 90%"
                    :format="DATE_FORMAT"
                    :value-format="DATE_FORMAT"
                    v-model="projectDetails.value.startDate"
                    :placeholder="$t('common.start_date')"
                />
                <label
                    class="error-feedback-user"
                    v-if="validation && validation.value.startDate"
                >{{ $t(validation.value.startDate) }}</label>
              </el-form-item>

              <el-form-item
                  prop="endDate"
                  class="date-time-select required"
                  :label="$t('project.create.end_date')"
              >
                <el-date-picker
                    style="width: 100%"
                    :format="DATE_FORMAT"
                    :value-format="DATE_FORMAT"
                    v-model="projectDetails.value.endDate"
                    :placeholder="$t('common.end_date')"
                />
                <label
                    class="error-feedback-user"
                    v-if="validation && validation.value.endDate"
                >{{ $t(validation.value.endDate) }}</label>
              </el-form-item>
            </div>

          </div>

          <div class="item item-bib-add item-user-add">
            <el-form-item
                prop="budget"
                class="custom-textarea required"
                :label="$t('project.create.budget')"
            >
              <el-input
                  :formatter="(value) => formatCurrency(value)"
                  v-model="projectDetails.value.budget"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.budget"
              >{{ $t(validation.value.budget) }}</label>
            </el-form-item>

            <el-form-item
                prop="purpose"
                class="custom-textarea required"
                :label="$t('project.create.purpose')"
            >
              <el-input type="textarea" v-model="projectDetails.value.purpose"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.purpose"
              >{{ $t(validation.value.purpose) }}</label>
            </el-form-item>

            <el-form-item
                prop="technicalReqs"
                class="custom-textarea required"
                :label="$t('project.create.technical_reqs')"
            >
              <el-input :rows="3" type="textarea" v-model="projectDetails.value.technicalReqs"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.technicalReqs"
              >{{ $t(validation.value.technicalReqs) }}</label>
            </el-form-item>

            <el-form-item prop="description" :label="$t('project.create.description')">
              <el-input type="textarea" :rows="3" v-model="projectDetails.value.description"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.description"
              >{{ $t(validation.value.description) }}</label>
            </el-form-item>

            <el-form-item prop="attachments" :label="$t('project.create.attachment')">
              <FileUpload
                  :existingFiles="projectDetails.value.attachments"
                  :allowedTypes="'.jpg,.png,.pdf,.docx'"
                  :fileLimit="3"
                  @file-selected="handleFileUpload"
              />
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.attachments"
              >
                {{ $t(validation.value.attachments) }}
              </label>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import FileUpload from "@/components/common/FileUpload.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import PAGE_NAME from "@/constants/route-name.js";
import {useProjectStore} from "@/store/project.js";
import {useCustomerStore} from "@/store/customer.js";
import { mixinMethods } from "@/utils/variables";
import {PROJECT_RULES} from "@/rules/project/index.js";
import {DATE_FORMAT} from "@/constants/application.js";

export default {
  components: {IconBackMain, SingleOptionSelect, FileUpload},
  setup() {
    const attachments = ref(null);
    const projectStore = useProjectStore();
    const customerStore = useCustomerStore();
    const {
      listCustomers,
      getListCustomers
    } = customerStore;
    const {
      validation,
      projectDetails,
      saveProject,
      getProjectDetails,
      clearProjectDetails
    } = projectStore;
    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const router = useRouter();

    onMounted(() => {
      if(route.params.id) getProjectDetails(route.params.id);
      getListCustomers({search: "", pageIndex: 1}, false);
    });

    onUnmounted(() => {
      clearProjectDetails();
    });

    const handleBack = () => {
      router.push({name: PAGE_NAME.PROJECT.LIST});
    };

    const ruleFormRef = ref(null);

    const submitForm = () => {
      projectDetails.value.budget = mixinMethods.handleChangeNumber(projectDetails.value.budget);
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          saveProject(projectDetails.value);
        }
      });
    };

    const handleFileUpload = (files) => {
      projectDetails.value.attachments = files;
    };

    const handleSearchCustomer = (searchValue) => {
      getListCustomers({search: searchValue, pageIndex: 1}, false);
    }

    const formatCurrency = (number) => {
      return mixinMethods.formatInputCurrency(number);
    }

    return {
      PROJECT_RULES,
      DATE_FORMAT,
      ruleFormRef,
      isUpdate,
      projectDetails,
      validation,
      listCustomers,
      attachments,
      formatCurrency,
      handleFileUpload,
      handleSearchCustomer,
      handleBack,
      submitForm,
    };
  },
};
</script>
<style lang="scss" scoped>
.error-feedback-user {
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

.el-upload__input {
  display: none !important;
}

.user-btn-detail {
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

.date-time-select {
  width: 50%;

  &-input {
    width: 100%;
  }
}

.user-preview {
  resize: horizontal;
  overflow: auto;
  direction: rtl;
  padding: 20px;
  min-width: 35%;
  max-width: 50%;
}
</style>

<style>
.item-user-add {
  padding: 0 8px;
}

.user-body .form-search-box,
.user-body .form-search-box{
  justify-content: space-between;
  font-size: 16px;
  line-height: 21px;
}
</style>
