<template>
  <div class="item-list">
    <SingleOptionSelect
        :isDisabled="!allowEdit"
        class="select-item"
        :showClearable="true"
        :role="CONSTRUCTION_EMPLOYEE"
        :defaultList="selectedValue"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="listFreeEmployees"
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

        <el-table-column prop="name" :label="$t('resource.human.details.userName')">
          <template #default="{ row }">
            <el-form-item>
              {{getUserAttr(row, 'username')}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('resource.human.details.fullName')">
          <template #default="{ row }">
            <el-form-item>
              {{getUserAttr(row, 'fullName')}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('resource.human.details.phoneNumber')">
          <template #default="{ row }">
            <el-form-item>
              {{getUserAttr(row, 'phone')}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('planning.items.action')">
          <template #default="{ row, $index }">
            <div>
              <button v-if="allowEdit" @click="handleRemoveResource(row); $event.preventDefault()" class="btn-edit">
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

const listFreeEmployees = computed(() => {
  return props.selectData.filter((item) => {
    return item.teamId === null && !props.members.includes(item.id);
  })
});

const ruleFormRef = ref(null);
const selectedValue = ref(null);

defineExpose({
  ruleFormRef,
});

const emit = defineEmits(["search", "update-value", "remove"]);

const listAddedValues = computed(() => props.members);

const handleSearch = (value) => {
  emit('search', value);
};

const handleSelectItem = (id) => {
  if (!id) return;

  const exists = props.members.some(m => m.id === id);
  if (!exists) {
    props.members.push(id);
  }

  selectedValue.value = null;
};

const getUserAttr = (row, attr) => {
  if (typeof row == 'object') {
    const user = props.selectData.find(user => user.id === row.id);
    return user ? user[attr] || "-" : "-";
  } else {
    const user = props.selectData.find(user => user.id === row);
    return user ? user[attr] || "-" : "-";
  }
}


const handleRemoveResource = (id) => {
  emit('remove', id);
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
