import { defineStore } from "pinia";
import { reactive } from "vue";
import { mixinMethods } from "@/utils/variables";

export const useInspectionReportStore = defineStore("inspectionReport", () => {
    // Mock Data for Inspection Reports
    const mockInspectionReports = [
        {
            id: 1,
            projectId: 101,
            inspect_code: "IR001",
            inspector: "Nguyễn Văn A",
            inspect_start_date: "2025-04-01",
            inspect_end_date: "2025-04-03",
            progress_id: 1,
            plan_id: 1,
            location: "Hà Nội",
            attachment: [],
            inspection_decision: 1,
            status: 0,
            quality_note: "Ghi chú về chất lượng",
            other_note: ""
        },
        {
            id: 2,
            projectId: 102,
            inspect_code: "IR002",
            inspector: "Nguyễn Văn B",
            inspect_start_date: "2025-04-05",
            inspect_end_date: "2025-04-07",
            progress_id: 2,
            plan_id: 2,
            location: "Hồ Chí Minh",
            attachment: [],
            inspection_decision: 2,
            status: 0,
            quality_note: "Không đạt yêu cầu",
            other_note: ""
        }
    ];

    // Reactive State
    const validation = reactive({ value: {} });
    const isShowModalConfirm = reactive({ value: false });
    const totalItems = reactive({ value: mockInspectionReports.length }); // Total items based on mock data
    const currentPage = reactive({ value: 1 });
    const listInspectionReports = reactive({ value: mockInspectionReports });
    const inspectionReportDetails = reactive({
        value: {
            id: 0,
            projectId: 0,
            inspect_code: "",
            inspector: "",
            inspect_start_date: "",
            inspect_end_date: "",
            progress_id: 0,
            plan_id: 0,
            location: "",
            attachment: [],
            inspection_decision: 0,
            status: 0,
            quality_note: "",
            other_note: ""
        }
    });

    // Methods
    const getListInspectionReport = async (params, isLoading = true) => {
        if (isLoading) mixinMethods.startLoading();
        try {
            // Filter or simulate pagination using mock data
            const filteredReports = mockInspectionReports.filter((report) => {
                if (params?.location) {
                    return report.location.includes(params.location);
                }
                return true;
            });

            listInspectionReports.value = filteredReports;
            totalItems.value = filteredReports.length;
            currentPage.value = params?.page || 1; // Simulate pagination
        } catch (error) {
            mixinMethods.notifyError("Không thể lấy danh sách báo cáo kiểm tra.");
        } finally {
            if (isLoading) mixinMethods.endLoading();
        }
    };

    const getInspectionReportDetails = async (id) => {
        mixinMethods.startLoading();
        try {
            const report = mockInspectionReports.find((item) => item.id === id);
            if (report) {
                inspectionReportDetails.value = report;
            } else {
                mixinMethods.notifyError("Không tìm thấy chi tiết báo cáo kiểm tra.");
            }
        } catch (error) {
            mixinMethods.notifyError("Không thể lấy thông tin chi tiết báo cáo kiểm tra.");
        } finally {
            mixinMethods.endLoading();
        }
    };

    const saveInspectionReport = async (params, method) => {
        mixinMethods.startLoading();
        try {
            if (method === "save") {
                if (params.id) {
                    // Update existing report
                    const index = mockInspectionReports.findIndex((item) => item.id === params.id);
                    if (index !== -1) {
                        mockInspectionReports[index] = { ...mockInspectionReports[index], ...params };
                        mixinMethods.notifySuccess("Cập nhật báo cáo kiểm tra thành công.");
                    }
                } else {
                    // Add new report
                    const newId = mockInspectionReports.length + 1;
                    const newReport = { ...params, id: newId };
                    mockInspectionReports.push(newReport);
                    mixinMethods.notifySuccess("Tạo mới báo cáo kiểm tra thành công.");
                }
                listInspectionReports.value = [...mockInspectionReports];
            }
        } catch (error) {
            mixinMethods.notifyError("Không thể lưu báo cáo kiểm tra.");
        } finally {
            mixinMethods.endLoading();
        }
    };

    const handleDeleteInspectionReport = async (id) => {
        mixinMethods.startLoading();
        try {
            const index = mockInspectionReports.findIndex((item) => item.id === id);
            if (index !== -1) {
                mockInspectionReports.splice(index, 1);
                listInspectionReports.value = [...mockInspectionReports];
                totalItems.value = mockInspectionReports.length;
                mixinMethods.notifySuccess("Xóa báo cáo kiểm tra thành công.");
            } else {
                mixinMethods.notifyError("Không tìm thấy báo cáo kiểm tra để xóa.");
            }
        } catch (error) {
            mixinMethods.notifyError("Không thể xóa báo cáo kiểm tra.");
        } finally {
            mixinMethods.endLoading();
            isShowModalConfirm.value = false;
        }
    };

    const clearInspectionReportDetails = () => {
        inspectionReportDetails.value = {
            id: 0,
            projectId: 0,
            inspect_code: "",
            inspector: "",
            inspect_start_date: "",
            inspect_end_date: "",
            progress_id: 0,
            plan_id: 0,
            location: "",
            attachment: [],
            inspection_decision: 0,
            status: 0,
            quality_note: "",
            other_note: ""
        };
    };

    return {
        validation,
        listInspectionReports,
        totalItems,
        currentPage,
        inspectionReportDetails,
        isShowModalConfirm,
        clearInspectionReportDetails,
        saveInspectionReport,
        getInspectionReportDetails,
        getListInspectionReport,
        handleDeleteInspectionReport
    };
});