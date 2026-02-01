<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
  class?: string
  headerClass?: string
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  emptyText?: string
  striped?: boolean
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: 'Aucune donnée disponible',
  striped: false,
  hoverable: true,
})

defineSlots<{
  [key: string]: (props: { item: any; index: number }) => any
  actions?: (props: { item: any; index: number }) => any
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-neutral-border">
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'text-left py-3 px-4 text-body-sm font-semibold text-gray-600',
              column.headerClass,
            ]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading state -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="py-12 text-center">
            <div class="flex items-center justify-center gap-2 text-gray-500">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Chargement...</span>
            </div>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="py-12 text-center text-gray-500">
            {{ emptyText }}
          </td>
        </tr>

        <!-- Data rows -->
        <tr
          v-else
          v-for="(item, index) in data"
          :key="index"
          :class="[
            'border-b border-neutral-border last:border-0',
            hoverable ? 'hover:bg-gray-50' : '',
            striped && index % 2 === 1 ? 'bg-gray-50' : '',
          ]"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="['py-3 px-4', column.class]"
          >
            <slot :name="column.key" :item="item" :index="index">
              {{ item[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
