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
    <el-table :data="listAddedValues.value" border style="width: 100%">
      <el-table-column prop="index" label="STT" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="Vật liệu">
        <template #default="scope">
          {{getResourceName(scope.row.resourceId)}}
        </template>
      </el-table-column>

      <el-table-column prop="unit" label="Đơn vị">
        <template #default="scope">
          <el-input @input="handleChangeData(scope.row.unit)"  v-model="scope.row.unit"/>
        </template>
      </el-table-column>

      <el-table-column prop="quantity" label="Số lượng">
        <template #default="scope">
          <el-input @input="handleChangeData(scope.row.quantity)"  v-model.number="scope.row.quantity"/>
        </template>
      </el-table-column>

      <el-table-column prop="unitPrice" label="Đơn giá">
        <template #default="scope">
          <el-input @input="handleChangeData(scope.row.unitPrice)" :formatter="(value) => mixinMethods.formatInputMoney(value)"
                    :parser="(value) => mixinMethods.parseInputCurrency(value)"  v-model.number="scope.row.unitPrice"/>
        </template>
      </el-table-column>

      <el-table-column label="Thành tiền">
        <template #default="scope">
          {{ mixinMethods.formatInputMoney(scope.row.quantity * scope.row.unitPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions">
        <template #default="{ row }">
          <div>
            <button @click="handleRemoveResource(row.resourceId)" class="btn-edit">
              <IconTrash />
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, reactive, watch} from "vue";
import SingleOptionSelect from "@/components/common/SingleOptionSelect.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {debounce} from "lodash";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  selectData: { type: Array, default: () => [] },
  tableData: { type: Array, default: () => [] },
  optionKeys: { type: Object, default: () => ({ id: '', value: '' }) },
  resourceType: { type: String, default: '' },
});

const listAddedValues = reactive({ value: JSON.parse(JSON.stringify(props.tableData)) });

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

const getResourceName = (resourceId) => {
  return props.selectData.find(item => item?.[props.optionKeys.id] === resourceId)?.[props.optionKeys.value]
}

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
