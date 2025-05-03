<script setup>
import { defineProps, defineEmits, computed, ref, watch } from "vue";
import IconPlus from "@/svg/IconPlus.vue";
import IconTrash from "@/svg/IconTrash.vue";
import {mixinMethods} from "@/utils/variables.js";
import {CURRENCY} from "@/constants/application.js";
import Papa from 'papaparse';
import FileUpload from "@/components/common/FileUpload.vue";
import {useI18n} from "vue-i18n";

const props = defineProps({
  items: Array,
  isUpdate: Boolean,
  isAllowUpdate: {
    type: Boolean,
    default: true,
  },
  contractInfo: {
    type: Object,
    default: () => {},
  },
  actualBudget: {
    type: Number,
    default: 0,
  },
});
const {t} = useI18n();
const uploadedFiles = ref([]);

const handleRemoveAttachments = () => {
  uploadedFiles.vaue = [];
}

const handleCSVSelected = (files) => {
  if (!files || files.length === 0) return;

  const csvFile = files[0];
  uploadedFiles.value = [csvFile];
  mixinMethods.startLoading();

  Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        if (results.errors.length > 0) {
          console.error('Papa Parse errors:', results.errors);
          mixinMethods.notifyError(t('response.message.import_csv_failed'));
          mixinMethods.endLoading();
          // Clear file after error
          emit("file-removed", csvFile);
          return;
        }

        // Map CSV column headers to contract detail fields
        const fieldMap = {
          'Index': 'index',
          'Parent Index': 'parentIndex',
          'Work Name': 'workName',
          'Work Code': 'workCode',
          'Unit': 'unit',
          'Quantity': 'quantity',
          'Unit Price': 'unitPrice',
          'Total': 'total'
        };

        // Process the parsed data
        const contractDetails = results.data.map((row) => {
          const detail = { workCode: "", IsDelete: false };

          // Map fields from CSV to contract detail properties
          Object.entries(fieldMap).forEach(([csvField, detailField]) => {
            if (row[csvField] !== undefined) {
              if (['quantity', 'unitPrice', 'total'].includes(detailField)) {
                detail[detailField] = parseFloat(row[csvField].replace(/[^\d.-]/g, '') || '0');
              } else {
                detail[detailField] = row[csvField];
              }
            }
          });

          // Ensure parentIndex is null (not undefined) for top-level items
          if (!detail.parentIndex || detail.parentIndex === '') {
            detail.parentIndex = null;
          }

          // Calculate total if not provided but quantity and unitPrice are available
          if ((!detail.total || detail.total === 0) && detail.quantity && detail.unitPrice) {
            detail.total = detail.quantity * detail.unitPrice;
          }

          return detail;
        });

        // Sort the details to ensure parents are processed before children if needed
        contractDetails.sort((a, b) => {
          const aDepth = (a.index || '').split('.').length;
          const bDepth = (b.index || '').split('.').length;
          return aDepth - bDepth;
        });

        // Update contract details in the store
        props.contractInfo.contractDetails = contractDetails;

        mixinMethods.notifySuccess(t('response.message.import_csv_success'));
      } catch (error) {
        console.error('Error processing CSV data:', error);
        mixinMethods.notifyError(t('response.message.import_csv_failed'));
      } finally {
        // Clear file after processing (whether successful or failed)
        emit("file-removed", csvFile);
        mixinMethods.endLoading();
      }
    },
    error: (error) => {
      console.error('Papa Parse error:', error);
      mixinMethods.notifyError(t('response.message.import_csv_failed'));
      // Clear file after error
      emit("file-removed", csvFile);
      mixinMethods.endLoading();
    }
  });
};

const downloadCSVTemplate = () => {
  const headers = [
    'Index', 'Parent Index', 'Work Name', 'Unit', 'Quantity', 'Unit Price', 'Total'
  ];

  // Sample data rows
  const sampleData = [
    ['1', '', 'Main Category', '',  '0', '0', '0'],
    ['1.1', '1', 'Sub Category',  '', '0', '0', '0'],
    ['1.1.1', '1.1', 'Work Item 1', 'm²', '100', '50000', '5000000'],
    ['1.2', '1', 'Work Item 2', 'kg', '200', '30000', '6000000'],
    ['2', '', 'Another Category', '', '0', '0', '0']
  ];

  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  sampleData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'contract_details_template.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
    <div style="display: flex; justify-content: space-between; margin-top: 14px; margin-right: 12px;">
      <div>
        <el-button class="btn btn-save new-parent-btn" style="margin-bottom: 32px; margin-top: 0" v-if="isAllowUpdate" @click="addItem">
          {{ $t('contract.create.btn.new_item') }}
        </el-button>
      </div>
      <div style="display: flex; justify-content: space-evenly;">
        <FileUpload
            :message="$t('common.csv_upload')"
            :allowedTypes="'.csv'"
            :fileLimit="1"
            :existingFiles="uploadedFiles"
            :disabled="!isAllowUpdate"
            @file-selected="handleCSVSelected"
            @file-removed="handleRemoveAttachments"
        />
        <el-button
            style="margin-bottom: 33px; margin-left: 16px"
            type="info"
            @click="downloadCSVTemplate()"
        >
          {{ $t('contract.create.download_template') }}
        </el-button>
      </div>
    </div>

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

      <el-table-column prop="name" :label="$t('contract.create.item_table.item')" min-width="130">
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

      <el-table-column prop="unitPrice" :label="$t('contract.create.item_table.unit_price')" width="240">
        <template #default="{ row }">
          <el-input :formatter="(value) => mixinMethods.formatInputMoney(value)"
                           :parser="(value) => mixinMethods.parseInputCurrency(value)"
                    v-model="row.unitPrice" :min="0" @change="recalculateTotal" :disabled="isParent(row) || !isAllowUpdate" >
            <template #append>
              {{ CURRENCY }}
            </template>
          </el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('contract.create.item_table.total_price')" width="220">
        <template #default="{ row }">
          {{`${mixinMethods.formatInputMoney(row.total)} ${CURRENCY}`}}
        </template>
      </el-table-column>
    </el-table>

    <div class="actual-budget" style="display: flex; justify-content: flex-end; margin-top: 14px; margin-right: 12px">
      <strong>{{$t('common.total')}}: {{ `${mixinMethods.formatInputMoney(props.actualBudget)} ${CURRENCY}` }}</strong>
    </div>
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
