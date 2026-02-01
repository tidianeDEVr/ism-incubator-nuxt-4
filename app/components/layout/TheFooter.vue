<script setup lang="ts">
const currentYear = new Date().getFullYear();

const navigation = {
  platform: [
    { name: "Hackathons", href: "/hackathons" },
    { name: "Realisations", href: "/achievements" },
    { name: "Ressources", href: "/resources" },
  ],
  incubator: [
    { name: "A propos", href: "/about" },
    { name: "Mentors", href: "/mentors" },
    { name: "Partenaires", href: "/partners" },
  ],
  legal: [
    { name: "Mentions legales", href: "/legal" },
    { name: "Confidentialite", href: "/privacy" },
    { name: "CGU", href: "/terms" },
  ],
};

const socials = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/groupeism",
    icon: "linkedin",
  },
  { name: "Twitter", href: "https://twitter.com/groupeism", icon: "twitter" },
  {
    name: "Facebook",
    href: "https://facebook.com/groupeism",
    icon: "facebook",
  },
];
</script>

<template>
  <footer class="bg-primary text-white">
    <div class="container-padded py-12 lg:py-16">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
      >
        <!-- Brand -->
        <div class="lg:col-span-2">
          <NuxtLink to="/" class="flex items-center gap-3 mb-4">
            <div class="px-5 py-0 bg-white rounded">
              <NuxtImg src="logo.webp" class="w-20" />
            </div>
          </NuxtLink>
          <p class="text-white/70 text-body-sm max-w-sm mb-6">
            L'incubateur de l'ISM accompagne les porteurs de projets innovants
            depuis l'ideation jusqu'a l'incubation. Rejoignez notre communaute
            d'entrepreneurs.
          </p>
          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
            >
              <span class="sr-only">{{ social.name }}</span>
              <!-- LinkedIn -->
              <svg
                v-if="social.icon === 'linkedin'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
              <!-- Twitter -->
              <svg
                v-if="social.icon === 'twitter'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              <!-- Facebook -->
              <svg
                v-if="social.icon === 'facebook'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Platform Links -->
        <div>
          <h3 class="font-semibold text-body mb-4">Plateforme</h3>
          <ul class="space-y-3">
            <li v-for="item in navigation.platform" :key="item.name">
              <NuxtLink
                :to="item.href"
                class="text-white/70 hover:text-white text-body-sm transition-colors duration-200"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Incubator Links -->
        <div>
          <h3 class="font-semibold text-body mb-4">Incubateur</h3>
          <ul class="space-y-3">
            <li v-for="item in navigation.incubator" :key="item.name">
              <NuxtLink
                :to="item.href"
                class="text-white/70 hover:text-white text-body-sm transition-colors duration-200"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="font-semibold text-body mb-4">Legal</h3>
          <ul class="space-y-3">
            <li v-for="item in navigation.legal" :key="item.name">
              <NuxtLink
                :to="item.href"
                class="text-white/70 hover:text-white text-body-sm transition-colors duration-200"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-white/10">
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p class="text-white/60 text-body-sm">
            {{ currentYear }} ISM Incubateur. Tous droits reserves.
          </p>
          <p class="text-white/60 text-body-sm">Groupe ISM - Dakar, Senegal</p>
        </div>
      </div>
    </div>
  </footer>
</template>
