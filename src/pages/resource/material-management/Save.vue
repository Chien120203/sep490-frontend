<template>
  <div class="machine-block">
    <div class="machine machine-create machine-detail">
      <div class="machine-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t("resources.machine.details.title") : $t("resources.machine.create.title")
          }}
        </h3>
        <div class="machine-btn-detail">
          <div class="item">
            <el-button class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="machine-body mt-0">
        {{validation.value.value}}
        <el-form
            ref="ruleFormRef"
            :model="machineResourcesDetails.value"
            :rules="MACHINE_RULES"
            class="form-search-box"
        >
          <div class="item item-bib-add">
            <el-form-item
                prop="licensePlate"
                class="custom-textarea required"
                :label="$t('resources.machine.details.licensePlate')"
            >
              <el-input v-model="machineResourcesDetails.value.licensePlate" />
              <label class="error-feedback-machine" v-if="validation && validation.value.licensePlate">
                {{ $t(validation.value.licensePlate) }}
              </label>
            </el-form-item>

            <el-form-item prop="brand" class="custom-textarea" :label="$t('resources.machine.details.brand')">
              <el-input v-model="machineResourcesDetails.value.brand" />
              <label class="error-feedback-machine" v-if="validation && validation.value.brand">
                {{ $t(validation.value.brand) }}
              </label>
            </el-form-item>

            <el-form-item prop="yearOfManufacture" class="required" :label="$t('resources.machine.details.yearOfManufacture')">
              <el-input v-model="machineResourcesDetails.value.yearOfManufacture" />
              <label class="error-feedback-machine" v-if="validation && validation.value.yearOfManufacture">
                {{ $t(validation.value.yearOfManufacture) }}
              </label>
            </el-form-item>

            <el-form-item prop="countryOfManufacture" :label="$t('resources.machine.details.countryOfManufacture')">
              <el-input v-model="machineResourcesDetails.value.countryOfManufacture" />
              <label class="error-feedback-machine" v-if="validation && validation.value.countryOfManufacture">
                {{ $t(validation.value.countryOfManufacture) }}
              </label>
            </el-form-item>

            <el-form-item prop="vehicleType" class="custom-textarea" :label="$t('resources.machine.details.vehicleType')">
              <el-input v-model="machineResourcesDetails.value.vehicleType" />
              <label class="error-feedback-machine" v-if="validation && validation.value.vehicleType">
                {{ $t(validation.value.vehicleType) }}
              </label>
            </el-form-item>

            <el-form-item prop="chassisNumber" class="custom-textarea" :label="$t('resources.machine.details.chassisNumber')">
              <el-input v-model="machineResourcesDetails.value.chassisNumber" />
              <label class="error-feedback-machine" v-if="validation && validation.value.chassisNumber">
                {{ $t(validation.value.chassisNumber) }}
              </label>
            </el-form-item>

            <el-form-item prop="engineNumber" class="custom-textarea" :label="$t('resources.machine.details.engineNumber')">
              <el-input v-model="machineResourcesDetails.value.engineNumber" />
              <label class="error-feedback-machine" v-if="validation && validation.value.engineNumber">
                {{ $t(validation.value.engineNumber) }}
              </label>
            </el-form-item>

            <el-form-item prop="color" class="custom-textarea" :label="$t('resources.machine.details.color')">
              <el-input v-model="machineResourcesDetails.value.color" />
              <label class="error-feedback-machine" v-if="validation && validation.value.color">
                {{ $t(validation.value.color) }}
              </label>
            </el-form-item>

            <el-form-item prop="fuelType" class="custom-textarea" :label="$t('resources.machine.details.fuelType')">
              <el-input v-model="machineResourcesDetails.value.fuelType" />
              <label class="error-feedback-machine" v-if="validation && validation.value.fuelType">
                {{ $t(validation.value.fuelType) }}
              </label>
            </el-form-item>

            <el-form-item prop="fuelTankVolume" class="custom-textarea" :label="$t('resources.machine.details.fuelTankVolume')">
              <el-input v-model="machineResourcesDetails.value.fuelTankVolume" />
              <label class="error-feedback-machine" v-if="validation && validation.value.fuelTankVolume">
                {{ $t(validation.value.fuelTankVolume) }}
              </label>
            </el-form-item>

            <el-form-item prop="fuelUnit" class="custom-textarea" :label="$t('resources.machine.details.fuelUnit')">
              <el-input v-model="machineResourcesDetails.value.fuelUnit" />
              <label class="error-feedback-machine" v-if="validation && validation.value.fuelUnit">
                {{ $t(validation.value.fuelUnit) }}
              </label>
            </el-form-item>
          </div>

          <div class="item item-bib-add item-machine-add">
            <el-form-item prop="status" :label="$t('resources.machine.details.status')">
              <el-input v-model="machineResourcesDetails.value.status" class="custom-textarea" />
              <label class="error-feedback-machine" v-if="validation && validation.value.status">
                {{ $t(validation.value.status) }}
              </label>
            </el-form-item>

            <el-form-item prop="driver" :label="$t('resources.machine.details.driver')" class="input-item">
              <el-input v-model="machineResourcesDetails.value.driver" type="text" />
              <label class="error-feedback-machine" v-if="validation && validation.value.driver">
                {{ $t(validation.value.driver) }}
              </label>
            </el-form-item>

            <el-form-item prop="description" class="input-item" :label="$t('resources.machine.details.description')">
              <el-input v-model="machineResourcesDetails.value.description" class="custom-textarea" type="textarea" />
              <label class="error-feedback-machine" v-if="validation && validation.value.description">
                {{ $t(validation.value.description) }}
              </label>
            </el-form-item>

            <el-form-item prop="image" class="input-item" :label="$t('resources.machine.details.images')">
              <ImageUpload
                  :fileLimit="1"
                  :allowedTypes="'.jpg,.png,.pdf,.docx'"
                  @file-selected="handleSelectFiles"
                  @file-removed="handleRemoveFile"
              />
            </el-form-item>

            <el-form-item prop="attachments" :label="$t('resources.machine.details.attachments')">
              <FileUpload
                  :existingFiles="machineResourcesDetails.value.attachment"
                  :allowedTypes="'.jpg,.png,.pdf,.docx'"
                  :fileLimit="3"
                  class="input-wd-96"
                  @file-selected="handleFileUpload"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import FileUpload from "@/components/common/FileUpload.vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import {MACHINE_RULES} from "@/rules/machine-resource/index.js";
