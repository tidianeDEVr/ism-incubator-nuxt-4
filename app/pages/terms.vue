<script setup lang="ts">
useHead({
  title: 'Conditions d\'utilisation - ISM Incubator',
  meta: [
    {
      name: 'description',
      content: 'Conditions d\'utilisation de la plateforme ISM Incubator.',
    },
  ],
})

const sections = [
  {
    title: 'Objet',
    paragraphs: [
      'Les presentes conditions encadrent l\'utilisation de la plateforme ISM Incubator.',
      'En utilisant nos services, vous acceptez ces conditions.',
    ],
  },
  {
    title: 'Acces au service',
    paragraphs: [
      'La creation d\'un compte est necessaire pour participer aux programmes.',
      'Vous vous engagez a fournir des informations exactes et a proteger vos identifiants.',
    ],
  },
  {
    title: 'Comportement attendu',
    paragraphs: [
      'Respectez les autres utilisateurs et les regles des hackathons.',
      'Toute utilisation illicite ou abusive peut entrainer la suspension du compte.',
    ],
  },
  {
    title: 'Contenus et projets',
    paragraphs: [
      'Vous restez proprietaire de vos contenus et projets.',
      'Vous accordez a l\'ISM Incubator une licence non exclusive pour presenter vos projets dans le cadre des programmes.',
    ],
  },
  {
    title: 'Disponibilite du service',
    paragraphs: [
      'Nous mettons tout en oeuvre pour assurer la disponibilite de la plateforme.',
      'Des interruptions temporaires peuvent survenir pour maintenance ou mises a jour.',
    ],
  },
  {
    title: 'Responsabilite',
    paragraphs: [
      'L\'ISM Incubator ne peut etre tenu responsable des dommages indirects lies a l\'usage de la plateforme.',
      'Les informations publiees sont fournies a titre indicatif.',
    ],
  },
  {
    title: 'Modification des conditions',
    paragraphs: [
      'Les conditions peuvent evoluer pour refleter nos services.',
      'L\'utilisation continue de la plateforme vaut acceptation des conditions mises a jour.',
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
            Conditions d\'utilisation
          </h1>
          <p class="text-body-lg text-white/70">
            Les regles qui encadrent l\'usage de la plateforme ISM Incubator.
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
