<template>
  <div class="survey-form-container">
    <div class="survey-update">
      <div class="survey-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain /></span>
          {{ isCreateMode ? $t('survey.create.title') : $t('survey.details.title') }}
        </h3>
        <div class="survey-btn-detail">
          <div class="item">
            <el-button class="btn btn-save" @click="submitForm">
              {{ $t('common.save') }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="survey-body mt-0">
        {{siteSurveyDetails.value}}
<!--        <el-form-->
<!--            ref="ruleFormRef"-->
<!--            :model="siteSurveyDetails.value"-->
<!--            :rules="SURVEY_RULES"-->
<!--            class="survey-form"-->
<!--            label-width="150px"-->
<!--        >-->
<!--          &lt;!&ndash; Thông tin chung &ndash;&gt;-->
<!--          <el-divider content-position="left">{{ $t('survey.details.sections.generalInfo') }}</el-divider>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="siteSurveyName" :label="$t('survey.details.siteSurveyName')">-->
<!--                <el-input v-model="siteSurveyDetails.value.siteSurveyName" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--          &lt;!&ndash; Về cơ sở & Đánh giá &ndash;&gt;-->
<!--          <el-divider content-position="left">{{ $t('survey.details.sections.facilityAssessment') }}</el-divider>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="construction" :label="$t('survey.details.constructionRequirements')">-->
<!--                <el-input v-model="siteSurveyDetails.value.constructionRequirements" type="textarea" :rows="3" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="equipment" :label="$t('survey.details.equipmentRequirements')">-->
<!--                <el-input v-model="siteSurveyDetails.value.equipmentRequirements" type="textarea" :rows="3" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="humanResource" :label="$t('survey.details.humanResourceCapacity')">-->
<!--                <el-input v-model="siteSurveyDetails.value.humanResourceCapacity" type="textarea" :rows="3" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="capacity" :label="$t('survey.details.riskAssessment')">-->
<!--                <el-input v-model="siteSurveyDetails.value.riskAssessment" type="textarea" :rows="3" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="biddingDecision" :label="$t('survey.details.biddingDecision')">-->
<!--                <el-select v-model="siteSurveyDetails.value.biddingDecision" placeholder="Choose one">-->
<!--                  <el-option label="YES" value="YES" />-->
<!--                  <el-option label="NO" value="NO" />-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="profitAssessment" :label="$t('survey.details.profitAssessment')">-->
<!--                <el-input v-model="siteSurveyDetails.value.profitAssessment" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--          &lt;!&ndash; Thông tin chính &ndash;&gt;-->
<!--          <el-divider content-position="left">{{ $t('survey.details.sections.mainInfo') }}</el-divider>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="bidWinProbability" :label="$t('survey.details.bidWinProb')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.bidWinProb" type="number">-->
<!--                  <template #append>%</template>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="estimatedExpenses" :label="$t('survey.details.estimatedExpenses')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.estimatedExpenses" type="number" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="estimatedProfits" :label="$t('survey.details.estimatedProfits')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.estimatedProfits" type="number" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="tenderPackage" :label="$t('survey.details.tenderPackagePrice')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.tenderPackagePrice" type="number" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="price" :label="$t('survey.details.totalBidPrice')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.totalBidPrice" type="number" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="totalBidPrice" :label="$t('survey.details.discountRate')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.discountRate" type="number" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="discountRate" :label="$t('survey.details.projectCost')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.projectCost" type="number">-->
<!--                  <template #append>%</template>-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="projectCost" :label="$t('survey.details.finalProfit')">-->
<!--                <el-input v-model.number="siteSurveyDetails.value.finalProfit" type="number" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--          &lt;!&ndash; Thông tin phụ &ndash;&gt;-->
<!--          <el-divider content-position="left">{{ $t('survey.details.sections.additionalInfo') }}</el-divider>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="status" :label="$t('survey.details.status')">-->
<!--                <el-select v-model="siteSurveyDetails.value.status" placeholder="Choose one">-->
<!--                  <el-option label="In Progress" value="In Progress" />-->
<!--                  <el-option label="Completed" value="Completed" />-->
<!--                  <el-option label="Pending" value="Pending" />-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="comments" :label="$t('survey.details.comments')">-->
<!--                <el-input v-model="siteSurveyDetails.value.comments" type="textarea" :rows="3" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item prop="attachments" :label="$t('survey.details.attachments')">-->
<!--                <FileUpload-->
<!--                    :existingFiles="siteSurveyDetails.value.attachments"-->
<!--                    :allowedTypes="'.jpg,.png,.pdf,.docx'"-->
<!--                    :fileLimit="3"-->
<!--                    class="input-wd-96"-->
<!--                    @file-selected="handleFileUpload"-->
<!--                />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-form>-->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import IconBackMain from '@/svg/IconBackMain.vue';
import { useSiteSurveyStore } from '@/store/site-survey.js';
import PAGE_NAME from '@/constants/route-name.js';
import FileUpload from "@/components/common/FileUpload.vue";
import {usePersistenceStore} from "@/store/persistence.js";

const SURVEY_RULES = {
  siteSurveyName: [
    { required: true, message: 'siteSurvey.validation.siteSurveyNameRequired', trigger: 'blur' },
  ],
  construction: [
    { required: true, message: 'siteSurvey.validation.constructionRequired', trigger: 'blur' },
  ],
  equipment: [
    { required: true, message: 'siteSurvey.validation.equipmentRequired', trigger: 'blur' },
  ],
  humanResource: [
    { required: true, message: 'siteSurvey.validation.humanResourceRequired', trigger: 'blur' },
  ],
  capacity: [
    { required: true, message: 'siteSurvey.validation.capacityRequired', trigger: 'blur' },
  ],
  biddingDecision: [
    { required: true, message: 'siteSurvey.validation.biddingDecisionRequired', trigger: 'change' },
  ],
  profitAssessment: [
    { required: true, message: 'siteSurvey.validation.profitAssessmentRequired', trigger: 'blur' },
  ],
  bidWinProbability: [
    { required: true, message: 'siteSurvey.validation.bidWinProbabilityRequired', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: 'siteSurvey.validation.bidWinProbabilityRange', trigger: 'blur' },
  ],
  estimatedExpenses: [
    { required: true, message: 'siteSurvey.validation.estimatedExpensesRequired', trigger: 'blur' },
  ],
  estimatedProfits: [
    { required: true, message: 'siteSurvey.validation.estimatedProfitsRequired', trigger: 'blur' },
  ],
  tenderPackage: [
    { required: true, message: 'siteSurvey.validation.tenderPackageRequired', trigger: 'blur' },
  ],
  price: [
    { required: true, message: 'siteSurvey.validation.priceRequired', trigger: 'blur' },
  ],
  totalBidPrice: [
    { required: true, message: 'siteSurvey.validation.totalBidPriceRequired', trigger: 'blur' },
  ],
  discountRate: [
    { required: true, message: 'siteSurvey.validation.discountRateRequired', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: 'siteSurvey.validation.discountRateRange', trigger: 'blur' },
  ],
  projectCost: [
    { required: true, message: 'siteSurvey.validation.projectCostRequired', trigger: 'blur' },
  ],
  finalProfit: [
    { required: true, message: 'siteSurvey.validation.finalProfitRequired', trigger: 'blur' },
  ],
  status: [
    { required: true, message: 'siteSurvey.validation.statusRequired', trigger: 'change' },
  ],
};

export default {
  components: {FileUpload, IconBackMain },
  setup() {
    const { t } = useI18n();
    const siteSurveyStore = useSiteSurveyStore();
    const { siteSurveyDetails, getSurveyDetails, clearSurveyDetails, saveSurvey } = siteSurveyStore;
    const persistenceStore = usePersistenceStore();
    const route = useRoute();
    const router = useRouter();
    const ruleFormRef = ref(null);

    const isCreateMode = ref(false);

    const {projectId} = persistenceStore

    onMounted(async () => {
      if (route.params.id) {
        await getSurveyDetails(route.params.id);
        isCreateMode.value = !siteSurveyDetails.value;
        console.log(siteSurveyDetails.value);
      } else {
        isCreateMode.value = true;
      }
    });

    onUnmounted(() => {
      clearSurveyDetails();
    });

    const handleBack = () => {

      router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: projectId.value } });
    };

    const handleFileUpload = (files) => {
      siteSurveyDetails.value.attachments = files;
    }

    const submitForm = () => {
      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          await saveSurvey(siteSurveyDetails.value);
          router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: projectId.value } });
        }
      });
    };

    return {
      SURVEY_RULES,
      ruleFormRef,
      siteSurveyDetails,
      handleBack,
      submitForm,
      handleFileUpload,
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
  max-width: 95%;
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