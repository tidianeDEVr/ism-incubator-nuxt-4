<script setup lang="ts">
const features = [
  {
    icon: "lightbulb",
    title: "Ideation structuree",
    description:
      "Beneficiez d'outils et de methodes pour transformer vos idees en projets viables grace a notre accompagnement personnalise.",
  },
  {
    icon: "users",
    title: "Mentorat expert",
    description:
      "Connectez-vous avec des mentors experimentesprovenant de l'industrie qui vous guideront tout au long de votre parcours entrepreneurial.",
  },
  {
    icon: "trophy",
    title: "Hackathons innovants",
    description:
      "Participez a des competitions stimulantes pour mettre vos competences a l'epreuve et developper des solutions a impact.",
  },
  {
    icon: "rocket",
    title: "Accompagnement vers l'incubation",
    description:
      "Les meilleurs projets sont selectionnes pour rejoindre notre programme d'incubation avec financement et ressources dedies.",
  },
];
</script>

<template>
  <section class="py-16 lg:py-24 bg-neutral-background">
    <div class="container-padded">
      <div class="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
        <h2 class="text-display-sm text-primary mb-4">
          Pourquoi rejoindre l'incubateur ISM ?
        </h2>
        <p class="text-body-lg text-gray-600">
          Nous offrons un ecosysteme complet pour accompagner les entrepreneurs
          de demain, de l'idee initiale jusqu'au lancement reussi.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
        >
          <div
            class="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5"
          >
            <svg
              v-if="feature.icon === 'lightbulb'"
              class="w-7 h-7 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>

            <svg
              v-if="feature.icon === 'users'"
              class="w-7 h-7 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <svg
              v-if="feature.icon === 'trophy'"
              class="w-7 h-7 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>

            <svg
              v-if="feature.icon === 'rocket'"
              class="w-7 h-7 text-secondary"
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

          <h3 class="text-heading-sm text-primary mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-body-sm text-gray-600">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
