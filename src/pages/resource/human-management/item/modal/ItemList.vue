<template>
  <div class="item-list">
    <SingleOptionSelect
        :isDisabled="!allowEdit"
        class="select-item"
        :showClearable="true"
        :role="CONSTRUCTION_EMPLOYEE"
        :defaultList="selectedValue"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="selectData"
        :isRemote="true"
        @handleSelectedParams="handleSelectItem"
        @remoteSearch="handleSearch"
    />
    <el-form
        ref="ruleFormRef"
        :model="members"
        class="form-search-box"
    >
      <el-table :data="listAddedValues" border style="width: 100%">
        <el-table-column prop="index" :label="$t('common.no')" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('planning.items.name')">
          <template #default="{ row }">
            <el-form-item>
              {{row.username}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('planning.items.name')">
          <template #default="{ row }">
            <el-form-item>
              {{row.fullName}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('planning.items.name')">
          <template #default="{ row }">
            <el-form-item>
              {{$t(getUserRole(row.role))}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('planning.items.action')">
          <template #default="{ row, $index }">
            <div>
              <button v-if="allowEdit" @click="handleRemoveResource(row.resourceId); $event.preventDefault()" class="btn-edit">
                <IconTrash />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import { mixinMethods } from "@/utils/variables.js";
import { MATERIAL_TYPE } from "@/constants/resource.js";
import { useI18n } from "vue-i18n";
import {CONSTRUCTION_EMPLOYEE, CONSTRUCTION_MANAGER, ROLE_LABELS} from "@/constants/roles.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  members: { type: Array, default: () => [] },
  isHuman: { type: Boolean, default: false },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  allowEdit: {
    type: Boolean,
    default: false
  }
});

const ruleFormRef = ref(null);
const selectedValue = ref(null);

defineExpose({
  ruleFormRef,
});

const emit = defineEmits(["search", "update-value"]);

const listAddedValues = computed(() => props.members);

const handleSearch = (value) => {
  emit('search', value);
};

const handleSelectItem = (selected) => {
  if (!selected) return;

  const exists = props.members.some(m => m.resourceId === selected.id);
  if (!exists) {
    const newMember = {
      resourceId: selected.id,
      username: selected.username || selected.value || '',
      fullName: selected.fullName || selected.label || '',
      role: selected.role || '', // Ensure role exists in selected object
    };
    props.members.push(newMember);
  }

  selectedValue.value = null;
};

const getUserRole = (role) => {
  return ROLE_LABELS[role] || role;
};

const handleRemoveResource = (id) => {
  const index = props.members.findIndex(m => m.resourceId === id);
  if (index !== -1) {
    props.members.splice(index, 1);
  }
};
</script>

<style scoped>
.item-list {
  margin-top: 20px;
}
.select-item {
  width: 30%;
}
</style>
