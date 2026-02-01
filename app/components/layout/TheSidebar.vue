<script setup lang="ts">
interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface Props {
  items: NavItem[];
  collapsed?: boolean;
}

defineProps<Props>();

const route = useRoute();

function isActive(href: string) {
  // Exact match
  if (route.path === href) return true;

  // For base routes like /admin, /mentor, /participant - only exact match
  const basePaths = ["/admin", "/mentor", "/participant"];
  if (basePaths.includes(href)) return false;

  // For sub-routes, check if current path starts with href
  return route.path.startsWith(href + "/");
}
</script>

<template>
  <aside
    :class="[
      'fixed left-0 top-0 z-40 h-screen bg-white border-r border-neutral-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- Logo -->
    <div
      class="h-16 lg:h-20 flex items-center px-4 border-b border-neutral-border"
    >
      <NuxtLink to="/" class="flex items-center gap-3">
        <NuxtImg src="logo.webp" class="w-20" />
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="p-3 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
      <NuxtLink
        v-for="item in items"
        :key="item.name"
        :to="item.href"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
          isActive(item.href)
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary',
        ]"
      >
        <!-- Dashboard -->
        <svg
          v-if="item.icon === 'dashboard'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
        <!-- Users -->
        <svg
          v-if="item.icon === 'users'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <!-- Calendar -->
        <svg
          v-if="item.icon === 'calendar'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <!-- Folder -->
        <svg
          v-if="item.icon === 'folder'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <!-- Message -->
        <svg
          v-if="item.icon === 'message'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <!-- Star -->
        <svg
          v-if="item.icon === 'star'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <!-- Clipboard -->
        <svg
          v-if="item.icon === 'clipboard'"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <span v-if="!collapsed" class="truncate">{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
