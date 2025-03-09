<template>
  <div class="survey-form-container">
    <el-card class="survey-card">
      <div slot="header" class="survey-card-header">
        <h2>Site Survey Details</h2>
      </div>
      <el-form :model="form" ref="form" label-width="150px" class="survey-form">
        <!-- Phần 1: Thông tin chung -->
        <el-divider content-position="left">Thông tin chung</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Site Survey Name">
              <el-input v-model="form.siteSurveyName" placeholder="Nhập tên khảo sát"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 2: Yêu cầu & Đánh giá -->
        <el-divider content-position="left">Yêu cầu & Đánh giá</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Construction Requirements">
              <el-input
                  type="textarea"
                  v-model="form.constructionRequirements"
                  :rows="3"
                  placeholder="Nhập yêu cầu thi công"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Equipment Requirements">
              <el-input
                  type="textarea"
                  v-model="form.equipmentRequirements"
                  :rows="3"
                  placeholder="Nhập yêu cầu thiết bị"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Human Resource Capacity">
              <el-input
                  type="textarea"
                  v-model="form.humanResourceCapacity"
                  :rows="3"
                  placeholder="Nhập năng lực nhân sự"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Risk Assessment">
              <el-input
                  type="textarea"
                  v-model="form.riskAssessment"
                  :rows="3"
                  placeholder="Nhập đánh giá rủi ro"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Bidding Decision">
              <el-radio-group v-model="form.biddingDecision">
                <el-radio :label="true">Yes</el-radio>
                <el-radio :label="false">No</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Profit Assessment">
              <el-input
                  type="textarea"
                  v-model="form.profitAssessment"
                  :rows="3"
                  placeholder="Nhập đánh giá lợi nhuận"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 3: Thông tin tài chính -->
        <el-divider content-position="left">Thông tin tài chính</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Bid Win Probability (%)">
              <el-input-number
                  v-model="form.bidWinProb"
                  :min="0"
                  :max="100"
                  :step="1"
                  style="width: 100%;"
                  placeholder="0-100"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Estimated Expenses">
              <el-input-number
                  v-model="form.estimatedExpenses"
                  :min="0"
                  style="width: 100%;"
                  placeholder="Nhập chi phí dự kiến"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Estimated Profits">
              <el-input-number
                  v-model="form.estimatedProfits"
                  :min="0"
                  style="width: 100%;"
                  placeholder="Nhập lợi nhuận dự kiến"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tender Package Price">
              <el-input-number
                  v-model="form.tenderPackagePrice"
                  :min="0"
                  style="width: 100%;"
                  placeholder="Nhập giá gói thầu"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Total Bid Price">
              <el-input-number
                  v-model="form.totalBidPrice"
                  :min="0"
                  style="width: 100%;"
                  placeholder="Nhập tổng giá thầu"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Discount Rate (%)">
              <el-input-number
                  v-model="form.discountRate"
                  :min="0"
                  :max="100"
                  :step="0.1"
                  style="width: 100%;"
                  placeholder="Nhập tỷ lệ chiết khấu"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Project Cost">
              <el-input-number
                  v-model="form.projectCost"
                  :min="0"
                  style="width: 100%;"
                  placeholder="Nhập chi phí dự án"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Final Profit">
              <el-input-number
                  v-model="form.finalProfit"
                  :min="0"
                  style="width: 100%;"
                  placeholder="Nhập lợi nhuận cuối cùng"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Phần 4: Thông tin phụ -->
        <el-divider content-position="left">Thông tin phụ</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Status">
              <el-select v-model="form.status" placeholder="Chọn trạng thái">
                <el-option label="Planned" :value="0"></el-option>
                <el-option label="In Progress" :value="1"></el-option>
                <el-option label="Completed" :value="2"></el-option>
                <el-option label="Paused" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Comments">
              <el-input
                  type="textarea"
                  v-model="form.comments"
                  :rows="3"
                  placeholder="Nhập ghi chú"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Attachments">
              <el-upload
                  action="#"
                  list-type="text"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="form.attachments"
              >
                <el-button size="small" type="primary">Upload</el-button>
                <div slot="tip" class="el-upload__tip">Chỉ upload file hợp lệ.</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Survey Details">
              <el-input
                  type="textarea"
                  v-model="form.surveyDetails"
                  :rows="3"
                  placeholder="Nhập chi tiết khảo sát"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Nút Submit & Reset -->
        <el-form-item class="form-actions">
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SiteSurveyForm",
  data() {
    return {
      form: {
        id: 0,
        siteSurveyName: "",
        constructionRequirements: "",
        equipmentRequirements: "",
        humanResourceCapacity: "",
        riskAssessment: "",
        biddingDecision: null,
        profitAssessment: "",
        bidWinProb: null,
        estimatedExpenses: null,
        estimatedProfits: null,
        tenderPackagePrice: null,
        totalBidPrice: null,
        discountRate: null,
        projectCost: null,
        finalProfit: null,
        status: null,
        comments: "",
        attachments: [],
        surveyDetails: "",
      },
    };
  },
  methods: {
    submitForm() {
      // Xử lý logic gửi form tại đây
      console.log("Form submitted:", this.form);
    },
    resetForm() {
      // Reset form về giá trị mặc định
      this.$refs.form.resetFields();
    },
    handlePreview(file) {
      console.log("Preview file", file);
    },
    handleRemove(file, fileList) {
      console.log("Remove file", file, fileList);
    },
  },
};
</script>

<style scoped>
.survey-form-container {
  padding: 20px;
  background: #f2f4f7;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.survey-card {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.survey-card-header {
  text-align: center;
  margin-bottom: 20px;
}
.survey-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.el-form-item {
  margin-bottom: 20px;
}
.form-actions {
  text-align: center;
  margin-top: 30px;
}
</style>
