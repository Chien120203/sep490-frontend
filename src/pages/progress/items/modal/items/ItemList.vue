<template>
  <div class="item-list">
    <SingleOptionSelect
        :isDisabled="!allowEdit"
        class="select-item"
        :defaultList="selectedValue"
        :optionKeys="{ id: optionKeys.id, value: optionKeys.value }"
        :listData="selectData"
        :isRemote="true"
        @handleSelectedParams="handleSelectItem"
        @remoteSearch="handleSearch"
    />
    <el-form
        ref="ruleFormRef"
        :model="{ listAddedValues }"
        :rules="rules"
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
              {{row.resource.name}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" :label="$t('planning.items.unit')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.unit`" :rules="rules.unit">
              <el-input :disabled="true" v-model="listAddedValues[$index].unit" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('planning.items.quantity')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.quantity`" :rules="rules.quantity">
              <el-input :disabled="true" v-model.number="listAddedValues[$index].quantity"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('progress.details.used_quantity')">
          <template #default="{ row }">
            {{getUsedQuantity(row.id)}}
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE" :label="$t('planning.items.inventory')">
          <template #default="{ row }">
            {{getInventory(row.id)}}
          </template>
        </el-table-column>

        <el-table-column prop="unitPrice" :label="$t('planning.items.price')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.unitPrice`" :rules="rules.unitPrice">
              <el-input
                  :disabled="!allowEdit"
                  v-model.number="listAddedValues[$index].unitPrice"
                  :formatter="(value) => mixinMethods.formatInputMoney(value)"
                  :parser="(value) => mixinMethods.parseInputCurrency(value)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('planning.items.total')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.total`">
              <el-input
                  v-model="listAddedValues[$index].total"
                  :disabled="true"
                  :value="mixinMethods.formatInputMoney(row.quantity * row.unitPrice)"
              />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import {computed, defineEmits, defineProps, reactive, ref, watch} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {mixinMethods} from "@/utils/variables.js";
import {MATERIAL_TYPE} from "@/constants/resource.js";
import {useI18n} from "vue-i18n";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  selectedRow: {
    type: Object,
    default: () => {
    }
  },
  isHuman: { type: Boolean, default: false },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: [String, Number], default: '' },
  rules: {
    type: Object,
    default: () => {}
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});

const {t} = useI18n();
const exceedMessages = ref({});
const listAddedValues = ref(props.tableData);
const ruleFormRef = ref(null);
const selectedValue = ref(null);
defineExpose({
  ruleFormRef,
});
const emit = defineEmits(["search", "update-value"]);
const handleSearch = (value, role) => {
  emit('search', {value: value, role: role});
}
const handleSelectItem = (id) => {
  const exists = listAddedValues.value.some(entry => entry.resourceId === id);
  const resource = props.selectData.find(item => item.id === id);
  selectedValue.value = id;
  if (!exists) {
    listAddedValues.value.push({
      resourceId: id,
      resourceType: props.resourceType,
      workCode: "",
      unit: props.resourceType === MATERIAL_TYPE ? (resource?.unit || "") : "",
      quantity: 1,
      unitPrice: 0
    });
  }
};

const getInventory = (id) => {
  const resource = props.selectData.find(item => item.id === id) || null;
  return resource.quantity || "-";
}

const getUsedQuantity = (id) => {
  return props.selectedRow.details.find(item => item.id === id)?.usedQuantity || 0;
}
</script>

<style scoped>
.item-list {
  margin-top: 20px;
}
.select-item {
  width: 30%;
}
</style>
