<script setup lang="ts">
import { mockMentors } from '~/data/mock'

useHead({
  title: 'Mentors - ISM Incubator',
  meta: [
    {
      name: 'description',
      content: 'Rencontrez les mentors de l\'incubateur ISM et beneficiez d\'un accompagnement expert pour vos projets.',
    },
  ],
})

const activeMentors = computed(() => mockMentors.filter(mentor => mentor.isActive))
const totalMentors = computed(() => mockMentors.length)
const expertiseCount = computed(() => {
  const expertise = mockMentors.flatMap(mentor => mentor.expertise)
  return new Set(expertise).size
})

const stats = computed(() => [
  { value: String(totalMentors.value), label: 'Mentors au total' },
  { value: String(activeMentors.value.length), label: 'Mentors actifs' },
  { value: String(expertiseCount.value), label: 'Domaines couverts' },
])

const mentorshipPrinciples = [
  {
    title: 'Orientation business',
    description: 'Des conseils pratiques pour structurer votre modele et votre strategie.',
  },
  {
    title: 'Accompagnement produit',
    description: 'Des retours concrets pour avancer sur le produit et la traction.',
  },
  {
    title: 'Connexion a l\'ecosysteme',
    description: 'Un reseau de professionnels pour accelerer votre croissance.',
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
            Mentors
          </h1>
          <p class="text-body-lg text-white/70">
            Des experts passionnes pour vous guider a chaque etape de votre parcours entrepreneurial.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12 bg-secondary/5">
      <div class="container-padded">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-display-sm text-secondary font-bold mb-1">{{ stat.value }}</div>
            <div class="text-body-sm text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mentors Grid -->
    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Nos mentors actifs</h2>
          <p class="text-body-lg text-gray-600">
            Une equipe multidisciplinaire pour repondre a vos besoins.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <UiCard v-for="mentor in activeMentors" :key="mentor.id" class="h-full">
            <div class="flex items-center gap-4 mb-4">
              <UiAvatar :name="mentor.name" size="lg" />
              <div>
                <h3 class="text-heading-sm text-primary">{{ mentor.name }}</h3>
                <p class="text-body-sm text-gray-500">{{ mentor.expertise.join(', ') }}</p>
              </div>
            </div>

            <p class="text-body-sm text-gray-600 mb-4">{{ mentor.bio }}</p>

            <div class="flex flex-wrap gap-2">
              <UiBadge
                v-for="tag in mentor.expertise"
                :key="tag"
                variant="secondary"
                size="sm"
              >
                {{ tag }}
              </UiBadge>
            </div>

            <div v-if="mentor.linkedInUrl" class="mt-4">
              <a
                :href="mentor.linkedInUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-secondary text-body-sm hover:underline"
              >
                Voir le profil LinkedIn
              </a>
            </div>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- Mentorship Principles -->
    <section class="py-12 lg:py-16 bg-neutral-background">
      <div class="container-padded">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-display-sm text-primary mb-4">Notre approche du mentorat</h2>
          <p class="text-body-lg text-gray-600">
            Un accompagnement clair, structure et oriente resultats.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <UiCard v-for="principle in mentorshipPrinciples" :key="principle.title" variant="outlined">
            <h3 class="text-heading-sm text-primary mb-2">{{ principle.title }}</h3>
            <p class="text-body-sm text-gray-600">{{ principle.description }}</p>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-20">
      <div class="container-padded text-center">
        <h2 class="text-heading-lg text-primary mb-4">
          Vous souhaitez devenir mentor ?
        </h2>
        <p class="text-body-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Partagez votre experience et accompagnez la prochaine generation d\'entrepreneurs.
        </p>
        <UiButton variant="secondary" size="lg" href="mailto:incubateur@groupeism.sn">
          Nous rejoindre
        </UiButton>
      </div>
    </section>
  </div>
</template>
