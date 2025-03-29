<template>
  <div class="survey-form-container">
    <el-card v-if="siteSurveyDetails" class="survey-card">
      <template #header>
        <div class="survey-card-header">
          <div class="survey-card-actions-left">
            <el-button type="primary" @click="goHome">Back to Home</el-button>
          </div>
          <h2>Site Survey Details</h2>
          <div class="survey-card-actions-right">
            <el-button type="success" @click="editSiteSurvey">Edit</el-button>
          </div>
        </div>
      </template>
      <el-form :model="siteSurveyDetails" label-width="150px" class="survey-form">
        <!-- Phần 1: Thông tin chung -->
        <el-divider content-position="left">Thông tin chung</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID">
              <p>{{ siteSurveyDetails.id }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Site Survey Name">
              <p>{{ siteSurveyDetails.siteSurveyName }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 2: Yêu cầu & Đánh giá -->
        <el-divider content-position="left">Yêu cầu & Đánh giá</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Construction Requirements">
              <p>{{ siteSurveyDetails.constructionRequirements }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Equipment Requirements">
              <p>{{ siteSurveyDetails.equipmentRequirements }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Human Resource Capacity">
              <p>{{ siteSurveyDetails.humanResourceCapacity }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Risk Assessment">
              <p>{{ siteSurveyDetails.riskAssessment }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Bidding Decision">
              <p>{{ siteSurveyDetails.biddingDecision ? "Yes" : "No" }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Profit Assessment">
              <p>{{ siteSurveyDetails.profitAssessment }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 3: Thông tin tài chính -->
        <el-divider content-position="left">Thông tin tài chính</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Bid Win Probability (%)">
              <p>{{ siteSurveyDetails.bidWinProb }}%</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Estimated Expenses">
              <p>{{ siteSurveyDetails.estimatedExpenses }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Estimated Profits">
              <p>{{ siteSurveyDetails.estimatedProfits }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tender Package Price">
              <p>{{ siteSurveyDetails.tenderPackagePrice }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Total Bid Price">
              <p>{{ siteSurveyDetails.totalBidPrice }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Discount Rate (%)">
              <p>{{ siteSurveyDetails.discountRate }}%</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Project Cost">
              <p>{{ siteSurveyDetails.projectCost }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Final Profit">
              <p>{{ siteSurveyDetails.finalProfit }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 4: Thông tin phụ -->
        <el-divider content-position="left">Thông tin phụ</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Status">
              <p>{{ getStatusLabel(siteSurveyDetails.status) }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Comments">
              <p>{{ siteSurveyDetails.comments }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Attachments">
              <ul>
                <li v-for="file in siteSurveyDetails.attachments" :key="file.name">
                  <a :href="file.url" target="_blank">{{ file.name }}</a>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Survey Details">
              <p>{{ siteSurveyDetails.surveyDetails }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-else>
      <p>Loading...</p>
    </el-card>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { defineComponent } from 'vue';
import PAGE_NAME from "@/constants/route-name.js";
import { useProjectStore } from "@/store/project.js";
import { useSiteSurveyStore } from "@/store/site-survey.js";

export default defineComponent({
  name: 'SiteSurveyDisplay',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const projectStore = useProjectStore();
    const siteSurveyStore = useSiteSurveyStore();

    const { listProjects, projectDetails, getListProjects } = projectStore;
    const { siteSurveyDetails, getSurveyDetails } = siteSurveyStore;

    const surveyId = route.params.id;

    onMounted(async () => {
      await getSurveyDetails(surveyId);
    });

    const getStatusLabel = (status) => {
      const statusMap = {
        0: 'Planned',
        1: 'In Progress',
        2: 'Completed',
        3: 'Paused',
      };
      return statusMap[status] || 'Unknown';
    };

    const goHome = () => {
      router.push({ name: PAGE_NAME.PROJECT.DETAILS, params: { id: siteSurveyDetails.value.projectId } });
    };

    const editSiteSurvey = () => {
      router.push({ name: PAGE_NAME.SITE_SURVEY.CREATE, params: { id: siteSurveyDetails.value.projectId } });
    };

    return {
      siteSurveyDetails,
      getStatusLabel,
      goHome,
      editSiteSurvey,
    };
  },
});
</script>

<style scoped>
/* Giữ nguyên phần style của bạn */
</style>