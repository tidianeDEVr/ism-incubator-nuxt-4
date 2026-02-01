<script setup lang="ts">
import { mockAchievements } from '~/data/mock'

useHead({
  title: 'Realisations - ISM Incubator',
  meta: [
    {
      name: 'description',
      content: 'Decouvrez les projets gagnants et les success stories de l\'incubateur ISM.',
    },
  ],
})

const selectedYear = ref<number | 'all'>('all')

const years = computed(() => {
  const uniqueYears = [...new Set(mockAchievements.map(a => a.year))].sort((a, b) => b - a)
  return uniqueYears
})

const filteredAchievements = computed(() => {
  if (selectedYear.value === 'all') {
    return mockAchievements
  }
  return mockAchievements.filter(a => a.year === selectedYear.value)
})

function getPositionLabel(position: number) {
  const labels: Record<number, string> = {
    1: '1er Prix',
    2: '2eme Prix',
    3: '3eme Prix',
  }
  return labels[position] || `${position}e Prix`
}

function getPositionColor(position: number) {
  const colors: Record<number, string> = {
    1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    2: 'bg-gray-100 text-gray-800 border-gray-200',
    3: 'bg-orange-100 text-orange-800 border-orange-200',
  }
  return colors[position] || 'bg-gray-100 text-gray-800 border-gray-200'
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary py-12 lg:py-16">
      <div class="container-padded">
        <div class="max-w-2xl">
          <h1 class="text-display-sm text-white mb-4">
            Success Stories
          </h1>
          <p class="text-body-lg text-white/70">
            Decouvrez les projets qui ont marque nos hackathons et inspire la communaute entrepreneuriale de l'ISM.
          </p>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-6 border-b border-neutral-border bg-white sticky top-16 lg:top-20 z-40">
      <div class="container-padded">
        <div class="flex items-center gap-4">
          <span class="text-body-sm text-gray-500">Filtrer par annee:</span>
          <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              :class="[
                'px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors duration-200',
                selectedYear === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="selectedYear = 'all'"
            >
              Toutes
            </button>
            <button
              v-for="year in years"
              :key="year"
              :class="[
                'px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors duration-200',
                selectedYear === year
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
              @click="selectedYear = year"
            >
              {{ year }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements List -->
    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <UiCard
            v-for="achievement in filteredAchievements"
            :key="achievement.id"
            padding="none"
            class="overflow-hidden group"
          >
            <!-- Image -->
            <div class="relative h-48 bg-gradient-to-br from-secondary/20 to-primary/20">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 rounded-2xl bg-white shadow-card flex items-center justify-center">
                  <svg class="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>

              <!-- Position & Year -->
              <div class="absolute top-4 left-4 flex gap-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getPositionColor(achievement.position)]">
                  {{ getPositionLabel(achievement.position) }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                  {{ achievement.year }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="text-caption text-secondary font-medium mb-2">
                {{ achievement.hackathonTitle }}
              </div>

              <h3 class="text-heading-sm text-primary mb-2 group-hover:text-secondary transition-colors">
                {{ achievement.projectTitle }}
              </h3>

              <p class="text-body-sm text-gray-600 mb-4 line-clamp-3">
                {{ achievement.description }}
              </p>

              <!-- Team -->
              <div class="pt-4 border-t border-neutral-border">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex -space-x-2">
                      <div
                        v-for="(member, index) in achievement.members.slice(0, 4)"
                        :key="index"
                        class="w-8 h-8 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center"
                        :title="member.name"
                      >
                        <span class="text-xs font-medium text-primary">
                          {{ member.name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="text-body-sm font-medium text-gray-900">{{ achievement.teamName }}</div>
                      <div class="text-caption text-gray-500">{{ achievement.members.length }} membres</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiCard>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredAchievements.length === 0"
          class="text-center py-16"
        >
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 class="text-heading-sm text-gray-900 mb-2">
            Aucune realisation trouvee
          </h3>
          <p class="text-body text-gray-500">
            Aucun projet pour cette annee
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-20 bg-neutral-background">
      <div class="container-padded text-center">
        <h2 class="text-heading-lg text-primary mb-4">
          Envie d'ecrire la prochaine success story ?
        </h2>
        <p class="text-body-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Participez a notre prochain hackathon et transformez votre idee en projet gagnant.
        </p>
        <UiButton variant="secondary" size="lg" href="/hackathons">
          Decouvrir les hackathons
        </UiButton>
      </div>
    </section>
  </div>
</template>