import {useI18n} from "vue-i18n";
import {userMachineResourcesStore} from "@/store/machine-resources.js";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  components: {FileUpload,ImageUpload, IconBackMain, SingleOptionSelect},
  setup() {
    const {t} = useI18n();
    const machineResourcesStore = userMachineResourcesStore();
    const {
      machineResourcesDetails,
      validation,
      getMachineResourcesDetails,
      saveMachineResources,
      clearMachineResourcesDetails
    } = machineResourcesStore;
    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const router = useRouter();

    onMounted(() => {
      if(isUpdate.value) {
        getMachineResourcesDetails({machineId: route.params.id})
      }
    });

    onUnmounted(() => {
      validation.value = {};
      clearMachineResourcesDetails();
    })

    const handleBack = () => {
      router.push({name: PAGE_NAME.RESOURCE.MACHINE.LIST});
    };

    const ruleFormRef = ref(null);

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
    }

    const handleSelectFiles = (listFiles) => {
      machineResourcesDetails.value.image = [listFiles[0].raw];
    }

    const handleRemoveFile = (file) => {
      machineResourcesDetails.value.image = machineResourcesDetails.value.filter((f) => f.uid !== file.uid);
    }


    return {
      ruleFormRef,
      machineResourcesDetails,
      isUpdate,
      validation,
      MACHINE_RULES,
      handleBack,
      submitForm,
      handleFileUpload,
      handleSelectFiles,
      handleRemoveFile
    };
  },
};
</script>

<style lang="scss" scoped>
/* Existing Styles */
.error-feedback-machine {
  display: block;
  color: red;
  text-align: left;
  font-size: 12px;
  margin-top: 5px;
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

/* New Styles for Design Matching */
.machine-block {
  background-color: #F5F5F5; /* Light grayish-white background */
  padding: 20px; /* Consistent padding around the form */
}

.machine-body .form-search-box {
  display: flex;
  gap: 20px; /* Space between the two columns */
}

.item {
  flex: 1; /* Each column takes equal width */
}

.el-form-item__label {
  color: #666666; /* Gray text for labels */
  font-size: 14px; /* Label font size */
}

.required .el-form-item__label::before {
  content: '*';
  color: red;
  margin-right: 4px;
}

.el-input__inner {
  background-color: #F5F5F5; /* Light gray background */
  border: 1px solid #D9D9D9; /* Light gray border */
  color: #000000; /* Black text */
  font-size: 16px; /* Input text font size */
}

.custom-textarea .el-textarea__inner {
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  color: #000000;
  font-size: 16px;
  height: 100px; /* Larger height for textarea */
  resize: vertical; /* Allow vertical resizing */
}

.machine-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-save {
  background-color: #1890FF; /* Blue background */
  color: #fff; /* White text */
  border: none;
  border-radius: 4px; /* Rounded corners */
  padding: 10px 20px; /* Comfortable padding */
}

.page__ttl {
  color: #1890FF; /* Blue text */
  font-weight: bold;
}

.btn-back {
  cursor: pointer;
  margin-right: 10px;
}

.btn-back svg {
  fill: #1890FF; /* Blue color for the icon */
}

.el-form-item {
  margin-bottom: 20px; /* Vertical spacing between fields */
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
</style>