<template>
  <div class="survey-form-container">
    <div class="survey-update">
      <div class="survey-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{ isCreateMode ? $t('survey.create.title') : $t('survey.details.title') }}
        </h3>
        <div class="survey-btn-detail">
          <div class="item">
            <el-button v-if="isAllowEditSurvey" class="btn btn-save" @click="submitForm">
              {{ $t('common.save') }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="survey-body mt-0">
        <el-form
            ref="ruleFormRef"
            :model="siteSurveyDetails.value"
            :disabled="!isAllowEditSurvey"
            :rules="SURVEY_RULES"
            class="survey-form"
            label-width="27%"
        >
          <!-- Thông tin chung -->
          <el-divider content-position="left">{{ $t('survey.details.sections.generalInfo') }}</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="siteSurveyName" :label="$t('survey.details.siteSurveyName')">
                <el-input v-model="siteSurveyDetails.value.siteSurveyName"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Về cơ sở & Đánh giá -->
          <el-divider content-position="left">{{ $t('survey.details.sections.facilityAssessment') }}</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="constructionRequirements" :label="$t('survey.details.constructionRequirements')">
                <el-input v-model="siteSurveyDetails.value.constructionRequirements" type="textarea" :rows="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="equipmentRequirements" :label="$t('survey.details.equipmentRequirements')">
                <el-input v-model="siteSurveyDetails.value.equipmentRequirements" type="textarea" :rows="3"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="humanResourceCapacity" :label="$t('survey.details.humanResourceCapacity')">
                <el-input v-model="siteSurveyDetails.value.humanResourceCapacity" type="textarea" :rows="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="riskAssessment" :label="$t('survey.details.riskAssessment')">
                <el-input v-model="siteSurveyDetails.value.riskAssessment" type="textarea" :rows="3"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="comments" :label="$t('survey.details.comments')">
                <el-input v-model="siteSurveyDetails.value.comments" type="textarea" :rows="3"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="profitAssessment" :label="$t('survey.details.profitAssessment')">
                <el-input v-model="siteSurveyDetails.value.profitAssessment" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Thông tin chính -->
          <el-divider content-position="left">{{ $t('survey.details.sections.mainInfo') }}</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="bidWinProb" :label="$t('survey.details.bidWinProb')">
                <el-input v-model.number="siteSurveyDetails.value.bidWinProb" type="number">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="estimatedExpenses" :label="$t('survey.details.estimatedExpenses')">
                <el-input :formatter="(value) => formatCurrency(value)"
                          :parser="(value) => mixinMethods.parseInputCurrency(value)"
                          v-model="siteSurveyDetails.value.estimatedExpenses"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="estimatedProfits" :label="$t('survey.details.estimatedProfits')">
                <el-input :formatter="(value) => formatCurrency(value)"
                          :parser="(value) => mixinMethods.parseInputCurrency(value)"
                          v-model="siteSurveyDetails.value.estimatedProfits"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="tenderPackagePrice" :label="$t('survey.details.tenderPackagePrice')">
                <el-input :formatter="(value) => formatCurrency(value)"
                          :parser="(value) => mixinMethods.parseInputCurrency(value)"
                          v-model="siteSurveyDetails.value.tenderPackagePrice"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="totalBidPrice" :label="$t('survey.details.totalBidPrice')">
                <el-input :formatter="(value) => formatCurrency(value)"
                          :parser="(value) => mixinMethods.parseInputCurrency(value)"
                          v-model="siteSurveyDetails.value.totalBidPrice"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="discountRate" :label="$t('survey.details.discountRate')">
                <el-input v-model.number="siteSurveyDetails.value.discountRate" type="number">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="projectCost" :label="$t('survey.details.projectCost')">
                <el-input :formatter="(value) => formatCurrency(value)"
                          :parser="(value) => mixinMethods.parseInputCurrency(value)"
                          v-model="siteSurveyDetails.value.projectCost">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="finalProfit" :label="$t('survey.details.finalProfit')">
                <el-input :formatter="(value) => formatCurrency(value)"
                          :parser="(value) => mixinMethods.parseInputCurrency(value, true)"
                          v-model="siteSurveyDetails.value.finalProfit"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="attachments" :label="$t('survey.details.attachments')">
                <FileUpload
                    :disabled="!isAllowEditSurvey"
                    :existingFiles="siteSurveyDetails.value.attachments"
                    :allowedTypes="'.jpg,.png,.pdf,.docx'"
                    :fileLimit="3"
                    class="input-wd-96"
                    @file-selected="handleFileUpload"
                />
              </el-form-item>
            </el-col>
          </el-row>

<!--          Conclusion-->
          <el-divider content-position="left">{{ $t('survey.details.sections.conclusion') }}</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="biddingDecision" :label="$t('survey.details.biddingDecision')">
                <el-select v-model="siteSurveyDetails.value.biddingDecision" placeholder="Choose one">
                  <el-option :label="$t('common.approve')" :value="1"/>
                  <el-option :label="$t('common.reject')" :value="0"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import IconBackMain from '@/svg/IconBackMain.vue';
import {useSiteSurveyStore} from '@/store/site-survey.js';
import PAGE_NAME from '@/constants/route-name.js';
import FileUpload from "@/components/common/FileUpload.vue";
import {usePersistenceStore} from "@/store/persistence.js";
import {getSiteSurveyRules} from "@/rules/site-survey/index.js";
import {mixinMethods} from "@/utils/variables.js";
import {BUSINESS_EMPLOYEE, TECHNICAL_MANAGER} from "@/constants/roles.js";
import {RECEIVE_STATUS} from "@/constants/project.js";
import {useProjectStore} from "@/store/project.js";

export default {
  components: {FileUpload, IconBackMain},
  setup() {
    const SURVEY_RULES = getSiteSurveyRules();
    const siteSurveyStore = useSiteSurveyStore();
    const persistenceStore = usePersistenceStore();
    const projectStore = useProjectStore();
    const {siteSurveyDetails, getSurveyDetails, clearSurveyDetails, saveSurvey} = siteSurveyStore;
    const {
      projectDetails,
      getProjectDetails,
    } = projectStore;
    const {projectId} = persistenceStore;
    const isAllowEditSurvey = computed(() => (localStorage.getItem('role') === TECHNICAL_MANAGER && projectDetails.value.status === RECEIVE_STATUS));

    const route = useRoute();
    const router = useRouter();
    const ruleFormRef = ref(null);
    const isCreateMode = ref(false);

    onMounted(async () => {
      if (route.params.id) {
        await getProjectDetails(projectId.value);
        await getSurveyDetails(route.params.id);
        isCreateMode.value = !siteSurveyDetails.value;

      } else {
        clearSurveyDetails();
        isCreateMode.value = true;
      }
    });

    onUnmounted(() => {
      clearSurveyDetails();
    });

    const formatCurrency = (number) => {
      return mixinMethods.formatInputCurrency(number);
    }

    const handleBack = () => {
      router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
    };

    const handleFileUpload = (files) => {
      siteSurveyDetails.value.attachments = files;
    }

    const submitForm = () => {
      siteSurveyDetails.value.projectId = projectId.value;
      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          await saveSurvey(siteSurveyDetails.value);
          await router.push({name: PAGE_NAME.PROJECT.DETAILS, params: {id: projectId.value}});
        }
      });
    };

    return {
      SURVEY_RULES,
      ruleFormRef,
      siteSurveyDetails,
      isAllowEditSurvey,
      mixinMethods,
      handleBack,
      submitForm,
      handleFileUpload,
      formatCurrency,
      route,
      isCreateMode,
    };
  },
};
</script>

<style scoped>
.survey-form-container {
  padding: 40px;
  background-color: #f0f4f8;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.survey-update {
  width: 100%;
  max-width: 100%;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}

.survey-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page__ttl {
  font-size: 24px;
  font-weight: bold;
  flex-grow: 1;
  text-align: center;
}

.btn-back {
  cursor: pointer;
  margin-right: 20px;
}

.survey-btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  border: 1px solid #3b5a9a;
  background: #e8eafb;
  color: #3b5a9a;
  width: 124px;
  height: 37px;
}

.btn-save {
  background: #5a6acf;
  border: 1px solid #3c4ec0;
  color: #fff;
}

.survey-body {
  background: #fafafa;
  padding: 25px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.el-form-item {
  margin-bottom: 25px;
}

.el-form-item__label {
  font-weight: bold;
  color: #34495e;
  font-size: 16px;
}

.el-divider__text {
  background-color: #f0f4f8;
  padding: 0 10px;
  color: #2980b9;
  font-weight: bold;
  font-size: 18px;
}
</style>