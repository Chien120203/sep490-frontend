<script setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import IconPlus from "@/svg/IconPlus.vue";
import IconTrash from "@/svg/IconTrash.vue";

const props = defineProps({
  items: Array,
});

const listItems = ref([...props.items]);

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
  isDelete: false
});

// Add a new main item
const addItem = () => {
  const newItem = createNewItem();
  listItems.value.push(newItem);
  updateItems();
};

// Add a new sub-item and keep the list flat
const addSubItem = (parentItem) => {
  const newSubItem = createNewItem(parentItem.unit, parentItem.index);
  parentItem.quantity = 0;
  parentItem.unitPrice = 0;
  if(!hasChildren(parentItem)) parentItem.total = 0;
  listItems.value.push(newSubItem);
  updateItems();
};

const hasChildren = (parent) => listItems.value.some(child => child.parentIndex === parent.index);

// Check if an item is a parent
const isParent = (item) => listItems.value.some((child) => child.parentIndex === item.index);

// Function to delete an item and its sub-items
const deleteItem = (itemToDelete) => {
  listItems.value = listItems.value.filter(
      (item) => item.index !== itemToDelete.index && item.parentIndex !== itemToDelete.index
  );
  recalculateTotal(); // Recalculate total after deletion
  updateItems(); // Update numbering
};

// Recalculate total amount
const recalculateTotal = () => {
  // Calculate total for leaf nodes
  listItems.value.forEach((item) => {
    if (!isParent(item)) {
      item.total = item.quantity * item.unitPrice;
    }
  });

  // Recursive function to update parent totals
  const updateParentTotal = (parentIndex) => {
    let parent = listItems.value.find((item) => item.index === parentIndex);
    if (parent) {
      parent.total = listItems.value
          .filter((child) => child.parentIndex === parent.index)
          .reduce((sum, child) => sum + child.total, 0);

      // Recursively update all ancestors
      if (parent.parentIndex !== null) {
        updateParentTotal(parent.parentIndex);
      }
    }
  };

  // Find all parents and update their totals
  listItems.value
      .filter((item) => isParent(item))
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
        .filter((item) => item.parentIndex === parentIndex)
        .forEach((item) => {
          let currentIndex = prefix ? `${prefix}.${index}` : `${index}`;
          item.index = currentIndex;
          indexMap.set(item, currentIndex);
          result.push(item);
          generateIndex(items, item.index, currentIndex);
          index++;
        });
  };

  generateIndex(listItems.value);
  emit("update:items", result);
};

// Computed property to sort items
const hierarchicalItems = computed(() => {
  return [...listItems.value].sort((a, b) => {
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
    <h2>{{$t('contract.create.items')}}</h2>
    <el-button class="btn btn-save new-parent-btn" @click="addItem">{{$t('contract.create.btn.new_item')}}</el-button>

    <el-table :data="hierarchicalItems" style="width: 100%" border>
      <el-table-column :label="$t('contract.create.item_table.no')" width="80">
        <template #default="{ row }">
          <strong>{{ row.index }}</strong>
        </template>
      </el-table-column>

      <el-table-column :label="$t('contract.create.item_table.action')" width="120">
        <template #default="{ row }">
          <div class="action-btn">
            <IconPlus @click="addSubItem(row)"/>
            <IconTrash @click="deleteItem(row)"/>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="name" :label="$t('contract.create.item_table.item')" min-width="250">
        <template #default="{ row }">
          <el-input v-model="row.workName" />
        </template>
      </el-table-column>

      <el-table-column prop="unit" :label="$t('contract.create.item_table.unit')" width="100">
        <template #default="{ row }">
          <el-input v-model="row.unit" :disabled="isParent(row)" />
        </template>
      </el-table-column>

      <el-table-column prop="quantity" :label="$t('contract.create.item_table.amount')" width="180">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" :min="0" @change="recalculateTotal" :disabled="isParent(row)" />
        </template>
      </el-table-column>

      <el-table-column prop="unitPrice" :label="$t('contract.create.item_table.unit_price')" width="180">
        <template #default="{ row }">
          <el-input-number v-model="row.unitPrice" :min="0" @change="recalculateTotal" :disabled="isParent(row)" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('contract.create.item_table.total_price')" width="150">
        <template #default="{ row }">
          {{ row.total }}
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
