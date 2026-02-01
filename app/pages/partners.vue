<script setup lang="ts">
useHead({
  title: 'Partenaires - ISM Incubator',
  meta: [
    {
      name: 'description',
      content: 'Decouvrez les partenariats de l\'incubateur ISM et les opportunites de collaboration.',
    },
  ],
})

const partnerTypes = [
  {
    title: 'Entreprises',
    description: 'Co-construisez des challenges et identifiez des talents innovants.',
    icon: 'users',
  },
  {
    title: 'Institutions',
    description: 'Soutenez l\'entrepreneuriat et l\'impact social au Senegal.',
    icon: 'globe',
  },
  {
    title: 'Ecoles & Universites',
    description: 'Valorisez l\'innovation academique et l\'employabilite des etudiants.',
    icon: 'star',
  },
]

const partnerBenefits = [
  {
    title: 'Visibilite',
    description: 'Une presence forte lors des hackathons, demo days et evenements ISM.',
  },
  {
    title: 'Acces aux talents',
    description: 'Identifiez des profils prometteurs pour vos projets et vos equipes.',
  },
  {
    title: 'Impact',
    description: 'Contribuez a l\'ecosysteme entrepreneurial et a l\'innovation locale.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary py-12 lg:py-16">
      <div class="container-padded">
        <div class="max-w-2xl">
          <h1 class="text-display-sm text-white mb-4">
            Partenaires
          </h1>
          <p class="text-body-lg text-white/70">
            Nous collaborons avec des acteurs engages pour soutenir l\'innovation et l\'entrepreneuriat.
          </p>
        </div>
      </div>
    </section>

    <!-- Partner Types -->
    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Types de partenariats</h2>
          <p class="text-body-lg text-gray-600">
            Des collaborations adaptees a chaque acteur de l\'ecosysteme.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <UiCard v-for="partner in partnerTypes" :key="partner.title">
            <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <!-- Users -->
              <svg
                v-if="partner.icon === 'users'"
                class="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <!-- Globe -->
              <svg
                v-if="partner.icon === 'globe'"
                class="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <!-- Star -->
              <svg
                v-if="partner.icon === 'star'"
                class="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 class="text-heading-sm text-primary mb-2">{{ partner.title }}</h3>
            <p class="text-body-sm text-gray-600">{{ partner.description }}</p>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="py-12 lg:py-16 bg-neutral-background">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Pourquoi devenir partenaire ?</h2>
          <p class="text-body-lg text-gray-600">
            Des benefices concrets pour vos equipes et votre marque.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <UiCard v-for="benefit in partnerBenefits" :key="benefit.title" variant="outlined">
            <h3 class="text-heading-sm text-primary mb-2">{{ benefit.title }}</h3>
            <p class="text-body-sm text-gray-600">{{ benefit.description }}</p>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-20">
      <div class="container-padded text-center">
        <h2 class="text-heading-lg text-primary mb-4">
          Discutons d\'un partenariat
        </h2>
        <p class="text-body-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Ecrivez-nous pour definir un format de collaboration adapte a vos objectifs.
        </p>
        <UiButton variant="secondary" size="lg" href="mailto:incubateur@groupeism.sn">
          Nous contacter
        </UiButton>
      </div>
    </section>
  </div>
</template>
