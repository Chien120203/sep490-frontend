<template>
  <div class="item-list">
    <SingleOptionSelect
        :isDisabled="!allowEdit"
        class="select-item"
        :defaultList="selectedValue"
        :role="resourceType"
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
              {{getResourceName(row.resourceId)}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" :label="$t('planning.items.unit')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.unit`" :rules="rules.unit">
              <el-input :disabled="resourceType === MATERIAL_TYPE" v-model="listAddedValues[$index].unit" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('planning.items.quantity')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.quantity`" :rules="rules.quantity">
              <el-input v-model.number="listAddedValues[$index].quantity" @change="handleChangeValue(listAddedValues[$index].quantity, row.resourceId)"/>
            </el-form-item>
            <p style="margin-bottom: 18px" v-if="resourceType === MATERIAL_TYPE && exceedMessages[row.resourceId]" class="error-feedback">
              {{ exceedMessages[row.resourceId] }}
            </p>
          </template>
        </el-table-column>

        <el-table-column v-if="resourceType === MATERIAL_TYPE" :label="$t('planning.items.inventory')">
          <template #default="{ row }">
            {{getInventory(row.resourceId)}}
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
                  @change="handleChangeValue(listAddedValues[$index].quantity, row.resourceId)"
              >
                <template #append>
                  {{ CURRENCY }}
                </template>
              </el-input>
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
              >
                <template #append>
                  {{ CURRENCY }}
                </template>
              </el-input>
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
import {computed, defineEmits, defineProps, reactive, ref, watch} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {mixinMethods} from "@/utils/variables.js";
import {MATERIAL_TYPE} from "@/constants/resource.js";
import {useI18n} from "vue-i18n";
import {CURRENCY} from "@/constants/application.js";

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
const allowEditQuantity = computed(() => {
 if(props.isHuman) return false;
 return props.allowEdit;
})
defineExpose({
  ruleFormRef,
});
const emit = defineEmits(["search", "update-value", "disable-submit"]);
const handleSearch = (value, role) => {
  emit('search', {value: value, type: role});
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

const getResourceName = (id) => {
  const resource = props.selectData.find(item => item.id === id) || null;
  return resource ? resource[props.optionKeys.value] : "-";
}

const getInventory = (id) => {
  const resource = props.selectData.find(item => item.id === id) || null;
  return resource.inventory || "-";
}

const handleChangeValue = (quantity, resourceId) => {
  if (props.resourceType === MATERIAL_TYPE) {
    let inventory = props.selectData.find(item => item.id === resourceId)?.inventory ?? 0;
    if (inventory < quantity) {
      exceedMessages.value[resourceId] = t('E-PLAN-002');
      emit("disable-submit", true);
    } else {
      exceedMessages.value[resourceId] = '';
      emit("disable-submit", false);
    }
  }
  emit("update-value");
};

const handleRemoveResource = async (id) => {
  // Remove from the form list
  listAddedValues.value = listAddedValues.value.filter(resource => resource.resourceId !== id);
  selectedValue.value = null;
  // Also remove from selectedRow.details if it exists
  if (props.selectedRow && Array.isArray(props.selectedRow.details)) {
    props.selectedRow.details = props.selectedRow.details.filter(detail => detail.resourceId !== id);
  }
  emit("update-value");
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
