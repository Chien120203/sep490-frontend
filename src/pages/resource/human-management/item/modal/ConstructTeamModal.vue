<template>
  <Modal
      :show="show"
      :width="'85%'"
      :containerHeight="'70%'"
      :isShowFooter="false"
      @close="closeModal"
  >
    <template #header>
      <h4 class="modal-title">{{ $t('planning.modal_title') }}</h4>
    </template>

    <template #body>
      <div class="modal-body-container">
        <TeamInfoForm
            ref="childFormRef"
            :rules="constructTeamRule"
            :allowEdit="allowEdit"
            :teamInfo="teamInfo"
            @searchManager="handleSearch"
        />
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="$t('planning.modal.el_pane.depen_work')" name="tasks">
            <ItemList
                ref="tableHumanFormRef"
                :is-human="true"
                :allowEdit="allowEdit"
                :members="teamInfo.members"
                :selectData="employees"
                @search="handleSearch"
                :optionKeys="{id: 'id', value: 'username'}"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="modal-footer">
        <el-button v-if="allowEdit" class="btn btn-save" @click="handleSubmit">{{ $t('common.save') }}</el-button>
        <el-button class="btn btn-refuse" @click="$emit('close')">{{ $t('common.cancel') }}</el-button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import {ref, defineProps, defineEmits, computed, reactive, watch, toRaw} from "vue";
import Modal from "@/components/common/Modal.vue";
import TeamInfoForm from "@/pages/resource/human-management/item/modal/TeamInfoForm.vue";
import ItemList from "@/pages/planning/item/modal/items/ItemList.vue";
import DependencyTaskTable from "@/pages/planning/item/modal/items/DependencyTaskTable.vue";
import {
  HUMAN_RESOURCE,
  HUMAN_TYPE,
  MACHINE_RESOURCE,
  MACHINE_TYPE,
  MATERIAL_RESOURCE,
  MATERIAL_TYPE
} from "@/constants/resource.js";
import {mixinMethods} from "@/utils/variables.js";
import {useI18n} from "vue-i18n";
import {getConstructionTeamRule} from "@/rules/construct-team/index.js";
import {CONSTRUCTION_MANAGER} from "@/constants/roles.js";

const props = defineProps({
  teamInfo: {type: Object, default: () => ({})},
  show: {type: Boolean, default: false},
  allowEdit: {type: Boolean, default: false},
  managers: {type: Array, default: () => []},
  employees: {type: Array, default: () => []},
});

const emit = defineEmits(["close", "submit", "search"]);
const {t} = useI18n();
const activeTab = ref("member");
const childFormRef = ref(null);
const constructTeamRule = getConstructionTeamRule();

const closeModal = () => {
  activeTab.value = "tasks"
  emit("close");
};

const handleSearch = (data) => {
  emit("search", data)
}

const handleSubmit = async () => {
  const isValid = await new Promise((resolve) => {
    childFormRef.value?.ruleFormRef.validate((valid) => resolve(valid));
  });

  if (!isValid) {
    mixinMethods.notifyError(
        t("response.message.save_human_failed")
    );
    return;
  }

  emit("submit", props.teamInfo);
  emit("close");
  activeTab.value = "tasks"
};

</script>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-title {
  margin: 0;
}

.modal-body-container {
  min-height: 550px;
}
</style>
