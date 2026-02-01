<script setup lang="ts">
useHead({
  title: "Confidentialite - ISM Incubator",
  meta: [
    {
      name: "description",
      content:
        "Politique de confidentialite et gestion des donnees des utilisateurs de l'ISM Incubator.",
    },
  ],
});

const sections = [
  {
    title: "Donnees collectees",
    paragraphs: [
      "Nous collectons les informations que vous fournissez (nom, email, profil, projet).",
      "Des donnees d'usage peuvent aussi etre collecte pour ameliorer la plateforme.",
    ],
  },
  {
    title: "Utilisation des donnees",
    paragraphs: [
      "Créer et gerer votre compte, organiser les hackathons et vous accompagner.",
      "Communiquer avec vous a propos des programmes et des evenements.",
    ],
  },
  {
    title: "Partage",
    paragraphs: [
      "Les donnees peuvent etre partagees avec les mentors et partenaires uniquement si necessaire.",
      "Nous ne vendons pas vos donnees personnelles.",
    ],
  },
  {
    title: "Conservation",
    paragraphs: [
      "Les donnees sont conservees le temps necessaire au suivi des programmes et aux obligations legales.",
    ],
  },
  {
    title: "Securite",
    paragraphs: [
      "Nous mettons en place des mesures techniques et organisationnelles pour proteger vos donnees.",
    ],
  },
  {
    title: "Vos droits",
    paragraphs: [
      "Vous pouvez demander l'acces, la rectification ou la suppression de vos donnees.",
      "Pour exercer vos droits, contactez-nous a incubateur@groupeism.sn.",
    ],
  },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary py-12 lg:py-16">
      <div class="container-padded">
        <div class="max-w-2xl">
          <h1 class="text-display-sm text-white mb-4">Confidentialite</h1>
          <p class="text-body-lg text-white/70">
            Cette page explique comment nous collectons et utilisons vos
            donnees.
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
              <p
                v-for="paragraph in section.paragraphs"
                :key="paragraph"
                class="text-body text-gray-600"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
