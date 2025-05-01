<script setup>
import { defineProps, defineEmits, computed, ref, watch } from "vue";
import IconPlus from "@/svg/IconPlus.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {mixinMethods} from "@/utils/variables.js";

const props = defineProps({
  items: Array,
  isUpdate: Boolean,
  isAllowUpdate: {
    type: Boolean,
    default: true,
  },
});

const listItems = ref([...props.items]);

watch(() => props.items, (newItems) => {
  listItems.value = [...newItems];
}, { deep: true });

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
  total: 0,
  IsDelete: false
});

// Add a new main item
const addItem = () => {
  const newItem = createNewItem();
  listItems.value.push(newItem);
  updateItems();
};

// Add a new sub-item
const addSubItem = (parentItem) => {
  const newSubItem = createNewItem(parentItem.unit, parentItem.index);
  parentItem.quantity = 0;
  parentItem.unitPrice = 0;
  if (!hasChildren(parentItem)) parentItem.total = 0;
  listItems.value.push(newSubItem);
  updateItems();
};

const hasChildren = (parent) => listItems.value.some(child => child.parentIndex === parent.index && !child.IsDelete);
const isParent = (item) => hasChildren(item);

// Function to delete an item
const deleteItem = (itemToDelete) => {
  if (props.isUpdate) {
    itemToDelete.IsDelete = true; // Mark as deleted
  } else {
    listItems.value = listItems.value.filter(
        (item) => item.index !== itemToDelete.index && item.parentIndex !== itemToDelete.index
    );
  }

  recalculateTotal();
  updateItems();
};

// Recalculate total amount
const recalculateTotal = () => {
  // Calculate total for leaf nodes (ignoring deleted items)
  listItems.value.forEach((item) => {
    if (!isParent(item) && !item.IsDelete) {
      item.total = item.quantity * item.unitPrice;
    }
  });

  // Recursive function to update parent totals
  const updateParentTotal = (parentIndex) => {
    let parent = listItems.value.find((item) => item.index === parentIndex && !item.IsDelete);
    if (parent) {
      parent.total = listItems.value
          .filter((child) => child.parentIndex === parent.index && !child.IsDelete)
          .reduce((sum, child) => sum + child.total, 0);

      if (parent.parentIndex !== null) {
        updateParentTotal(parent.parentIndex);
      }
    }
  };

  // Find all parents and update their totals
  listItems.value
      .filter((item) => isParent(item) && !item.IsDelete)
      .forEach((parent) => updateParentTotal(parent.index));

  updateItems();
};

// Update item list with numbering
const updateItems = () => {
  let result = [];
  let indexMap = new Map();

  const generateIndex = (items, parentIndex = null, prefix = "") => {
    let index = 1;

    items
        .filter((item) => item.parentIndex === parentIndex && (!item.IsDelete || !props.isUpdate))
        .forEach((item) => {
          if (!item.IsDelete) {
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
    listItems.value = listItems.value.filter(item => !item.IsDelete);
    generateIndex(listItems.value);
  }

  emit("update:items", result);
};

// Computed property to filter and sort items
const hierarchicalItems = computed(() => {
  return [...listItems.value]
      .filter(item => !item.IsDelete)
      .sort((a, b) => {
        const aParts = a.index.split(".").map(Number);
        const bParts = b.index.split(".").map(Number);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aVal = aParts[i] || 0;
          const bVal = bParts[i] || 0;
          if (aVal !== bVal) {
            return aVal - bVal;
          }
        }
        return 0;
      });
});
</script>

<template>
  <div class="contract-items">
    <h2>{{ $t('contract.create.items') }}</h2>
    <el-button class="btn btn-save new-parent-btn" v-if="isAllowUpdate" @click="addItem">
      {{ $t('contract.create.btn.new_item') }}
    </el-button>
    <el-table :data="hierarchicalItems" style="width: 100%" border>
      <el-table-column :label="$t('contract.create.item_table.no')" width="80">
        <template #default="{ row }">
          <strong>{{ row.index }}</strong>
        </template>
      </el-table-column>

      <el-table-column v-if="isAllowUpdate" :label="$t('contract.create.item_table.action')" width="120">
        <template #default="{ row }">
          <div class="action-btn">
            <IconPlus @click="addSubItem(row); $event.preventDefault()" />
            <IconTrash @click="deleteItem(row); $event.preventDefault()" />
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="name" :label="$t('contract.create.item_table.item')" min-width="250">
        <template #default="{ row }">
          <el-input :disabled="!isAllowUpdate" v-model="row.workName" />
        </template>
      </el-table-column>

      <el-table-column prop="unit" :label="$t('contract.create.item_table.unit')" width="100">
        <template #default="{ row }">
          <el-input v-model="row.unit" :disabled="isParent(row) || !isAllowUpdate" />
        </template>
      </el-table-column>

      <el-table-column prop="quantity" :label="$t('contract.create.item_table.amount')" width="180">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" :min="0" @change="recalculateTotal" :disabled="isParent(row) || !isAllowUpdate" />
        </template>
      </el-table-column>

      <el-table-column prop="unitPrice" :label="$t('contract.create.item_table.unit_price')" width="180">
        <template #default="{ row }">
          <el-input :formatter="(value) => mixinMethods.formatInputMoney(value)"
                           :parser="(value) => mixinMethods.parseInputCurrency(value)"
                           v-model="row.unitPrice" :min="0" @change="recalculateTotal" :disabled="isParent(row) || !isAllowUpdate" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('contract.create.item_table.total_price')" width="150">
        <template #default="{ row }">
          {{ mixinMethods.formatInputMoney(row.total) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.contract-items {
  padding: 10px;
}

.new-parent-btn {
  margin: 12px 0;
}

.action-btn {
  display: flex;
  justify-content: space-evenly;

  svg {
    cursor: pointer;
  }
}
</style>
