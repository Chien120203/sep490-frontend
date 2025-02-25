<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 class="text-xl font-medium text-gray-900">Chi tiết hợp đồng chủ đầu tư</h1>
      <div class="flex gap-2">
        <button class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <Download class="h-4 w-4" />
          Tải hợp đồng
        </button>
        <button class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <Save class="h-4 w-4" />
          Lưu
        </button>
        <button class="inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
          <Trash2 class="h-4 w-4" />
          Xóa
        </button>
        <button class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <Settings class="h-4 w-4" />
          Thiết lập
        </button>
        <button class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <X class="h-4 w-4" />
          Đóng
        </button>
      </div>
    </header>

    <div class="grid grid-cols-[300px_1fr] gap-6 p-6">
      <!-- Sidebar -->
      <aside class="rounded-lg bg-white p-6">
        <div class="mb-6 flex gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500 text-white">
            <Building class="h-6 w-6" />
          </div>
          <div>
            <h2 class="text-base font-medium">Hợp đồng thi công</h2>
            <p class="text-cyan-500">[Mẫu] Nội thất</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-500">Số hợp đồng</label>
            <p class="font-medium">{{ contractData.contractNumber }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Ngày ký</label>
            <p class="font-medium">{{ contractData.signDate }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Ngày hiệu lực</label>
            <p class="font-medium">{{ contractData.effectiveDate }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Ngày hết hiệu lực</label>
            <p class="font-medium">{{ contractData.expiryDate }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-500">Giá trị hợp đồng</label>
            <p class="font-medium text-cyan-500">
              {{ formatCurrency(contractData.contractValue) }}
            </p>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="mb-4 text-base font-medium">Thông tin bên Chủ đầu tư</h3>
          <h4 class="mb-2 text-cyan-500">Fastwork</h4>
          <div class="space-y-2 text-sm">
            <p>
              <span class="text-gray-500">MST:</span> {{ contractData.taxCode }}
            </p>
            <p>
              <span class="text-gray-500">TK ngân hàng:</span>
              {{ contractData.bankAccount }}
            </p>
            <p>
              <span class="text-gray-500">Người đại diện:</span>
              {{ contractData.representative }}
            </p>
            <p>
              <span class="text-gray-500">Chức vụ:</span> {{ contractData.position }}
            </p>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="mb-4 text-base font-medium">Bảo lãnh hợp đồng</h3>
          <div class="space-y-2 text-sm">
            <p>
              <span class="text-gray-500">Giá trị:</span>
              {{ contractData.guaranteeValue }}
            </p>
            <p>
              <span class="text-gray-500">Ngày hiệu lực:</span>
              {{ contractData.guaranteeStartDate }}
            </p>
            <p>
              <span class="text-gray-500">Ngày hết hiệu lực:</span>
              {{ contractData.guaranteeEndDate }}
            </p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="overflow-hidden rounded-lg bg-white">
        <!-- Tabs -->
        <div class="border-b bg-gray-50">
          <nav class="flex px-4" role="tablist">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="[
                'px-6 py-4 text-sm font-medium relative',
                currentTab === tab.id
                  ? 'text-cyan-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-500'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
                @click="currentTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Form -->
        <div v-if="currentTab === 'information'" class="p-6">
          <form @submit.prevent="handleSubmit">
            <div class="grid grid-cols-2 gap-8">
              <!-- Left Column -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="font-medium">
                    Chủ đầu tư <span class="text-red-500">*</span>
                  </label>
                  <input
                      v-model="form.investor"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      required
                      placeholder="Nhập tên chủ đầu tư"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">
                    Số hợp đồng <span class="text-red-500">*</span>
                  </label>
                  <input
                      v-model="form.contractNumber"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      required
                      placeholder="Nhập số hợp đồng"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Tên phụ lục</label>
                  <input
                      v-model="form.appendixName"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập tên phụ lục"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Người đại diện</label>
                  <input
                      v-model="form.representative"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập tên người đại diện"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Số điện thoại</label>
                  <input
                      v-model="form.phone"
                      type="tel"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập số điện thoại"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Website</label>
                  <input
                      v-model="form.website"
                      type="url"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập website"
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="font-medium">
                    Loại hợp đồng <span class="text-red-500">*</span>
                  </label>
                  <select
                      v-model="form.contractType"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                  >
                    <option value="construction">Thi công</option>
                    <option value="design">Thiết kế</option>
                    <option value="consulting">Tư vấn</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Phụ lục số</label>
                  <input
                      v-model="form.appendixNumber"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập phụ lục số"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Chức vụ</label>
                  <input
                      v-model="form.position"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập chức vụ"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Email</label>
                  <input
                      v-model="form.email"
                      type="email"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập email"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Địa chỉ trụ sở</label>
                  <input
                      v-model="form.address"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập địa chỉ trụ sở"
                  />
                </div>

                <div class="space-y-2">
                  <label class="font-medium">Mã số thuế</label>
                  <input
                      v-model="form.taxCode"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      placeholder="Nhập mã số thuế"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('information')
const form = ref({
  investor: 'Fastwork',
  contractNumber: 'P00037_077-HDTC/NT',
  contractType: 'construction',
  appendixName: '',
  appendixNumber: '',
  representative: '',
  position: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  taxCode: '',
})

const contractData = {
  contractNumber: 'P00037_077-HDTC/NT',
  contractValue: 847000000,
  signDate: '25/02/2024',
  effectiveDate: '25/02/2024',
  expiryDate: '25/08/2024',
  taxCode: '0123456789',
  bankAccount: '123456789',
  representative: 'Nguyễn Văn A',
  position: 'Giám đốc',
  guaranteeValue: '84.700.000',
  guaranteeStartDate: '25/02/2024',
  guaranteeEndDate: '25/08/2024',
}

const tabs = [
  { id: 'information', name: 'Thông tin' },
  { id: 'categories', name: 'Hạng mục' },
  { id: 'adjustments', name: 'Điều chỉnh BOQ' },
  { id: 'appendix', name: 'Phụ lục' },
  { id: 'payment', name: 'Lịch thanh toán' },
  { id: 'expenses', name: 'Thu chi' },
  { id: 'exchange', name: 'Trao đổi' },
  { id: 'activities', name: 'Hoạt động' },
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
}
</script>