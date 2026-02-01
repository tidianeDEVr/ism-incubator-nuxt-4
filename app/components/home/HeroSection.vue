<script setup lang="ts">
const stats = [
  { value: "500+", label: "Participants" },
  { value: "50+", label: "Projets incubes" },
  { value: "20+", label: "Hackathons" },
];
</script>

<template>
  <section
    class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-primary-800"
  >
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-secondary translate-x-1/3 -translate-y-1/3"
      />
      <div
        class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary -translate-x-1/3 translate-y-1/3"
      />
    </div>

    <div class="container-padded relative z-10 py-16 lg:py-24">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-body-sm font-medium mb-6"
          >
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Hackathon en cours
          </div>

          <h1 class="text-display-sm md:text-display text-white mb-6">
            Transformez vos idees en
            <span class="text-secondary">projets concrets</span>
          </h1>

          <p class="text-body-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
            L'incubateur de l'ISM accompagne les porteurs de projets innovants.
            Participez a nos hackathons, beneficiez d'un mentorat personnalise
            et donnez vie a vos ambitions entrepreneuriales.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
          >
            <UiButton variant="secondary" size="lg" href="/hackathons">
              Decouvrir les hackathons
            </UiButton>
            <UiButton
              variant="ghost"
              size="lg"
              href="/about"
              class="!text-white hover:!bg-white/10"
            >
              En savoir plus
            </UiButton>
          </div>

          <div class="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="text-center lg:text-left"
            >
              <div
                class="text-heading-lg lg:text-display-sm text-secondary font-bold"
              >
                {{ stat.value }}
              </div>
              <div class="text-body-sm text-white/60">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="hidden lg:block relative">
          <div class="relative aspect-square max-w-md mx-auto">
            <div
              class="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
            />

            <div
              class="absolute top-8 left-8 right-8 bottom-8 flex flex-col justify-center gap-4"
            >
              <div
                class="bg-white rounded-2xl p-6 shadow-card-hover transform -rotate-2"
              >
                <div class="flex items-center gap-4 mb-3">
                  <div
                    class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-primary">
                      Innovation Challenge
                    </div>
                    <div class="text-body-sm text-gray-500">
                      156 participants
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <UiBadge variant="success" size="sm" dot> En cours </UiBadge>
                </div>
              </div>

              <div
                class="bg-white rounded-2xl p-6 shadow-card-hover transform rotate-1 ml-8"
              >
                <div class="flex items-center gap-4 mb-3">
                  <div
                    class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-primary">50+ Projets</div>
                    <div class="text-body-sm text-gray-500">
                      Incubes avec succes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
