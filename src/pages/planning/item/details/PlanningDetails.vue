<script setup>
import {defineProps, defineEmits, computed, ref, watch, onMounted} from "vue";
import IconPlus from "@/svg/IconPlus.vue";
import IconTrash from "@/svg/IconTrash.vue";
import IconEdit from "@/svg/IconEdit.vue";
import {mixinMethods} from "@/utils/variables.js";
import {DATE_FORMAT} from "@/constants/application.js";

const props = defineProps({
  items: Array,
  listUsers: {
    type: Array,
    default: () => [
      {
        id: 1,
        value: "Select 1"
      },
      {
        id: 2,
        value: "Select 2"
      }
    ],
  },
  isUpdate: {
    type: Boolean,
    default: true
  },
  rules: {
    type: Object,
    default: () => {
    }
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
});
const ruleFormRef = ref(null);
defineExpose({
  ruleFormRef,
});

const listItems = ref([...props.items]);

watch(() => props.items, (newItems) => {
  listItems.value = [...newItems];
  sortItems(); // Sort items whenever props.items change
}, {deep: true});

const emit = defineEmits(["update:items"]);

// Function to create a new item or sub-item
const createNewItem = (unit = "", parentIndex = null) => ({
  index: "",
  parentIndex: parentIndex,
  workName: "",
  workCode: "",
  unit: unit,
  quantity: 0,
  unitPrice: 0,
  startDate: "",
  endDate: "",
  totalPrice: 0,
  deleted: false
});

// Add a new main item
const addItem = () => {
  const newItem = createNewItem();
  listItems.value.push(newItem);
  updateItems();
  sortItems(); // Sort items after adding a new item
};

// Add a new sub-item
const addSubItem = (parentItem) => {
  const newSubItem = createNewItem(parentItem.unit, parentItem.index);
  parentItem.quantity = 0;
  parentItem.unitPrice = 0;
  if (!hasChildren(parentItem)) parentItem.totalPrice = 0;
  listItems.value.push(newSubItem);
  updateItems();
  sortItems(); // Sort items after adding a sub-item
};

const hasChildren = (parent) => listItems.value.some(child => child.parentIndex === parent.index && !child.deleted);
const isParent = (item) => {
 if(!props.allowEdit) return true;
 else return hasChildren(item);
};

// Function to delete an item
const deleteItem = (itemToDelete) => {
  if (props.isUpdate) {
    itemToDelete.deleted = true; // Mark as deleted
  } else {
    listItems.value = listItems.value.filter(
        (item) => item.index !== itemToDelete.index && item.parentIndex !== itemToDelete.index
    );
  }

  recalculateTotal();
  updateItems();
  sortItems(); // Sort items after deletion
};

// Recalculate totalPrice amount
const recalculateTotal = () => {
  // Calculate totalPrice for leaf nodes (ignoring deleted items)
  listItems.value.forEach((item) => {
    if (!isParent(item) && !item.deleted) {
      item.totalPrice = item.quantity * item.unitPrice;
    }
  });

  // Recursive function to update parent totals
  const updateParentTotal = (parentIndex) => {
    let parent = listItems.value.find((item) => item.index === parentIndex && !item.deleted);
    if (parent) {
      parent.totalPrice = listItems.value
          .filter((child) => child.parentIndex === parent.index && !child.deleted)
          .reduce((sum, child) => sum + child.totalPrice, 0);

      if (parent.parentIndex !== null) {
        updateParentTotal(parent.parentIndex);
      }
    }
  };

  // Find all parents and update their totals
  listItems.value
      .filter((item) => isParent(item) && !item.deleted)
      .forEach((parent) => updateParentTotal(parent.index));

  updateItems();
  sortItems(); // Sort items after recalculating totals
};

// Update item list with numbering
const updateItems = () => {
  let result = [];
  let indexMap = new Map();

  const generateIndex = (items, parentIndex = null, prefix = "") => {
    let index = 1;

    items
        .filter((item) => item.parentIndex === parentIndex && (!item.deleted || !props.isUpdate))
        .forEach((item) => {
          if (!item.deleted) {
            let currentIndex = prefix ? `${prefix}.${index}` : `${index}`;
            item.index = currentIndex;
            indexMap.set(item, currentIndex);
            result.push(item);
            generateIndex(items, item.index, currentIndex);
            index++;
          }
        });
  };

  if (props.isUpdate) {
    generateIndex(listItems.value);
    result = [...listItems.value]; // Keep deleted items
  } else {
    listItems.value = listItems.value.filter(item => !item.deleted);
    generateIndex(listItems.value);
  }

  emit("update:items", result);
  sortItems(); // Sort items after updating
};

// Sort the listItems by index
const sortItems = () => {
  listItems.value.sort((a, b) => {
    const indexA = a.index.split('.').map(Number);
    const indexB = b.index.split('.').map(Number);

    for (let i = 0; i < Math.max(indexA.length, indexB.length); i++) {
      const diff = (indexA[i] || 0) - (indexB[i] || 0);
      if (diff !== 0) return diff;
    }

    return 0;
  });
};
</script>

<template>
  <el-form
      ref="ruleFormRef"
      :model="{ listItems }"
      :rules="rules"
      class="form-search-box"
  >
    <div class="contract-items">
      <el-button class="btn btn-save new-parent-btn" v-if="allowEdit" @click="addItem">
        {{ $t('contract.create.btn.new_item') }}
      </el-button>
      <el-table :data="listItems" style="width: 100%" border>
        <el-table-column :label="$t('contract.create.item_table.no')" width="70">
          <template #default="{ row, $index }">
            <strong>{{ listItems[$index].index }}</strong>
          </template>
        </el-table-column>

        <el-table-column :label="$t('contract.create.item_table.action')" resizable width="180">
          <template #default="{ row }">
            <div class="action-btn">
              <IconPlus v-if="allowEdit" @click="addSubItem(row)"/>
              <IconEdit @click="emit('editPlanDetails', row)"/>
              <IconTrash v-if="allowEdit" @click="deleteItem(row)"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('contract.create.item_table.item')" resizable min-width="180">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listItems.${$index}.workName`" :rules="rules.workName">
              <el-input :disabled="!allowEdit" v-model="listItems[$index].workName"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('planning.modal.start_date')" resizable min-width="220">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listItems.${$index}.startDate`" :rules="rules.startDate">
              <el-date-picker
                  :disabled="!allowEdit"
                  class="custom-input"
                  :format="DATE_FORMAT"
                  :value-format="DATE_FORMAT"
                  v-model="listItems[$index].startDate"
                  type="date"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('planning.modal.end_date')" resizable min-width="220">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listItems.${$index}.endDate`" :rules="rules.endDate">
              <el-date-picker
                  :disabled="!allowEdit"
                  class="custom-input"
                  :format="DATE_FORMAT"
                  :value-format="DATE_FORMAT"
                  v-model="listItems[$index].endDate"
                  type="date"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unit" :label="$t('contract.create.item_table.unit')" resizable width="90">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listItems.${$index}.unit`" :rules="rules.unit">
              <el-input v-model="listItems[$index].unit" :disabled="isParent(row)"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" :label="$t('contract.create.item_table.amount')" resizable width="160">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listItems.${$index}.quantity`" :rules="rules.quantity">
              <el-input-number style="width: 100%" v-model="listItems[$index].quantity" :min="0"
                               @change="recalculateTotal" :disabled="isParent(row)"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="unitPrice" :label="$t('contract.create.item_table.unit_price')" resizable width="260">
          <template #default="{ row, $index }">
            <el-form-item :prop="`listItems.${$index}.unitPrice`" :rules="rules.unitPrice">
              <el-input
                  v-model="listItems[$index].unitPrice"
                  :formatter="(value) => mixinMethods.formatInputMoney(value)"
                  :parser="(value) => mixinMethods.parseInputCurrency(value)"
                  @change="recalculateTotal"
                  :disabled="isParent(row)"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="$t('contract.create.item_table.total_price')" resizable width="380">
          <template #default="{ row }">
            {{ mixinMethods.formatInputMoney(row.totalPrice) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-form>
</template>


<style scoped>
.contract-items {
  padding: 10px;
}

.new-parent-btn {
  margin: 12px 0;
}

.planning-text-center {
  width: 100%;
  text-align: center;
}

.action-btn {
  display: flex;
  justify-content: space-around;

  svg {
    cursor: pointer;
  }
}
</style>
