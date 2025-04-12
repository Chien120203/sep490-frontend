<template>
  <div class="inspection-report-detail">
    <h1>Chi Tiết Báo Cáo Nghiệm Thu</h1>
    <div v-if="report">
      <p><strong>Tên Báo Cáo:</strong> {{ report.name }}</p>
      <p><strong>Ngày Tạo:</strong> {{ report.createdAt }}</p>
      <p><strong>Trạng Thái:</strong> {{ report.status }}</p>
      <p><strong>Mô Tả:</strong> {{ report.description }}</p>
    </div>
    <div v-else>
      <p>Không tìm thấy báo cáo.</p>
    </div>
    <button @click="goBack">Quay Lại</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "InspectionReportDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const report = ref(null);

    // Dummy data
    const reports = [
      { id: 1, name: "Báo Cáo 1", createdAt: "2025-04-01", status: "Hoàn Thành", description: "Mô tả chi tiết báo cáo 1" },
      { id: 2, name: "Báo Cáo 2", createdAt: "2025-04-03", status: "Đang Chờ", description: "Mô tả chi tiết báo cáo 2" },
      { id: 3, name: "Báo Cáo 3", createdAt: "2025-04-05", status: "Đã Huỷ", description: "Mô tả chi tiết báo cáo 3" },
    ];

    onMounted(() => {
      const id = parseInt(route.params.id, 10);
      report.value = reports.find((r) => r.id === id);
    });

    const goBack = () => {
      router.push("/inspection-reports");
    };

    return {
      report,
      goBack,
    };
  },
};
</script>

<style scoped>
.inspection-report-detail {
  padding: 20px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>