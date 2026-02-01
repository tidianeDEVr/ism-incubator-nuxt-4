<script setup lang="ts">
const resources = [
  {
    title: "Guides pratiques",
    description: "Methodes et checklists pour structurer votre projet.",
  },
  {
    title: "Templates",
    description: "Business model, pitch deck et plan financier.",
  },
  {
    title: "Outils",
    description: "Ressources pour prototyper et tester rapidement.",
  },
  {
    title: "Mentorat",
    description: "Acces aux conseils d'experts et retours terrain.",
  },
]
</script>

<template>
  <section class="py-16 lg:py-24 bg-neutral-background">
    <div class="container-padded">
      <div class="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
        <div>
          <h2 class="text-display-sm text-primary mb-4">
            Ressources pour accelerer votre lancement
          </h2>
          <p class="text-body-lg text-gray-600 mb-6">
            Une bibliotheque d'outils et de contenus pour passer de l'idee a un
            projet solide, plus vite et avec moins d'incertitude.
          </p>
          <UiButton variant="outline" size="lg" href="/resources">
            Explorer les ressources
          </UiButton>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <UiCard
            v-for="resource in resources"
            :key="resource.title"
            class="p-5"
          >
            <h3 class="text-heading-sm text-primary mb-2">
              {{ resource.title }}
            </h3>
            <p class="text-body-sm text-gray-600">
              {{ resource.description }}
            </p>
          </UiCard>
        </div>
      </div>
    </div>
  </section>
</template>
