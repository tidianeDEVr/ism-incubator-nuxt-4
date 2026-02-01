<script setup lang="ts">
import { mockAchievements } from "~/data/mock";

// Show top 4 achievements
const displayedAchievements = computed(() => {
  return mockAchievements.filter((a) => a.position === 1).slice(0, 4);
});

function getPositionLabel(position: number) {
  const labels: Record<number, string> = {
    1: "1er Prix",
    2: "2eme Prix",
    3: "3eme Prix",
  };
  return labels[position] || `${position}e Prix`;
}
</script>

<template>
  <section class="py-16 lg:py-24 bg-neutral-background">
    <div class="container-padded">
      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
      >
        <div>
          <h2 class="text-display-sm text-primary mb-2">Success Stories</h2>
          <p class="text-body-lg text-gray-600">
            Decouvrez les projets qui ont marque nos hackathons
          </p>
        </div>
        <UiButton variant="outline" href="/achievements">
          Toutes les realisations
        </UiButton>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="achievement in displayedAchievements"
          :key="achievement.id"
          class="group"
        >
          <UiCard
            variant="default"
            padding="none"
            hoverable
            class="overflow-hidden"
          >
            <div class="relative h-40 bg-primary/5 overflow-hidden">
              <div
                class="absolute inset-0 bg-cover bg-top bg-no-repeat"
                :style="{ backgroundImage: `url(${achievement.image})` }"
              />

              <div class="absolute top-3 left-3">
                <UiBadge variant="secondary" size="sm">
                  {{ getPositionLabel(achievement.position) }}
                </UiBadge>
              </div>
            </div>

            <div class="p-5">
              <div class="text-caption text-secondary font-medium mb-1">
                {{ achievement.hackathonTitle }}
              </div>
              <h3
                class="text-heading-sm text-primary mb-2 group-hover:text-secondary transition-colors duration-200"
              >
                {{ achievement.projectTitle }}
              </h3>
              <p class="text-body-sm text-gray-600 line-clamp-2 mb-4">
                {{ achievement.description }}
              </p>

              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <div
                    v-for="(member, index) in achievement.members.slice(0, 3)"
                    :key="index"
                    class="w-7 h-7 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center"
                  >
                    <span class="text-xs font-medium text-primary">
                      {{ member.name.charAt(0) }}
                    </span>
                  </div>
                  <div
                    v-if="achievement.members.length > 3"
                    class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"
                  >
                    <span class="text-xs font-medium text-gray-500">
                      +{{ achievement.members.length - 3 }}
                    </span>
                  </div>
                </div>
                <span class="text-caption text-gray-500">
                  {{ achievement.teamName }}
                </span>
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </div>
  </section>
</template>
