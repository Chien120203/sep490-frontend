<template>
  <div class="item-list">
    <SingleOptionSelect
        class="select-item"
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
      <el-table :data="listAddedValues.value" border style="width: 100%">
        <el-table-column prop="index" label="STT" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Vật liệu">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.value.${$index}.resourceId`">
              <el-input v-model="listAddedValues.value[$index].resourceId" :disabled="true"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="Đơn vị">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.value.${$index}.unit`" :rules="rules.unit">
              <el-input v-model="listAddedValues.value[$index].unit" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Số lượng">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.value.${$index}.quantity`" :rules="rules.quantity">
              <el-input :disabled="isHuman" v-model.number="listAddedValues.value[$index].quantity" @input="handleChangeData()"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unitPrice" label="Đơn giá">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.value.${$index}.unitPrice`" :rules="rules.unitPrice">
              <el-input
                  v-model.number="listAddedValues.value[$index].unitPrice"
                  @input="handleChangeData()"
                  :formatter="(value) => mixinMethods.formatInputMoney(value)"
                  :parser="(value) => mixinMethods.parseInputCurrency(value)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="Thành tiền">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listAddedValues.value.${$index}.total`">
              <el-input
                  v-model="listAddedValues.value[$index].total"
                  :disabled="true"
                  :value="mixinMethods.formatInputMoney(row.quantity * row.unitPrice)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="Actions">
          <template #default="{ row, $index }">
            <div>
              <button @click="handleRemoveResource(row.resourceId)" class="btn-edit">
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
import {debounce} from "lodash";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  isHuman: { type: Boolean, default:false },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: String, default: '' },
  rules: {
    type: Object,
    default: () => {}
  }
});

const listAddedValues = reactive({ value: JSON.parse(JSON.stringify(props.tableData)) });
const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});
const emit = defineEmits(["search", "update-list"]);
const handleSearch = (value) => {
  emit('search', value);
}
const handleSelectItem = (id) => {
  const exists = listAddedValues.value.some(entry => entry.resourceId === id);
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

const handleRemoveResource = (id) => {
  listAddedValues.value = listAddedValues.value.filter(resource => resource.resourceId !== id);
  handleChangeData();
}

const handleChangeData = debounce(() => {
  emit('update-list', listAddedValues.value);
}, 300);
</script>

<style scoped>
.item-list {
  margin-top: 20px;
}
.select-item {
  width: 30%;
}
</style>
