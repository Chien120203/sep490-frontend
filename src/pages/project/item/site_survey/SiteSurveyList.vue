<template>
  <el-card class="card-container">
    <div slot="header" class="clearfix">
      <!-- Thêm sự kiện @click vào tiêu đề -->
      <span class="card-title" @click="$emit('details', survey.id)">{{ survey.siteName }}</span>
    </div>

    <div class="card-content">
      <div class="card-item">
        <strong>Mã công trình:</strong> <span>{{ survey.siteCode }}</span>
      </div>
      <div class="card-item">
        <strong>Ngày khảo sát:</strong> <span>{{ formatDate(survey.surveyDate) }}</span>
      </div>
      <div class="card-item">
        <strong>Địa điểm:</strong> <span>{{ survey.location }}</span>
      </div>
      <div class="card-item">
        <strong>Người khảo sát:</strong> <span>{{ survey.surveyor }}</span>
      </div>
      <div class="card-item">
        <strong>Trạng thái:</strong> <span>{{ formatStatus(survey.status) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      survey: {
        siteCode: 'S001',
        siteName: 'Site A',
        location: 'Hanoi',
        surveyDate: '2025-03-05',
        surveyor: 'Nguyen Van A',
        status: 1, // Trạng thái khảo sát, ví dụ: đang tiến hành
      }
    };
  },
  methods: {
    formatDate(inputDate) {
      return inputDate; // Định dạng ngày nếu cần
    },
    formatStatus(status) {
      return status === 1 ? 'Đang tiến hành' : 'Hoàn thành'; // Định dạng trạng thái
    }
  }
};
</script>

<style scoped>
.card-container {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #3498db; /* Màu sắc cho tiêu đề giống một nút */
  margin: 10px 0;
  cursor: pointer; /* Thêm cursor pointer để thể hiện có thể click */
  text-decoration: underline; /* Gạch dưới giống như một liên kết */
}

.card-title:hover {
  color: #1d78b3; /* Màu khi hover qua */
}

.card-content {
  padding: 15px;
  background-color: white;
  border-radius: 8px;
}

.card-item {
  margin-bottom: 10px;
  font-size: 14px;
}

.card-item strong {
  font-weight: 600;
  color: #34495e;
}
</style>
