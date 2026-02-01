<script setup lang="ts">
const route = useRoute()

const sidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

// Determine navigation based on route
const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { name: 'Mentors', href: '/admin/mentors', icon: 'users' },
  { name: 'Hackathons', href: '/admin/hackathons', icon: 'calendar' },
  { name: 'Projets', href: '/admin/projects', icon: 'folder' },
  { name: 'Messages', href: '/admin/messages', icon: 'message' },
]

const mentorNav = [
  { name: 'Dashboard', href: '/mentor', icon: 'dashboard' },
  { name: 'Suivi Participants', href: '/mentor/projects', icon: 'users' },
  { name: 'Messages', href: '/mentor/messages', icon: 'message' },
]

const participantNav = [
  { name: 'Dashboard', href: '/participant', icon: 'dashboard' },
  { name: 'Hackathons', href: '/participant/hackathons', icon: 'calendar' },
  { name: 'Mes Projets', href: '/participant/projects', icon: 'folder' },
  { name: 'Messages', href: '/participant/messages', icon: 'message' },
]

const navItems = computed(() => {
  if (route.path.startsWith('/admin')) return adminNav
  if (route.path.startsWith('/mentor')) return mentorNav
  return participantNav
})

const userInfo = computed(() => {
  if (route.path.startsWith('/admin')) {
    return { name: 'Admin ISM', role: 'Administrateur' }
  }
  if (route.path.startsWith('/mentor')) {
    return { name: 'Dr. Diallo', role: 'Mentor' }
  }
  return { name: 'Amadou Fall', role: 'Participant' }
})

function toggleSidebar() {
  if (window.innerWidth < 1024) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

// Close mobile sidebar on route change
watch(() => route.path, () => {
  isMobileSidebarOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-neutral-background">
    <!-- Mobile Sidebar Overlay -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        @click="isMobileSidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <div :class="['lg:block', isMobileSidebarOpen ? 'block' : 'hidden']">
      <TheSidebar :items="navItems" :collapsed="sidebarCollapsed" />
    </div>

    <!-- Header -->
    <TheDashboardHeader
      :sidebar-collapsed="sidebarCollapsed"
      :user-name="userInfo.name"
      :user-role="userInfo.role"
      @toggle-sidebar="toggleSidebar"
    >
      <template #title>
        <slot name="header-title" />
      </template>
    </TheDashboardHeader>

    <!-- Main Content -->
    <main
      :class="[
        'pt-16 lg:pt-20 min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      ]"
    >
      <div class="p-4 lg:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
