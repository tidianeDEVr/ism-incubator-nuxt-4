<script setup lang="ts">
useHead({
  title: "Ressources - ISM Incubator",
  meta: [
    {
      name: "description",
      content:
        "Accedez aux ressources, outils et guides mis a disposition par l'incubateur ISM pour structurer vos projets.",
    },
  ],
});

const pillars = [
  {
    title: "Guides & Methodes",
    description:
      "Des supports concrets pour structurer votre idee et valider votre marche.",
    icon: "lightbulb",
    items: ["Ideation", "Business model", "Validation client"],
  },
  {
    title: "Mentorat & Coaching",
    description:
      "Un accompagnement personnalise avec des experts de l'ecosysteme.",
    icon: "users",
    items: ["Sessions 1:1", "Retours experts", "Suivi de progression"],
  },
  {
    title: "Outils & Templates",
    description: "Des canevas pratiques pour avancer vite et rester aligne.",
    icon: "trophy",
    items: ["Pitch deck", "Roadmap produit", "Plan d'action"],
  },
  {
    title: "Financement & Reseau",
    description:
      "Mise en relation et preparation pour accelerer votre croissance.",
    icon: "rocket",
    items: ["Demo days", "Investisseurs", "Partenariats"],
  },
];

const accessSteps = [
  {
    title: "1. Rejoindre un hackathon",
    description:
      "Accedez aux ressources de base des la participation a un challenge.",
  },
  {
    title: "2. Beneficier du mentorat",
    description:
      "Travaillez avec un mentor pour definir un plan d'action clair.",
  },
  {
    title: "3. Se qualifier pour l'incubation",
    description:
      "Les meilleurs projets profitent d'un accompagnement avance et de ressources dediees.",
  },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary py-12 lg:py-16">
      <div class="container-padded">
        <div class="max-w-2xl">
          <h1 class="text-display-sm text-white mb-4">Ressources</h1>
          <p class="text-body-lg text-white/70">
            Des outils, guides et bonnes pratiques pour transformer une idee en
            projet viable.
          </p>
        </div>
      </div>
    </section>

    <!-- Pillars -->
    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">
            Ce que vous trouverez
          </h2>
          <p class="text-body-lg text-gray-600">
            Un ensemble de ressources pensees pour chaque etape du parcours
            entrepreneurial.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <UiCard v-for="pillar in pillars" :key="pillar.title">
            <div
              class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4"
            >
              <!-- Lightbulb -->
              <svg
                v-if="pillar.icon === 'lightbulb'"
                class="w-6 h-6 text-secondary"
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
              <!-- Users -->
              <svg
                v-if="pillar.icon === 'users'"
                class="w-6 h-6 text-secondary"
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
              <!-- Trophy -->
              <svg
                v-if="pillar.icon === 'trophy'"
                class="w-6 h-6 text-secondary"
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
              <!-- Rocket -->
              <svg
                v-if="pillar.icon === 'rocket'"
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

            <h3 class="text-heading-sm text-primary mb-2">
              {{ pillar.title }}
            </h3>
            <p class="text-body-sm text-gray-600 mb-4">
              {{ pillar.description }}
            </p>
            <ul class="space-y-2">
              <li
                v-for="item in pillar.items"
                :key="item"
                class="flex items-center gap-2 text-body-sm text-gray-500"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-secondary/60" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- Access -->
    <section class="py-12 lg:py-16 bg-neutral-background">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Comment y acceder ?</h2>
          <p class="text-body-lg text-gray-600">
            Un parcours progressif pour beneficier du meilleur accompagnement.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <UiCard
            v-for="step in accessSteps"
            :key="step.title"
            variant="outlined"
          >
            <h3 class="text-heading-sm text-primary mb-2">{{ step.title }}</h3>
            <p class="text-body-sm text-gray-600">{{ step.description }}</p>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-20">
      <div class="container-padded text-center">
        <h2 class="text-heading-lg text-primary mb-4">
          Besoin d'un accompagnement personnalisé ?
        </h2>
        <p class="text-body-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Rejoignez nos hackathons ou contactez l'équipe pour acceder aux
          ressources adaptees a votre projet.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UiButton variant="secondary" size="lg" href="/hackathons">
            Voir les hackathons
          </UiButton>
          <UiButton
            variant="outline"
            size="lg"
            href="mailto:incubateur@groupeism.sn"
          >
            Nous contacter
          </UiButton>
        </div>
      </div>
    </section>
  </div>
</template>
