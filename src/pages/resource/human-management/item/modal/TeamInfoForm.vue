<template>
  <div class="price-input-form">
    <el-form label-width="30%" :model="teamInfo" ref="ruleFormRef" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('planning.modal.work_name')">
            <el-input :disabled="!allowEdit" v-model="teamInfo.teamName" class="custom-input" />
          </el-form-item>

          <el-form-item prop="startDate" :label="$t('planning.modal.start_date')">
            <SingleOptionSelect
                v-model="teamInfo.teamManager"
                :isDisabled="!allowEdit"
                :optionKeys="{ id: 'id', value: 'username' }"
                :listData="lisTeamManagers"
                :role="CONSTRUCTION_MANAGER"
                :isRemote="true"
                class="input-wd-96"
                @remoteSearch="handleSearchManager"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">

          <el-form-item :label="$t('planning.team.description')">
            <el-input
                type="textarea"
                v-model="teamInfo.description"
                :disabled="!allowEdit"
                class="custom-input"
                placeholder="Enter description"
                rows="4"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { mixinMethods } from "@/utils/variables.js";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import {CONSTRUCTION_MANAGER} from "@/constants/roles.js";

const props = defineProps({
  teamInfo: { type: Object, default: () => ({}) },
  rules: {
    type: Object,
    default: () => ({})
  },
  allowEdit: {type: Boolean, default: false},
  lisTeamManagers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["handleSearchManager"]);

const handleSearchManager = (searchValue, role) => {
  emit("searchManager", {value: searchValue, role: role});
}
const ruleFormRef = ref(null);

defineExpose({
  ruleFormRef,
});
</script>

<style scoped>
.price-input-form {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
}

.custom-input {
  width: 80%;
}

:deep(.el-form-item__label) {
  width: 20% !important;
}
</style>
