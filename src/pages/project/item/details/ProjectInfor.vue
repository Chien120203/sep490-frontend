<template>
  <div class="project-progress">
    <div class="header">
      <h2>{{$t('project.details.infor.project_name')}}: {{ project.projectName }}</h2>
      <div class="status">
        <el-button class="btn btn-save" @click="$emit('edit')">
          {{ $t("common.edit") }}
        </el-button>
      </div>
    </div>

    <div class="details-container">
      <div class="column">
        <p><strong>{{$t('project.details.infor.project_code')}}:</strong> {{ project.projectCode }}</p>
        <p><strong>{{$t('project.details.infor.customer')}}:</strong> {{ project?.customerCode }}</p>
        <span><strong>{{$t('project.details.infor.status')}}:</strong> {{ $t(formatStatus(project.status)) }}</span>
      </div>
      <div class="column">
        <p><strong>{{$t('project.details.infor.location')}}:</strong> {{ project.location }}</p>
        <p><strong>{{$t('project.details.infor.area')}}:</strong> {{ project.area.toLocaleString() }}</p>
        <span><strong>{{$t('project.details.infor.start_date') }} - {{$t('project.details.infor.end_date') }}:</strong> {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</span>
      </div>
      <div class="column">
        <p><strong>{{$t('project.details.infor.construct_type')}}:</strong> {{ project.constructType }}</p>
        <p><strong>{{$t('project.details.infor.budget')}}:</strong> {{ formatCurrency(project.budget) }}</p>
        <p><strong>{{$t('project.details.infor.technical_reqs')}}:</strong> {{ project.technicalReqs }}</p>
      </div>
    </div>

    <div v-if="project.attachments && project.attachments.length" class="attachments">
      <p><strong>{{$t('project.details.infor.attachment')}}: </strong></p>
      <ul>
        <li v-for="(attachment, index) in project.attachments" :key="index">
          <a :href="attachment.webViewLink" target="_blank">
            {{ attachment.name }}
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import {defineProps, ref} from 'vue';
import {STATUS_LABELS} from "@/constants/project.js";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  project: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      projectCode: "",
      projectName: "",
      customerId: "",
      constructType: "",
      location: "",
      area: 0,
      timeline: "",
      purpose: "",
      technicalReqs: "",
      startDate: "",
      endDate: "",
      budget: 0,
      status: 0,
      attachment: "",
      description: ""
    })
  }
});

const formatStatus = (status) => {
  return STATUS_LABELS[status] || 'Unknown';
};

const formatCurrency = (inputCurrency) => {
  return mixinMethods.formatCurrency(inputCurrency);
}

const formatDate = (date) => {
  return mixinMethods.showDateTime(date);
}
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
