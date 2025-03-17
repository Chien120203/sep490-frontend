<template>
  <div class="survey-form-container">
    <el-card class="survey-card">
      <div slot="header" class="survey-card-header">
        <div class="survey-card-actions-left">
          <el-button type="primary" @click="goHome">Back to Home</el-button>
        </div>
        <h2>Site Survey Details</h2>
        <div class="survey-card-actions-right">
          <el-button type="success" @click="goEdit">Edit</el-button>
        </div>
      </div>
      <el-form :model="form" label-width="150px" class="survey-form">
        <!-- Phần 1: Thông tin chung -->
        <el-divider content-position="left">Thông tin chung</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID">
              <p>{{ form.id }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Site Survey Name">
              <p>{{ form.siteSurveyName }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 2: Yêu cầu & Đánh giá -->
        <el-divider content-position="left">Yêu cầu & Đánh giá</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Construction Requirements">
              <p>{{ form.constructionRequirements }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Equipment Requirements">
              <p>{{ form.equipmentRequirements }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Human Resource Capacity">
              <p>{{ form.humanResourceCapacity }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Risk Assessment">
              <p>{{ form.riskAssessment }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Bidding Decision">
              <p>{{ form.biddingDecision ? "Yes" : "No" }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Profit Assessment">
              <p>{{ form.profitAssessment }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 3: Thông tin tài chính -->
        <el-divider content-position="left">Thông tin tài chính</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Bid Win Probability (%)">
              <p>{{ form.bidWinProb }}%</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Estimated Expenses">
              <p>{{ form.estimatedExpenses }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Estimated Profits">
              <p>{{ form.estimatedProfits }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tender Package Price">
              <p>{{ form.tenderPackagePrice }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Total Bid Price">
              <p>{{ form.totalBidPrice }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Discount Rate (%)">
              <p>{{ form.discountRate }}%</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Project Cost">
              <p>{{ form.projectCost }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Final Profit">
              <p>{{ form.finalProfit }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 4: Thông tin phụ -->
        <el-divider content-position="left">Thông tin phụ</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Status">
              <p>{{ getStatusLabel(form.status) }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Comments">
              <p>{{ form.comments }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Attachments">
              <ul>
                <li v-for="file in form.attachments" :key="file.name">
                  <a :href="file.url" target="_blank">{{ file.name }}</a>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Survey Details">
              <p>{{ form.surveyDetails }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SiteSurveyDisplay",
  data() {
    return {
      form: {
        id: 123,
        siteSurveyName: "Sample Survey",
        constructionRequirements: "Require heavy machinery and skilled labor.",
        equipmentRequirements: "Need excavators, cranes, and safety gear.",
        humanResourceCapacity: "Team of 20 workers, 2 supervisors.",
        riskAssessment: "High risk due to weather conditions.",
        biddingDecision: true,
        profitAssessment: "Expected profit margin of 15%.",
        bidWinProb: 75,
        estimatedExpenses: 500000,
        estimatedProfits: 75000,
        tenderPackagePrice: 600000,
        totalBidPrice: 550000,
        discountRate: 5,
        projectCost: 480000,
        finalProfit: 70000,
        status: 1, // In Progress
        comments: "Survey is on track.",
        attachments: [
          { name: "survey_plan.pdf", url: "#" },
          { name: "budget.xlsx", url: "#" }
        ],
        surveyDetails: "Detailed survey of the construction site."
      }
    };
  },
  methods: {
    getStatusLabel(status) {
      const statusMap = {
        0: "Planned",
        1: "In Progress",
        2: "Completed",
        3: "Paused"
      };
      return statusMap[status] || "Unknown";
    },
    goHome() {
      // Logic to go back to home
      console.log("Navigating to home...");
    },
    goEdit() {
      // Logic to navigate to edit page
      console.log("Navigating to edit page...");
    }
  }
};
</script>

<style scoped>
/* Container chính của form */
.survey-form-container {
  padding: 40px;
  background-color: #f0f4f8; /* Màu nền nhẹ nhàng */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card bao quanh form */
.survey-card {
  width: 100%;
  max-width: 95%;
  padding: 30px;
  border-radius: 12px; /* Bo tròn góc */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); /* Đổ bóng */
  background-color: #ffffff;
}

/* Tiêu đề của card */
.survey-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50; /* Màu xanh đậm nhạt */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 24px;
  font-weight: bold;
}

/* Các button bên trái và bên phải */
.survey-card-actions-left,
.survey-card-actions-right {
  width: 150px;
}

/* Tiêu đề giữa */
.survey-card-header h2 {
  flex-grow: 1;
  text-align: center;
  font-size: 24px;
}

/* Các button trên tiêu đề */
.survey-card-actions-left el-button,
.survey-card-actions-right el-button {
  width: 100%;
}

/* Form bên trong */
.survey-form {
  background: #fafafa; /* Nền xám nhạt */
  padding: 25px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ bên trong */
}

/* Các item trong form */
.el-form-item {
  margin-bottom: 25px; /* Khoảng cách giữa các mục */
}

/* Nhãn của form */
.el-form-item__label {
  font-weight: bold;
  color: #34495e; /* Màu xám xanh đậm */
  font-size: 16px;
}

/* Nội dung của form */
.el-form-item p {
  color: #555; /* Màu xám trung tính */
  font-size: 15px;
  line-height: 1.6; /* Độ cao dòng cho dễ đọc */
}

/* Đường phân cách (nếu có) */
.el-divider__text {
  background-color: #f0f4f8;
  padding: 0 10px;
  color: #2980b9; /* Màu xanh dương nổi bật */
  font-weight: bold;
  font-size: 18px;
}
</style>
