<template>
  <div class="machine-block">
    <div class="machine machine-create machine-detail">
      <div class="machine-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t("resource.machine.details.title") : $t("resource.machine.create.title")
          }}
        </h3>
        <div class="machine-btn-detail">
          <div class="item">
            <el-button v-if="allowEdit" class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="machine-body mt-0">
        {{validation.value.value}}
        <el-form
            :disabled="!allowEdit"
            ref="ruleFormRef"
            :model="machineResourcesDetails.value"
            :rules="MACHINE_RULES"
            class="form-search-box"
        >
          <div class="item item-bib-add">
            <el-form-item
                prop="vehicleName"
                class="custom-textarea required"
                :label="$t('resource.machine.details.vehicleName')"
            >
              <el-input v-model="machineResourcesDetails.value.vehicleName" />
              <label class="error-feedback-machine" v-if="validation && validation.value.vehicleName">
                {{ $t(validation.value.vehicleName) }}
              </label>
            </el-form-item>

            <el-form-item
                prop="licensePlate"
                class="custom-textarea required"
                :label="$t('resource.machine.details.licensePlate')"
            >
              <el-input v-model="machineResourcesDetails.value.licensePlate" />
              <label class="error-feedback-machine" v-if="validation && validation.value.licensePlate">
                {{ $t(validation.value.licensePlate) }}
              </label>
            </el-form-item>

            <el-form-item prop="brand" class="custom-textarea required" :label="$t('resource.machine.details.brand')">
              <el-input v-model="machineResourcesDetails.value.brand" />
              <label class="error-feedback-machine" v-if="validation && validation.value.brand">
                {{ $t(validation.value.brand) }}
              </label>
            </el-form-item>

            <el-form-item prop="yearOfManufacture" class="required" :label="$t('resource.machine.details.yearOfManufacture')">
              <el-date-picker
                  style="width: 100%"
                  v-model="machineResourcesDetails.value.yearOfManufacture"
                  type="year"
                  format="YYYY"
                  value-format="YYYY"
                  :placeholder="$t('resource.machine.details.selectYear')"
                  class="year-picker"
              />
              <label class="error-feedback-machine" v-if="validation && validation.value.yearOfManufacture">
                {{ $t(validation.value.yearOfManufacture) }}
              </label>
            </el-form-item>

            <el-form-item prop="countryOfManufacture required" :label="$t('resource.machine.details.countryOfManufacture')">
              <el-input v-model="machineResourcesDetails.value.countryOfManufacture" />
              <label class="error-feedback-machine" v-if="validation && validation.value.countryOfManufacture">
                {{ $t(validation.value.countryOfManufacture) }}
              </label>
            </el-form-item>

            <el-form-item prop="vehicleType" class="custom-textarea required" :label="$t('resource.machine.details.vehicleType')">
              <el-input v-model="machineResourcesDetails.value.vehicleType" />
              <label class="error-feedback-machine" v-if="validation && validation.value.vehicleType">
                {{ $t(validation.value.vehicleType) }}
              </label>
            </el-form-item>

            <el-form-item prop="chassisNumber" class="custom-textarea required" :label="$t('resource.machine.details.chassisNumber')">
              <el-input v-model="machineResourcesDetails.value.chassisNumber" />
              <label class="error-feedback-machine" v-if="validation && validation.value.chassisNumber">
                {{ $t(validation.value.chassisNumber) }}
              </label>
            </el-form-item>

            <el-form-item prop="engineNumber" class="custom-textarea required" :label="$t('resource.machine.details.engineNumber')">
              <el-input v-model="machineResourcesDetails.value.engineNumber" />
              <label class="error-feedback-machine" v-if="validation && validation.value.engineNumber">
                {{ $t(validation.value.engineNumber) }}
              </label>
            </el-form-item>

            <el-form-item prop="color" class="custom-textarea required" :label="$t('resource.machine.details.color')">
              <el-input v-model="machineResourcesDetails.value.color" />
              <label class="error-feedback-machine" v-if="validation && validation.value.color">
                {{ $t(validation.value.color) }}
              </label>
            </el-form-item>
          </div>

          <div class="item item-bib-add item-machine-add">
            <el-form-item prop="fuelType" class="custom-textarea required" :label="$t('resource.machine.details.fuelType')">
              <el-input v-model="machineResourcesDetails.value.fuelType" />
              <label class="error-feedback-machine" v-if="validation && validation.value.fuelType">
                {{ $t(validation.value.fuelType) }}
              </label>
            </el-form-item>

            <el-form-item prop="fuelTankVolume" class="custom-textarea required" :label="$t('resource.machine.details.fuelTankVolume')">
              <el-input v-model="machineResourcesDetails.value.fuelTankVolume" />
              <label class="error-feedback-machine" v-if="validation && validation.value.fuelTankVolume">
                {{ $t(validation.value.fuelTankVolume) }}
              </label>
            </el-form-item>

            <el-form-item prop="fuelUnit" class="custom-textarea required" :label="$t('resource.machine.details.fuelUnit')">
              <el-select v-model="machineResourcesDetails.value.fuelUnit" class="custom-textarea required">
                <el-option
                    v-for="unit in fuelUnitOptions"
                    :key="unit.value"
                    :label="$t(unit.label)"
                    :value="unit.value"
                />
              </el-select>
              <label class="error-feedback-machine" v-if="validation && validation.value.fuelUnit">
                {{ $t(validation.value.fuelUnit) }}
              </label>
            </el-form-item>

            <el-form-item prop="status" :label="$t('resource.machine.details.status')" class="required">
              <el-select v-model="machineResourcesDetails.value.status" class="custom-textarea required">
                <el-option
                    v-for="status in statusOptions"
                    :key="status.value"
                    :label="$t(status.label)"
                    :value="status.value"
                />
              </el-select>
              <label class="error-feedback-machine" v-if="validation && validation.value.status">
                {{ $t(validation.value.status) }}
              </label>
            </el-form-item>

            <el-form-item prop="driver" :label="$t('resource.machine.details.driver')" class="input-item required">
              <el-select v-model="machineResourcesDetails.value.driver">
                <el-option
                    v-for="user in constructionEmployees"
                    :key="user.id"
                    :label="user.username"
                    :value="user.id"
                />
              </el-select>
              <label class="error-feedback-machine" v-if="validation && validation.value.driver">
                {{ $t(validation.value.driver) }}
              </label>
            </el-form-item>

            <el-form-item prop="description" class="input-item" :label="$t('resource.machine.details.description')">
              <el-input v-model="machineResourcesDetails.value.description" class="custom-textarea" type="textarea" />
              <label class="error-feedback-machine" v-if="validation && validation.value.description">
                {{ $t(validation.value.description) }}
              </label>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import FileUpload from "@/components/common/FileUpload.vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import { getMachineRules } from "@/rules/machine-resource/index.js";
