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
            <el-button v-if="isAllowEdit" class="btn btn-save" @click="submitForm()">
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
              <el-input :disabled="!isAllowEdit" v-model="projectDetails.value.projectCode"/>
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
              <el-input :disabled="!isAllowEdit" v-model="projectDetails.value.projectName"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.projectName"
              >{{ $t(validation.value.projectName) }}</label>
            </el-form-item>

            <div class="item-project-members">
              <el-form-item
                  prop="customerId"
                  class="input-select-member"
                  :label="$t('project.create.customer')"
              >
                <SingleOptionSelect
                    :disabled="!isAllowEdit"
                    v-model="projectDetails.value.customerId"
                    :optionKeys="{ id: 'id', value: 'customerCode' }"
                    :listData="listCustomers.value"
                    :isRemote="true"
                    @remoteSearch="handleSearchCustomer"
                />
                <label
                    class="error-feedback-user"
                    v-if="validation && validation.value.customerId"
                >{{ $t(validation.value.customerId) }}</label>
              </el-form-item>

              <el-form-item prop="technicalManager" class="input-select-member">
                <template #label>
                  <span class="label-start">{{ $t('project.create.technical_manager') }}</span>
                </template>
                <SingleOptionSelect
                    v-model="projectDetails.value.technicalManager"
                    :optionKeys="{ id: 'id', value: 'username' }"
                    :listData="listTechnicalManagers"
                    :role="TECHNICAL_MANAGER"
                    :isRemote="true"
                    :disabled="!isAllowEdit"
                    class="input-wd-96"
                    @remoteSearch="handleSearchManager"
                />
                <label class="error-feedback-customer" v-if="validation && validation.viewerUserIds">
                  {{ $t(validation.viewerUserIds) }}
                </label>
              </el-form-item>
            </div>

            <div class="item-project-members">
              <el-form-item prop="resourceManager" class="input-select-member">
                <template #label>
                  <span class="label-start">{{ $t('project.create.resource_manager') }}</span>
                </template>
                <SingleOptionSelect
                    v-model="projectDetails.value.resourceManager"
                    :optionKeys="{ id: 'id', value: 'username' }"
                    :listData="listResourceManagers"
                    :role="RESOURCE_MANAGER"
                    :isRemote="true"
                    :disabled="!isAllowEdit"
                    class="input-wd-96"
                    @remoteSearch="handleSearchManager"
                />
                <label class="error-feedback-customer" v-if="validation && validation.viewerUserIds">
                  {{ $t(validation.viewerUserIds) }}
                </label>
              </el-form-item>

              <el-form-item prop="constructionManager" class="input-select-member">
                <template #label>
                  <span class="label-start">{{ $t('project.create.construction_manager') }}</span>
                </template>
                <SingleOptionSelect
                    v-model="projectDetails.value.constructionManager"
                    :optionKeys="{ id: 'id', value: 'username' }"
                    :listData="listConstructionManagers"
                    :role="CONSTRUCTION_MANAGER"
                    :isRemote="true"
                    :disabled="!isAllowEdit"
                    class="input-wd-96"
                    @remoteSearch="handleSearchManager"
                />
                <label class="error-feedback-customer" v-if="validation && validation.viewerUserIds">
                  {{ $t(validation.viewerUserIds) }}
                </label>
              </el-form-item>
            </div>

            <el-form-item
                :label="$t('project.create.construct_type')"
                prop="constructType"
            >
              <el-input :disabled="!isAllowEdit" v-model="projectDetails.value.constructType"/>
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
                  :disabled="!isAllowEdit"
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
                    :disabled="!isAllowEdit"
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
                    :disabled="!isAllowEdit"
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
                  :disabled="!isAllowEdit"
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
              <el-input :disabled="!isAllowEdit" type="textarea" v-model="projectDetails.value.purpose"/>
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
              <el-input :disabled="!isAllowEdit" :rows="4" type="textarea" v-model="projectDetails.value.technicalReqs"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.technicalReqs"
              >{{ $t(validation.value.technicalReqs) }}</label>
            </el-form-item>

            <el-form-item prop="description" :label="$t('project.create.description')">
              <el-input :disabled="!isAllowEdit" type="textarea" :rows="5" v-model="projectDetails.value.description"/>
              <label
                  class="error-feedback-user"
                  v-if="validation && validation.value.description"
              >{{ $t(validation.value.description) }}</label>
            </el-form-item>

            <el-form-item prop="attachments" :label="$t('project.create.attachment')">
              <FileUpload
                  :disabled="!isAllowEdit"
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
import {useUserStore} from "@/store/user.js";
import {BUSINESS_EMPLOYEE, CONSTRUCTION_MANAGER, RESOURCE_MANAGER, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {RECEIVE_STATUS} from "@/constants/project.js";

export default {
  components: {IconBackMain, SingleOptionSelect, FileUpload},
  setup() {
    const projectStore = useProjectStore();
    const customerStore = useCustomerStore();
    const userStore = useUserStore();
    const {
      listUsers,
      getListUsers,
      getUserIdByRole
    } = userStore;
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

    const attachments = ref(null);
    const listConstructionManagers = ref([]);
    const listTechnicalManagers = ref([]);
    const listResourceManagers = ref([]);
    const isAllowEdit = ref(localStorage.getItem('role') === BUSINESS_EMPLOYEE && projectDetails.value.status === RECEIVE_STATUS);

    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const router = useRouter();

    onMounted(async () => {
      await getListCustomers({search: "", pageIndex: 1}, false);
      await getListUsers({keyWord: "", pageIndex: 1}, false);
      if(route.params.id) {
        await getProjectDetails(route.params.id);
        projectDetails.value.technicalManager = getUserIdByRole(projectDetails.value.viewerUserIds, TECHNICAL_MANAGER)?.id;
        projectDetails.value.constructionManager = getUserIdByRole(projectDetails.value.viewerUserIds, CONSTRUCTION_MANAGER)?.id;
        projectDetails.value.resourceManager = getUserIdByRole(projectDetails.value.viewerUserIds, RESOURCE_MANAGER)?.id;
      } else await clearProjectDetails();
      listConstructionManagers.value = listUsers.value.filter((item) => item.role === CONSTRUCTION_MANAGER);
      listResourceManagers.value = listUsers.value.filter((item) => item.role === RESOURCE_MANAGER);
      listTechnicalManagers.value = listUsers.value.filter((item) => item.role === TECHNICAL_MANAGER);
    });

    onUnmounted(() => {
      clearProjectDetails();
    });

    const handleBack = () => {
      router.push(isUpdate.value ? {name: PAGE_NAME.PROJECT.DETAILS, params:{id: route.params.id}} :{name: PAGE_NAME.PROJECT.LIST});
    };

    const ruleFormRef = ref(null);

    const submitForm = () => {
      projectDetails.value.budget = mixinMethods.handleChangeNumber(projectDetails.value.budget);
      projectDetails.value.viewerUserIds = [projectDetails.value.technicalManager, projectDetails.value.resourceManager, projectDetails.value.constructionManager];
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

    const handleSearchManager = async (searchValue, role) => {
      await getListUsers({
        keyWord: searchValue,
        role: role,
        pageIndex: 1,
      }, false);
      switch (role) {
        case CONSTRUCTION_MANAGER:
          listConstructionManagers.value = listUsers.value.filter((item) => item.role === CONSTRUCTION_MANAGER);
          break;
        case RESOURCE_MANAGER:
          listResourceManagers.value = listUsers.value.filter((item) => item.role === RESOURCE_MANAGER);
          break;
        case TECHNICAL_MANAGER:
          listTechnicalManagers.value = listUsers.value.filter((item) => item.role === TECHNICAL_MANAGER);
      }
    }

    const formatCurrency = (number) => {
      return mixinMethods.formatInputCurrency(number);
    }

    return {
      PROJECT_RULES,
      DATE_FORMAT,
      CONSTRUCTION_MANAGER,
      RESOURCE_MANAGER,
      TECHNICAL_MANAGER,
      isAllowEdit,
      ruleFormRef,
      isUpdate,
      projectDetails,
      validation,
      listTechnicalManagers,
      listResourceManagers,
      listConstructionManagers,
      listCustomers,
      attachments,
      formatCurrency,
      handleFileUpload,
      handleSearchManager,
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

.item-project-members {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.input-select-member {
  width: 48%;
}

.user-body .form-search-box,
.user-body .form-search-box{
  justify-content: space-between;
  font-size: 16px;
  line-height: 21px;
}
</style>
