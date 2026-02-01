<script setup lang="ts">
interface Column {
  id: string
  title: string
  color: string
  bgColor: string
}

interface Props {
  columns: Column[]
  modelValue: Record<string, any[]>
  itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 5,
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any[]>]
  'item-click': [item: any, columnId: string]
  'item-move': [item: any, fromColumn: string, toColumn: string]
}>()

defineSlots<{
  item: (props: { item: any; columnId: string }) => any
  header: (props: { column: Column; count: number }) => any
  empty: (props: { column: Column }) => any
}>()

// Pagination state per column
const currentPage = ref<Record<string, number>>({})

// Initialize pages
props.columns.forEach(col => {
  currentPage.value[col.id] = 1
})

// Get paginated items for a column
function getPaginatedItems(columnId: string) {
  const items = props.modelValue[columnId] || []
  const page = currentPage.value[columnId] || 1
  const start = (page - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return items.slice(start, end)
}

// Get total pages for a column
function getTotalPages(columnId: string) {
  const items = props.modelValue[columnId] || []
  return Math.ceil(items.length / props.itemsPerPage)
}

// Navigation
function nextPage(columnId: string) {
  const total = getTotalPages(columnId)
  const current = currentPage.value[columnId] ?? 1
  if (current < total) {
    currentPage.value[columnId] = current + 1
  }
}

function prevPage(columnId: string) {
  const current = currentPage.value[columnId] ?? 1
  if (current > 1) {
    currentPage.value[columnId] = current - 1
  }
}

// Helper to get current page safely
function getPage(columnId: string) {
  return currentPage.value[columnId] ?? 1
}

// Set specific page
function setPage(columnId: string, page: number) {
  const total = getTotalPages(columnId)
  if (page >= 1 && page <= total) {
    currentPage.value[columnId] = page
  }
}

// Get visible page numbers for pagination
function getVisiblePages(columnId: string): (number | 'ellipsis')[] {
  const total = getTotalPages(columnId)
  const current = getPage(columnId)
  const pages: (number | 'ellipsis')[] = []

  if (total <= 5) {
    // Show all pages if 5 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('ellipsis')
    }

    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('ellipsis')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
}

// Drag and drop
const draggedItem = ref<any>(null)
const draggedFromColumn = ref<string | null>(null)
const dragOverColumn = ref<string | null>(null)

function onDragStart(e: DragEvent, item: any, columnId: string) {
  draggedItem.value = item
  draggedFromColumn.value = columnId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function onDragOver(e: DragEvent, columnId: string) {
  e.preventDefault()
  dragOverColumn.value = columnId
}

function onDragLeave() {
  dragOverColumn.value = null
}

function onDrop(targetColumnId: string) {
  if (draggedItem.value && draggedFromColumn.value && draggedFromColumn.value !== targetColumnId) {
    emit('item-move', draggedItem.value, draggedFromColumn.value, targetColumnId)
  }
  draggedItem.value = null
  draggedFromColumn.value = null
  dragOverColumn.value = null
}

function onDragEnd() {
  draggedItem.value = null
  draggedFromColumn.value = null
  dragOverColumn.value = null
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
    <div
      v-for="column in columns"
      :key="column.id"
      :class="[
        'flex-shrink-0 w-72 lg:w-80 flex flex-col rounded-lg overflow-hidden transition-all snap-start',
        dragOverColumn === column.id && draggedFromColumn !== column.id
          ? 'ring-2 ring-primary ring-offset-2'
          : 'border border-neutral-border',
      ]"
      @dragover="onDragOver($event, column.id)"
      @dragleave="onDragLeave"
      @drop="onDrop(column.id)"
    >
      <!-- Column Header (Sticky) -->
      <div
        :class="[
          'flex items-center justify-between p-3 border-b-2 sticky top-0 z-10',
          column.bgColor,
        ]"
        :style="{ borderBottomColor: column.color }"
      >
        <slot name="header" :column="column" :count="modelValue[column.id]?.length || 0">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: column.color }"
            />
            <span class="text-body-sm font-semibold text-gray-900">
              {{ column.title }}
            </span>
          </div>
          <span class="px-2 py-0.5 text-caption font-medium bg-white rounded-full text-gray-600 shadow-sm">
            {{ modelValue[column.id]?.length || 0 }}
          </span>
        </slot>
      </div>

      <!-- Column Content -->
      <div class="flex-1 bg-gray-50/50 p-2 space-y-2 min-h-[280px] max-h-[400px] overflow-y-auto">
        <template v-if="(modelValue[column.id]?.length ?? 0) > 0">
          <div
            v-for="item in getPaginatedItems(column.id)"
            :key="item.id"
            draggable="true"
            :class="[
              'cursor-pointer transition-opacity',
              draggedItem?.id === item.id ? 'opacity-50' : '',
            ]"
            @click="emit('item-click', item, column.id)"
            @dragstart="onDragStart($event, item, column.id)"
            @dragend="onDragEnd"
          >
            <slot name="item" :item="item" :column-id="column.id">
              <div class="bg-white p-3 rounded-lg shadow-sm border border-neutral-border hover:shadow-card hover:border-primary/30 transition-all">
                {{ item.title || item.name || item.id }}
              </div>
            </slot>
          </div>
        </template>
        <template v-else>
          <slot name="empty" :column="column">
            <div class="flex items-center justify-center h-20 text-body-sm text-gray-400">
              Aucun element
            </div>
          </slot>
        </template>
      </div>

      <!-- Pagination Footer -->
      <div
        v-if="getTotalPages(column.id) > 1"
        class="flex items-center justify-center gap-1 px-3 py-2 bg-white border-t border-neutral-border"
      >
        <!-- Previous arrow -->
        <button
          :disabled="getPage(column.id) <= 1"
          class="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          @click.stop="prevPage(column.id)"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Page numbers -->
        <template v-for="(page, index) in getVisiblePages(column.id)" :key="index">
          <span
            v-if="page === 'ellipsis'"
            class="w-6 h-6 flex items-center justify-center text-gray-400 text-xs"
          >
            ...
          </span>
          <button
            v-else
            :class="[
              'w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium transition-colors',
              getPage(column.id) === page
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
            @click.stop="setPage(column.id, page)"
          >
            {{ page }}
          </button>
        </template>

        <!-- Next arrow -->
        <button
          :disabled="getPage(column.id) >= getTotalPages(column.id)"
          class="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          @click.stop="nextPage(column.id)"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