import { useI18n } from "vue-i18n";
import { useMachineResourcesStore } from "@/store/machine-resources.js";
import PAGE_NAME from "@/constants/route-name.js";
import { useUserStore } from "@/store/user.js";
import {ADMIN, CONSTRUCTION_EMPLOYEE} from "@/constants/roles.js";
import {AVAILABLE, MAINTAIN, UNAVAILABLE} from "@/constants/machine.js";

export default {
  components: { FileUpload, ImageUpload, IconBackMain, SingleOptionSelect },
  setup() {
    const { t } = useI18n();
    const ruleFormRef = ref(null);
    const MACHINE_RULES = getMachineRules();
    const machineResourcesStore = useMachineResourcesStore();
    const userStore = useUserStore();
    const {
      machineResourcesDetails,
      validation,
      getMachineResourcesDetails,
      saveMachineResources,
      clearMachineResourcesDetails
    } = machineResourcesStore;
    const {
      listUsers,
      getListUsers
    } = userStore;
    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const allowEdit = computed(() => localStorage.getItem('role') === ADMIN);
    const router = useRouter();

    const constructionEmployees = computed(() => listUsers.value.filter(user => user.role === CONSTRUCTION_EMPLOYEE));

    // Define status options for the select dropdown
    const statusOptions = [
      { value: AVAILABLE, label: "resource.machine.statuses.active" },
      { value: UNAVAILABLE, label: "resource.machine.statuses.inactive" },
      { value: MAINTAIN, label: "resource.machine.statuses.maintain" },
    ];

    // Define fuel unit options for the select dropdown
    const fuelUnitOptions = [
      { value: "liters", label: "resource.machine.fuelUnit.liters" },
      { value: "gallons", label: "resource.machine.fuelUnit.gallons" },
      { value: "cubic_meters", label: "resource.machine.fuelUnit.cubic_meters" }
    ];

    onMounted(() => {
      getListUsers({
        keyWord: "",
        pageIndex: 1,
        pageSize: 100
      });
      if (isUpdate.value) {
        getMachineResourcesDetails(route.params.id);
      }
    });

    onUnmounted(() => {
      validation.value = {};
      clearMachineResourcesDetails();
    });

    const handleBack = () => {
      router.push({ name: PAGE_NAME.RESOURCE.MACHINE.LIST });
    };

    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          let method = isUpdate.value ? "update" : "create";
          saveMachineResources(machineResourcesDetails.value, method);
        }
      });
    };

    const handleFileUpload = (files) => {
      machineResourcesDetails.value.attachment = files;
    };
    return {
      ruleFormRef,
      machineResourcesDetails,
      isUpdate,
      validation,
      allowEdit,
      MACHINE_RULES,
      handleBack,
      submitForm,
      handleFileUpload,
      statusOptions,
      fuelUnitOptions,
      constructionEmployees
    };
  },
};
</script>

<style lang="scss" scoped>
.error-feedback-machine {
  display: block;
  color: red;
  text-align: left;
  font-size: 12px;
  margin: 5px;
}

.btn-cancel {
  border: 1px solid #3b5a9a !important;
  background: #e8eafb !important;
  color: #3b5a9a !important;
  border-radius: 4px;
}

.mt-0 {
  margin-top: 0 !important;
}

.item__title {
  line-height: 1.88;
}

.machine-btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;

  .btn {
    border: 1px solid #3b5a9a;
    background: #e8eafb;
    color: #3b5a9a;
    line-height: 4px;
    width: 124px;
    height: 37px;

    &-save {
      background: #5a6acf;
      border: 1px solid #3c4ec0;
      color: #fff;
    }
  }

  .item {
    display: flex;
  }
}

.machine-preview {
  resize: horizontal;
  overflow: auto;
  direction: rtl;
  padding: 20px;
  min-width: 35%;
  max-width: 50%;
}

.year-picker {
  width: 100%;
}
</style>

<style>
.item-machine-add {
  padding: 0 8px;
}

.machine-body .form-search-box .el-select,
.machine-body .form-search-box .el-form-item__content {
  justify-content: space-between;
  font-size: 16px;
  line-height: 21px;
}

.machine-body .form-search-box .year-picker .el-input__inner {
  width: 100%;
}
</style>