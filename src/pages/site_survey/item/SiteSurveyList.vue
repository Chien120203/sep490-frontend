<template>
  <div class="project-progress">
    <div class="header">
      <h2>{{$t('survey.details.survey_name')}}: {{ survey.siteSurveyName }}</h2>
      <div class="status">
        <el-button class="btn btn-save" @click="$emit('edit')">
          {{ $t("common.edit") }}
        </el-button>
      </div>
    </div>

    <div class="details-container">
      <div class="column">
        <p><strong>{{$t('survey.details.project_code')}}:</strong> {{ survey.siteSurveyCode }}</p>
        <p><strong>{{$t('survey.details.biddingDecision')}}:</strong> {{ survey.biddingDecision }}</p>
        <span><strong>{{$t('survey.details.status')}}:</strong> {{ $t(formatStatus(survey.status)) }}</span>
      </div>
      <div class="column">
        <p><strong>{{$t('survey.details.estimatedProfits')}}:</strong> {{ survey.estimatedProfits }}</p>
        <p><strong>{{$t('survey.details.tenderPackagePrice')}}:</strong> {{ survey.tenderPackagePrice }}</p>
        <p><strong>{{$t('survey.details.totalBidPrice')}}:</strong> {{ survey.totalBidPrice }}</p>
      </div>
      <div class="column">
        <p><strong>{{$t('survey.details.discountRate')}}:</strong> {{ survey.discountRate }}</p>
        <p><strong>{{$t('survey.details.projectCost')}}:</strong> {{ survey.projectCost }}</p>
        <p><strong>{{$t('survey.details.finalProfit')}}:</strong> {{ survey.finalProfit }}</p>
      </div>
    </div>

    <div v-if="survey.attachments && survey.attachments.length" class="attachments">
      <p><strong>{{$t('survey.details.attachments')}}: </strong></p>
      <ul>
        <li v-for="(attachment, index) in survey.attachments" :key="index">
          <a :href="attachment.webViewLink" target="_blank">
            {{ attachment.name }}
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import {RECEIVE_STATUS, STATUS_LABELS} from "@/constants/survey.js";
import {mixinMethods} from "@/utils/variables.js";

const formatStatus = (status) => {
  return STATUS_LABELS[status] || 'Unknown';
};

const formatCurrency = (inputCurrency) => {
  return mixinMethods.formatCurrency(inputCurrency);
}

const formatDate = (date) => {
  return mixinMethods.showDateTime(date);
}

defineProps({
  survey: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      siteSurveyName: "",
      constructionRequirements: "",
      equipmentRequirements: "",
      humanResourceCapacity: "",
      riskAssessment: "",
      biddingDecision: "",
      profitAssessment: "",
      bidWinProb: "",
      estimatedExpenses: "",
      estimatedProfits: "",
      tenderPackagePrice: "",
      totalBidPrice: "",
      discountRate: "",
      projectCost: "",
      finalProfit: "",
      status: "",
      comments: "",
      attachments: "",
      surveyDetails: ""
    })
  }
});
</script>

<style scoped>
.project-progress {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.status {
  color: #888;
}

.details-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.column {
  flex: 1;
}

.details p,
.description p,
.attachment p {
  margin: 5px 0;
}

.btn-save {
  margin-left: 12px;
}

.attachment a {
  color: #007bff;
  text-decoration: none;
}

.attachment a:hover {
  text-decoration: underline;
}
</style>
