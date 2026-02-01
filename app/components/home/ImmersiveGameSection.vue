<script setup lang="ts">
const gameUrl = "/game";

const gameHighlights = [
  "Simulation realiste de creation d'entreprise",
  "Prevalidation du projet et des hypotheses",
  "Tips et directions claires a chaque etape",
  "Feedback immediat pour ajuster vos choix",
];
</script>

<template>
  <section class="py-16 lg:py-24 bg-primary">
    <div class="container-padded">
      <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
        <div>
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-body-sm font-medium mb-4"
          >
            Jeu immersif
          </div>
          <h2 class="text-display-sm text-white mb-4">
            Validez votre idée en jouant
          </h2>
          <p class="text-body-lg text-white/80 mb-6">
            Un jeu video educatif qui simule la creation d'entreprise. Le but
            est de prevalider le projet tout en donnant des tips et directions a
            prendre.
          </p>
          <div
            class="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <UiButton variant="secondary" size="lg" :href="gameUrl">
              Commencer a jouer
            </UiButton>
            <span class="text-caption text-white/90">
              Disponible sur navigateur, acces rapide
            </span>
          </div>
        </div>

        <div class="relative">
          <div
            class="rounded-3xl border border-neutral-border bg-white shadow-card p-6 lg:p-8"
          >
            <div class="flex items-center justify-between mb-5">
              <div class="text-caption text-secondary font-medium">Mission</div>
              <UiBadge variant="secondary" size="sm">Beta</UiBadge>
            </div>
            <h3 class="text-heading-sm text-primary mb-4">
              Parcours de validation
            </h3>
            <ul class="space-y-3">
              <li
                v-for="item in gameHighlights"
                :key="item"
                class="flex items-start gap-3"
              >
                <span
                  class="w-6 h-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mt-0.5"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span class="text-body-sm text-gray-600">{{ item }}</span>
              </li>
            </ul>
          </div>

          <div
            class="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-secondary/20"
          />
          <div
            class="absolute -bottom-6 -left-6 w-16 h-16 rounded-2xl bg-primary/10"
          />
        </div>
      </div>
    </div>
  </section>
</template>
