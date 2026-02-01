<script setup lang="ts">
useHead({
  title: "A propos - ISM Incubator",
  meta: [
    {
      name: "description",
      content:
        "Decouvrez l'incubateur de l'ISM Dakar, notre mission et notre equipe dediee a l'accompagnement des entrepreneurs.",
    },
  ],
});

const values = [
  {
    title: "Innovation",
    description:
      "Nous encourageons la creativite et l'experimentation pour developper des solutions novatrices.",
    icon: "lightbulb",
  },
  {
    title: "Excellence",
    description:
      "Nous visons l'excellence dans l'accompagnement et le developpement des projets.",
    icon: "star",
  },
  {
    title: "Collaboration",
    description:
      "Nous croyons en la force du collectif et du partage de connaissances.",
    icon: "users",
  },
  {
    title: "Impact",
    description:
      "Nous soutenons les projets a fort impact social et economique pour l'Afrique.",
    icon: "globe",
  },
];

const team = [
  {
    name: "Dr. Mamadou Diallo",
    role: "Directeur de l'Incubateur",
    initials: "MD",
  },
  { name: "Fatou Ndiaye", role: "Responsable Programme", initials: "FN" },
  { name: "Ousmane Ba", role: "Coordinateur Hackathons", initials: "OB" },
  { name: "Aminata Sow", role: "Chargee de Mentorat", initials: "AS" },
];

const stats = [
  { value: "500+", label: "Entrepreneurs accompagnes" },
  { value: "50+", label: "Startups incubees" },
  { value: "20+", label: "Hackathons organises" },
  { value: "30+", label: "Mentors actifs" },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary py-12 lg:py-20">
      <div class="container-padded">
        <div class="max-w-3xl">
          <h1 class="text-display-sm lg:text-display text-white mb-6">
            L'incubateur qui transforme les idees en succes
          </h1>
          <p class="text-body-lg text-white/70">
            Depuis sa creation, l'incubateur de l'ISM accompagne les porteurs de
            projets innovants dans leur parcours entrepreneurial. Notre mission
            : faire emerger la prochaine generation d'entrepreneurs africains.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12 bg-secondary/5">
      <div class="container-padded">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-display-sm text-secondary font-bold mb-1">
              {{ stat.value }}
            </div>
            <div class="text-body-sm text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-16 lg:py-24">
      <div class="container-padded">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-display-sm text-primary mb-6">Notre Mission</h2>
            <div class="space-y-4 text-body text-gray-600">
              <p>
                L'incubateur de l'Institut Superieur de Management (ISM) a pour
                mission d'accompagner les etudiants, diplomes et professionnels
                dans la concretisation de leurs projets entrepreneuriaux.
              </p>
              <p>
                Nous offrons un ecosysteme complet comprenant des programmes de
                formation, un mentorat personnalise, des hackathons innovants et
                un accompagnement vers le financement.
              </p>
              <p>
                Notre objectif est de creer un pont entre le monde academique et
                le monde des affaires, en preparant les entrepreneurs de demain
                aux defis du marche africain et international.
              </p>
            </div>
          </div>
          <div class="relative">
            <div
              class="aspect-square rounded-3xl overflow-hidden"
              style="
                background-image: url(https://www.groupeism.sn/sites/default/files/friends-look-on-laptop_925x.jpg);
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
              "
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 lg:py-24 bg-neutral-background">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Nos Valeurs</h2>
          <p class="text-body-lg text-gray-600">
            Les principes qui guident notre action au quotidien
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <UiCard v-for="value in values" :key="value.title">
            <div
              class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4"
            >
              <svg
                v-if="value.icon === 'lightbulb'"
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
              <svg
                v-if="value.icon === 'star'"
                class="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <svg
                v-if="value.icon === 'users'"
                class="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                v-if="value.icon === 'globe'"
                class="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-heading-sm text-primary mb-2">{{ value.title }}</h3>
            <p class="text-body-sm text-gray-600">{{ value.description }}</p>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-16 lg:py-24">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Notre Equipe</h2>
          <p class="text-body-lg text-gray-600">
            Des professionnels passionnes au service de votre reussite
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <UiCard v-for="member in team" :key="member.name" class="text-center">
            <div
              class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-primary font-bold text-xl">{{
                member.initials
              }}</span>
            </div>
            <h3 class="text-heading-sm text-primary mb-1">{{ member.name }}</h3>
            <p class="text-body-sm text-gray-500">{{ member.role }}</p>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 lg:py-24 bg-primary">
      <div class="container-padded text-center">
        <h2 class="text-display-sm text-white mb-4">
          Envie d'en savoir plus ?
        </h2>
        <p class="text-body-lg text-white/70 mb-8 max-w-xl mx-auto">
          Contactez notre equipe pour decouvrir comment l'incubateur peut vous
          accompagner dans votre projet.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UiButton
            variant="secondary"
            size="lg"
            href="mailto:incubateur@groupeism.sn"
          >
            Nous contacter
          </UiButton>
          <UiButton
            variant="ghost"
            size="lg"
            href="/hackathons"
            class="!text-white hover:!bg-white/10"
          >
            Voir les hackathons
          </UiButton>
        </div>
      </div>
    </section>
  </div>
</template>
