<script setup lang="ts">
useHead({
  title: 'Mentions legales - ISM Incubator',
  meta: [
    {
      name: 'description',
      content: 'Informations legales relatives au site de l\'incubateur ISM.',
    },
  ],
})

const sections = [
  {
    title: 'Editeur du site',
    paragraphs: [
      'ISM Incubateur - Groupe ISM',
      'Dakar, Senegal',
      'Email: incubateur@groupeism.sn',
    ],
  },
  {
    title: 'Directeur de publication',
    paragraphs: [
      'La direction de l\'ISM Incubator.',
    ],
  },
  {
    title: 'Hebergement',
    paragraphs: [
      'Ce site est heberge par un prestataire cloud securise.',
    ],
  },
  {
    title: 'Propriete intellectuelle',
    paragraphs: [
      'L\'ensemble des contenus (textes, visuels, marques, logos) est protege.',
      'Toute reproduction ou reutilisation est soumise a autorisation prealable.',
    ],
  },
  {
    title: 'Responsabilite',
    paragraphs: [
      'Les informations sont fournies a titre indicatif et peuvent evoluer.',
      'L\'ISM Incubator ne saurait etre tenu responsable des erreurs ou omissions.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      'Pour toute question, contactez-nous a incubateur@groupeism.sn.',
    ],
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
            Mentions legales
          </h1>
          <p class="text-body-lg text-white/70">
            Informations juridiques concernant le site de l\'incubateur ISM.
          </p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div class="max-w-3xl space-y-8">
          <div v-for="section in sections" :key="section.title">
            <h2 class="text-heading text-primary mb-3">{{ section.title }}</h2>
            <div class="space-y-2">
              <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-body text-gray-600">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
