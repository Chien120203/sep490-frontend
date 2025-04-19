<template>
  <div class="material-block">
    <div class="material material-create material-detail">
      <div class="material-header">
        <h3 class="page__ttl">
          <span class="btn-back" @click="handleBack"><IconBackMain/></span>
          {{
            isUpdate ? $t("resource.material.details.title") : $t("resource.material.create.title")
          }}
        </h3>
        <div class="material-btn-detail">
          <div class="item">
            <el-button class="btn btn-save" @click="submitForm()">
              {{ $t("common.save") }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="material-body mt-0">
        {{validation.value.value}}
        <el-form
            ref="ruleFormRef"
            :model="materialResourcesDetails.value"
            :rules="MATERIAL_RULES"
            class="form-search-box"
        >
          <div class="item item-bib-add">
            <el-form-item
                prop="materialCode"
                class="custom-textarea required"
                :label="$t('resource.material.details.materialCode')"
            >
              <el-input v-model="materialResourcesDetails.value.materialCode" />
              <label class="error-feedback-material" v-if="validation && validation.value.materialCode">
                {{ $t(validation.value.materialCode) }}
              </label>
            </el-form-item>

            <el-form-item prop="materialName" class="custom-textarea" :label="$t('resource.material.details.materialName')">
              <el-input v-model="materialResourcesDetails.value.materialName" />
              <label class="error-feedback-material" v-if="validation && validation.value.materialName">
                {{ $t(validation.value.materialName) }}
              </label>
            </el-form-item>

            <el-form-item prop="unit" class="required" :label="$t('resource.material.details.unit')">
              <el-input v-model="materialResourcesDetails.value.unit" />
              <label class="error-feedback-material" v-if="validation && validation.value.unit">
                {{ $t(validation.value.unit) }}
              </label>
            </el-form-item>

            <el-form-item prop="branch" :label="$t('resource.material.details.branch')">
              <el-input v-model="materialResourcesDetails.value.branch" />
              <label class="error-feedback-material" v-if="validation && validation.value.branch">
                {{ $t(validation.value.branch) }}
              </label>
            </el-form-item>

            <el-form-item prop="madeIn" class="custom-textarea" :label="$t('resource.material.details.madeIn')">
              <el-input v-model="materialResourcesDetails.value.madeIn" />
              <label class="error-feedback-material" v-if="validation && validation.value.madeIn">
                {{ $t(validation.value.madeIn) }}
              </label>
            </el-form-item>

            <el-form-item prop="chassisNumber" class="custom-textarea" :label="$t('resource.material.details.chassisNumber')">
              <el-input v-model="materialResourcesDetails.value.chassisNumber" />
              <label class="error-feedback-material" v-if="validation && validation.value.chassisNumber">
                {{ $t(validation.value.chassisNumber) }}
              </label>
            </el-form-item>


          </div>

          <div class="item item-bib-add item-material-add">
            <el-form-item prop="wholesalePrice" class="custom-textarea" :label="$t('resource.material.details.wholesalePrice')">
              <el-input v-model="materialResourcesDetails.value.wholesalePrice" />
              <label class="error-feedback-material" v-if="validation && validation.value.wholesalePrice">
                {{ $t(validation.value.wholesalePrice) }}
              </label>
            </el-form-item>

            <el-form-item prop="retailPrice" class="custom-textarea" :label="$t('resource.material.details.retailPrice')">
              <el-input v-model="materialResourcesDetails.value.retailPrice" />
              <label class="error-feedback-material" v-if="validation && validation.value.retailPrice">
                {{ $t(validation.value.retailPrice) }}
              </label>
            </el-form-item>

            <el-form-item prop="inventory" class="custom-textarea" :label="$t('resource.material.details.inventory')">
              <el-input v-model="materialResourcesDetails.value.inventory" />
              <label class="error-feedback-material" v-if="validation && validation.value.inventory">
                {{ $t(validation.value.inventory) }}
              </label>
            </el-form-item>

            <el-form-item prop="expireDate" class="custom-textarea" :label="$t('resource.material.details.expireDate')">
              <el-date-picker
                  style="width: 90%"
                  :format="DATE_FORMAT"
                  :value-format="DATE_FORMAT"
                  v-model="materialResourcesDetails.value.expireDate"
              />
              <label class="error-feedback-material" v-if="validation && validation.value.expireDate">
                {{ $t(validation.value.expireDate) }}
              </label>
            </el-form-item>

            <el-form-item prop="productionDate" class="custom-textarea" :label="$t('resource.material.details.productionDate')">
              <el-date-picker
                  style="width: 90%"
                  :format="DATE_FORMAT"
                  :value-format="DATE_FORMAT"
                  v-model="materialResourcesDetails.value.productionDate"
              />
              <label class="error-feedback-material" v-if="validation && validation.value.productionDate">
                {{ $t(validation.value.productionDate) }}
              </label>
            </el-form-item>

            <el-form-item prop="description" class="input-item" :label="$t('resource.material.details.description')">
              <el-input v-model="materialResourcesDetails.value.description" class="custom-textarea" type="textarea" />
              <label class="error-feedback-material" v-if="validation && validation.value.description">
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
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import IconBackMain from "@/svg/IconBackMain.vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import FileUpload from "@/components/common/FileUpload.vue";
import ImageUpload from "@/components/common/ImageUpload.vue";
import {getMaterialRules} from "@/rules/material-resource/index.js";
import {useI18n} from "vue-i18n";
import {useMaterialResourcesStore} from "@/store/material-resources.js";
import {DATE_FORMAT, GENDERS} from "@/constants/application.js";
import PAGE_NAME from "@/constants/route-name.js";

export default {
  components: {FileUpload,ImageUpload, IconBackMain, SingleOptionSelect},
  setup() {
    const {t} = useI18n();
    const materialResourcesStore = useMaterialResourcesStore();
    const {
      materialResourcesDetails,
      validation,
      getMaterialResourcesDetails,
      saveMaterialResources,
      clearMaterialResourcesDetails
    } = materialResourcesStore;
    const route = useRoute();
    const isUpdate = computed(() => !!route.params.id);
    const router = useRouter();

    onMounted(() => {
      if(isUpdate.value) {
        getMaterialResourcesDetails(route.params.id);
      }
    });

    onUnmounted(() => {
      validation.value = {};
      clearMaterialResourcesDetails();
    })

    const handleBack = () => {
      router.push({name: PAGE_NAME.RESOURCE.MATERIAL.LIST});
    };

    const ruleFormRef = ref(null);

    const MATERIAL_RULES = getMaterialRules();

    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          let method = isUpdate.value ? "update" : "create";
          saveMaterialResources(materialResourcesDetails.value, method);
        }
      });
    };

    const handleFileUpload = (files) => {
      materialResourcesDetails.value.attachment = files;
    }

    const handleSelectFiles = (listFiles) => {
      materialResourcesDetails.value.image = [listFiles[0].raw];
    }

    const handleRemoveFile = (file) => {
      materialResourcesDetails.value.image = materialResourcesDetails.value.filter((f) => f.uid !== file.uid);
    }


    return {
      ruleFormRef,
      materialResourcesDetails,
      isUpdate,
      validation,
      MATERIAL_RULES,
      DATE_FORMAT,
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
.error-feedback-material {
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

.material-btn-detail {
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

.material-preview {
  resize: horizontal;
  overflow: auto;
  direction: rtl;
  padding: 20px;
  min-width: 35%;
  max-width: 50%;
}

</style>

<style>
.item-material-add {
  padding: 0 8px;
}

.material-body .form-search-box .el-select,
.material-body .form-search-box .el-form-item__content {
  justify-content: space-between;
  font-size: 16px;
  line-height: 21px;
}
</style>