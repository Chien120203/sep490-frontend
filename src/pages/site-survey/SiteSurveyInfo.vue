<template>
  <div class="project-progress">
    <div v-if="data && !isSurveyNull">
      <div class="header">
        <h2>{{ $t('survey.details.siteSurveyName') }}: {{ data.siteSurveyName }}</h2>
        <div class="status">
          <el-button class="btn btn-save" @click="$emit('details')">
            {{ $t("common.edit") }}
          </el-button>
        </div>
      </div>

      <div class="details-container">
        <div class="column">
          <p><strong>{{ $t('survey.details.biddingDecision') }}:</strong> {{ getBidDecision(data?.biddingDecision) }}</p>
        </div>
        <div class="column">
          <p><strong>{{ $t('survey.details.estimatedProfits') }}:</strong> {{ formatCurrency(data.estimatedProfits) }}</p>
          <p><strong>{{ $t('survey.details.tenderPackagePrice') }}:</strong> {{ formatCurrency(data.tenderPackagePrice) }}</p>
          <p><strong>{{ $t('survey.details.totalBidPrice') }}:</strong> {{ formatCurrency(data.totalBidPrice) }}</p>
        </div>
        <div class="column">
          <p><strong>{{ $t('survey.details.discountRate') }}:</strong> {{ data.discountRate }}</p>
          <p><strong>{{ $t('survey.details.projectCost') }}:</strong> {{ formatCurrency(data.projectCost) }}</p>
          <p><strong>{{ $t('survey.details.finalProfit') }}:</strong> {{ formatCurrency(data.finalProfit) }}</p>
        </div>
      </div>

      <div v-if="data.attachments && data.attachments.length" class="attachments">
        <p><strong>{{ $t('survey.details.attachments') }}: </strong></p>
        <ul>
          <li v-for="(attachment, index) in data.attachments" :key="index">
            <a :href="attachment.webViewLink" target="_blank">
              {{ attachment.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- No survey data available -->
    <div v-else class="no-survey">
      <p>{{ $t('survey.details.no_survey') }}</p>
      <el-button v-if="allowCreate" class="btn btn-create" @click="$emit('create')">
        {{ $t("common.create") }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {BID_DECISION_LABELS, RECEIVE_STATUS, STATUS_LABELS} from "@/constants/survey.js";
import { mixinMethods } from "@/utils/variables.js";
import { toRefs } from 'vue';
import {useI18n} from "vue-i18n";
import {CURRENCY} from "@/constants/application.js";

// Nhận dữ liệu từ component cha
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  isSurveyNull: {
    type: Boolean,
    required: true
  },
  allowCreate: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['details', 'create']);
const {t} = useI18n();
const { data, isSurveyNull } = toRefs(props);

const formatStatus = (status) => {
  return STATUS_LABELS[status] || 'Unknown';
};

const getBidDecision = (bidDecision) => {
  const labelKey = BID_DECISION_LABELS[bidDecision];
  return labelKey ? t(labelKey) : "";
}

const formatCurrency = (inputCurrency) => {
  return `${mixinMethods.formatInputCurrency(inputCurrency)} ${CURRENCY}`;
}
</script>

<style scoped>
.project-progress {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  position: relative;
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
  color: white;
  position: absolute;
  top: 20px;
  right: 20px;
}

.btn-create {
  background-color: #5A6ACF;
  border: 1px solid #3C4EC0;
  color: white;
}

.attachment a {
  color: #5A6ACF;
  text-decoration: none;
}

.attachment a:hover {
  text-decoration: underline;
}

.no-survey {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #ff0000;
  font-size: 18px;
}
</style>