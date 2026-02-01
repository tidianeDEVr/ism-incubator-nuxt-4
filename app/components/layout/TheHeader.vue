<script setup lang="ts">
const route = useRoute();

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Hackathons", href: "/hackathons" },
  { name: "Realisations", href: "/achievements" },
  { name: "A propos", href: "/about" },
];

const isMobileMenuOpen = ref(false);

function isActive(href: string) {
  if (href === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(href);
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    closeMobileMenu();
  },
);
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-neutral-border">
    <div class="container-padded">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <NuxtLink to="/" class="flex items-center gap-3">
          <NuxtImg src="logo-long.jpg" class="w-[12rem]" />
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'px-4 py-2 rounded-lg text-body font-medium transition-colors duration-200',
              isActive(item.href)
                ? 'text-primary bg-primary/5'
                : 'text-gray-600 hover:text-primary hover:bg-primary/5',
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center gap-3">
          <UiButton variant="ghost" href="/login"> Connexion </UiButton>
          <UiButton variant="secondary" href="/register"> Participer </UiButton>
        </div>

        <button
          type="button"
          class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="sr-only">Menu</span>
          <svg
            v-if="!isMobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden border-t border-neutral-border bg-white"
      >
        <div class="container-padded py-4 space-y-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'block px-4 py-3 rounded-lg text-body font-medium transition-colors duration-200',
              isActive(item.href)
                ? 'text-primary bg-primary/5'
                : 'text-gray-600 hover:text-primary hover:bg-primary/5',
            ]"
          >
            {{ item.name }}
          </NuxtLink>

          <div class="pt-4 mt-4 border-t border-neutral-border space-y-2">
            <UiButton variant="outline" href="/login" full-width>
              Connexion
            </UiButton>
            <UiButton variant="secondary" href="/register" full-width>
              Participer a un hackathon
            </UiButton>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
