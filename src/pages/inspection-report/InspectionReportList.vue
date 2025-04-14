<template>
  <div class="inspection inspection-list">
    <div class="inspection-header">
      <h3 class="page__ttl">{{ $t("inspection.title") }}</h3>
      <div class="inspection-btn-box">
        <el-row class="mb-4">
          <el-button class="btn btn-save" @click="handleRedirectToCreate">
            {{ $t("common.add_new") }}
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="inspection-body">
      <div class="inspection-search">
        <div class="inspection-search-box col-md-9 col-lg-9">
          <p class="inspection-search__ttl">
            {{ $t("common.keyword") }}
          </p>
          <div class="mb-0 ruleform">
            <el-input
                :placeholder="$t('common.input_keyword')"
                @keyup.enter="submitForm"
                v-model="searchForms.search"
                prop="search"
            />
          </div>
        </div>
        <div class="btn-search-select col-md-3 col-lg-3 inspection-box-btn-all">
          <el-button class="btn btn-search" @click="submitForm">
            {{ $t("common.search") }}
          </el-button>
          <el-button class="btn btn-clear" @click="handleClear">
            {{ $t("common.clear") }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="inspection-body-table">
      <InspectionReportTable
          :data="listInspectionReports.value"
          @details="handleGetInspectionDetails"
          @delete="handleDisplayModal"
      />
    </div>

    <ModalConfirm
        :isShowModal="isShowModalConfirm.value"
        @close-modal="closeModalConfirm"
        :isConfirmByText="true"
        :confirmText="TEXT_CONFIRM_DELETE"
        @confirmAction="handleConfirm"
        :message="$t('inspection.modal_confirm.message')"
        :title="$t('inspection.modal_confirm.title')"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import {useRouter} from "vue-router";
import InspectionReportTable from "./item/InspectionReportTable.vue";
import ModalConfirm from "@/components/common/ModalConfirm.vue";
import PAGE_NAME from "@/constants/route-name.js";
import { TEXT_CONFIRM_DELETE } from "@/constants/application.js";
import IconSetting from "@/svg/IconSettingMain.vue";
import IconCircleClose from "@/svg/IconCircleClose.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import LoadMore from "@/components/common/LoadMore.vue";

export default {
  name: "InspectionReportList",
  components: {
    InspectionReportTable,
    ModalConfirm,
    IconSetting,
    IconCircleClose,
    SingleOptionSelect,
    LoadMore,
  },
  setup() {
    const searchForms = ref({
      search: "",
      pageIndex: 1,
    });

    const delete_id = ref();
    const router = useRouter();

    const isShowModalConfirm = ref(false);
    const listInspectionReports = ref([
      {
        id: 9,
        projectCode: "PJ009",
        inspectionCode: "INSP009",
        inspectionName: "Nghiệm thu kết cấu bê tông",
        date: "2023-11-05",
        status: "Hoàn thành",
        tenCongTrinh: "Tòa nhà văn phòng KLM",
        diaDiem: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
        loaiCongTrinh: "Dân dụng",
        capCongTrinh: "Cấp II",
        moTaCongTrinh: "Tòa nhà 15 tầng, diện tích sàn 8000 m²",
        chuDauTu: "Công ty Bất động sản UVW",
        nhaThauThiCong: "Công ty Xây dựng XYZ",
        donViThietKe: "Công ty Thiết kế ABC",
        donViGiamSat: "Công ty Giám sát DEF",
        daiDienChuDauTu: "Nguyễn Văn L",
        daiDienNhaThau: "Trần Thị M",
        daiDienThietKe: "Lê Văn N",
        daiDienGiamSat: "Phạm Thị O",
        loaiNghiemThu: "Nghiệm thu công việc",
        ketQuaNghiemThu: "Đạt",
        yeuCauSuaChua: null,
        thoiHanSuaChua: null,
        ghiChu: "Kết cấu đạt tiêu chuẩn thiết kế",
        bienBanNghiemThu: "BBNT_009.pdf",
        hoSoNghiemThu: "HSNT_009.pdf",
        taiLieuKiemTra: "TLKT_009.pdf",
        trangThaiNghiemThu: "Hoàn thành",
        nguoiChiuTrachNhiem: "Hoàng Văn P",
        ngayCapNhat: "2023-11-06"
      },
      {
        id: 10,
        projectCode: "PJ010",
        inspectionCode: "INSP010",
        inspectionName: "Nghiệm thu hệ thống PCCC",
        date: "2023-11-10",
        status: "Đang tiến hành",
        tenCongTrinh: "Nhà máy sản xuất GHI",
        diaDiem: "KCN Tân Bình, TP.HCM",
        loaiCongTrinh: "Công nghiệp",
        capCongTrinh: "Cấp III",
        moTaCongTrinh: "Nhà máy diện tích 12000 m², sản xuất linh kiện điện tử",
        chuDauTu: "Công ty Sản xuất JKL",
        nhaThauThiCong: "Công ty Xây dựng MNO",
        donViThietKe: "Công ty Thiết kế PQR",
        donViGiamSat: "Công ty Giám sát STU",
        daiDienChuDauTu: "Trần Văn Q",
        daiDienNhaThau: "Nguyễn Thị R",
        daiDienThietKe: "Phạm Văn S",
        daiDienGiamSat: "Lê Thị T",
        // Quá trình nghiệm thu
        loaiNghiemThu: "Nghiệm thu giai đoạn",
        ketQuaNghiemThu: "Đạt có điều kiện",
        yeuCauSuaChua: "Điều chỉnh vị trí các đầu phun nước",
        thoiHanSuaChua: "2023-11-15",
        ghiChu: "Cần kiểm tra lại áp suất nước",
        // Tài liệu liên quan
        bienBanNghiemThu: "BBNT_010.pdf",
        hoSoNghiemThu: "HSNT_010.pdf",
        taiLieuKiemTra: "TLKT_010.pdf",
        // Các trường bổ sung
        trangThaiNghiemThu: "Đang xử lý",
        nguoiChiuTrachNhiem: "Võ Văn U",
        ngayCapNhat: "2023-11-11"
      },
      {
        id: 11,
        projectCode: "PJ011",
        inspectionCode: "INSP011",
        inspectionName: null, // Trường hợp giá trị thiếu để kiểm tra hiển thị "-"
        date: "2023-11-12",
        status: "Chưa bắt đầu",
        // Thông tin công trình
        tenCongTrinh: "Cầu Sài Gòn 2",
        diaDiem: "Quận 2, TP.HCM",
        loaiCongTrinh: "Giao thông",
        capCongTrinh: "Cấp I",
        moTaCongTrinh: "Cầu dài 600m, rộng 15m, 6 làn xe",
        // Các bên liên quan
        chuDauTu: "Ban Quản lý Dự án VWX",
        nhaThauThiCong: "Công ty Xây dựng YZA",
        donViThietKe: "Công ty Thiết kế BCD",
        donViGiamSat: "Công ty Giám sát EFG",
        daiDienChuDauTu: "Hoàng Văn V",
        daiDienNhaThau: "Trần Thị W",
        daiDienThietKe: "Nguyễn Văn X",
        daiDienGiamSat: "Phạm Thị Y",
        // Quá trình nghiệm thu
        loaiNghiemThu: "Nghiệm thu hoàn thành",
        ketQuaNghiemThu: null,
        yeuCauSuaChua: null,
        thoiHanSuaChua: null,
        ghiChu: "Chưa tiến hành nghiệm thu do thiếu tài liệu",
        // Tài liệu liên quan
        bienBanNghiemThu: null,
        hoSoNghiemThu: null,
        taiLieuKiemTra: null,
        // Các trường bổ sung
        trangThaiNghiemThu: "Chưa bắt đầu",
        nguoiChiuTrachNhiem: "Lê Văn Z",
        ngayCapNhat: "2023-11-12"
      }
    ]);


    const handleRedirectToCreate = () => {
      router.push({ name: PAGE_NAME.INSPECTION_REPORT.CREATE });
    };

    const handleGetInspectionDetails = (id) => {
      router.push({name: PAGE_NAME.INSPECTION_REPORT.DETAILS, params: {id}});
    };

    const handleClear = () => {
      searchForms.value.search = "";
    };

    const submitForm = () => {
      searchForms.value.pageIndex = 1;
    };

    const handleDisplayModal = (id) => {
      isShowModalConfirm.value = true;
      delete_id.value = id;
    };

    const closeModalConfirm = () => {
      isShowModalConfirm.value = false;
    };

    const handleConfirm = () => {
    };

    return {
      searchForms,
      isShowModalConfirm,
      delete_id,
      TEXT_CONFIRM_DELETE,
      listInspectionReports,
      handleClear,
      submitForm,
      handleDisplayModal,
      closeModalConfirm,
      handleConfirm,
      handleRedirectToCreate,
      handleGetInspectionDetails
    };
  },
};
</script>

<style lang="scss" scoped>
.close-form {
  position: absolute;
  display: flex;
  justify-content: end;
  right: 16px;
  top: 10px;
  cursor: pointer;
  svg {
    height: 30px;
  }
}
</style>