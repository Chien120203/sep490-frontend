<template>
  <div class="item-list">
    <SingleOptionSelect
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
              {{getResourceName(row.resourceId)}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" :label="$t('planning.items.unit')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.unit`" :rules="rules.unit">
              <el-input v-model="listAddedValues[$index].unit" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('planning.items.quantity')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.quantity`" :rules="rules.quantity">
              <el-input :disabled="isHuman" v-model.number="listAddedValues[$index].quantity" @change="handleChangeValue"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unitPrice" :label="$t('planning.items.price')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.${$index}.unitPrice`" :rules="rules.unitPrice">
              <el-input
                  v-model.number="listAddedValues[$index].unitPrice"
                  :formatter="(value) => mixinMethods.formatInputMoney(value)"
                  :parser="(value) => mixinMethods.parseInputCurrency(value)"
                  @change="handleChangeValue"
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

        <el-table-column :label="$t('planning.items.action')">
          <template #default="{ row, $index }">
            <div>
              <button @click="handleRemoveResource(row.resourceId); $event.preventDefault()" class="btn-edit">
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
import {defineEmits, defineProps, reactive, ref, watch} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  selectedRow: {
    type: Object,
    default: () => {
    }
  },
  isHuman: { type: Boolean, default:false },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: String, default: '' },
  rules: {
    type: Object,
    default: () => {}
  }
});

const listAddedValues = ref(props.tableData);
const ruleFormRef = ref(null);
const selectedValue = ref(null);
defineExpose({
  ruleFormRef,
});
const emit = defineEmits(["search", "update-value"]);
const handleSearch = (value) => {
  emit('search', value);
}
const handleSelectItem = (id) => {
  const exists = listAddedValues.value.some(entry => entry.resourceId === id);
  selectedValue.value = id;
  if (!exists) {
    listAddedValues.value.push({
      resourceId: id,
      resourceType: props.resourceType,
      unit: "",
      quantity: 1,
      unitPrice: 0
    });
  }
};

const getResourceName = (id) => {
  return props.selectData.find(item => item.id === id)[props.optionKeys.value] || "-";
}

const handleChangeValue = () => {
  emit("update-value");
}

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
