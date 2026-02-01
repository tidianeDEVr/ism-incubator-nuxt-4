<script setup lang="ts">
import { mockHackathons } from "~/data/mock";
import type { HackathonStatus } from "~/types";

const route = useRoute();
const slug = route.params.slug as string;

const hackathon = computed(() => {
  return mockHackathons.find((h) => h.slug === slug);
});

if (!hackathon.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Hackathon non trouve",
  });
}

useHead({
  title: `${hackathon.value?.title || "Hackathon"} - ISM Incubator`,
});

const statusConfig: Record<
  HackathonStatus,
  { label: string; variant: "success" | "warning" | "info" | "default" }
> = {
  draft: { label: "Brouillon", variant: "default" },
  upcoming: { label: "A venir", variant: "info" },
  active: { label: "En cours", variant: "success" },
  evaluation: { label: "Evaluation", variant: "warning" },
  completed: { label: "Termine", variant: "default" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

const canRegister = computed(() => {
  if (!hackathon.value) return false;
  const now = new Date();
  const regStart = new Date(hackathon.value.registrationStart);
  const regEnd = new Date(hackathon.value.registrationEnd);
  return now >= regStart && now <= regEnd;
});
</script>

<template>
  <div v-if="hackathon">
    <section class="bg-primary py-12 lg:py-20">
      <div class="container-padded">
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8"
        >
          <div class="max-w-2xl">
            <div class="flex items-center gap-3 mb-4">
              <UiBadge :variant="statusConfig[hackathon.status].variant" dot>
                {{ statusConfig[hackathon.status].label }}
              </UiBadge>
              <span class="text-white/60 text-body-sm">{{
                hackathon.category
              }}</span>
            </div>

            <h1 class="text-display-sm lg:text-display text-white mb-4">
              {{ hackathon.title }}
            </h1>

            <p class="text-body-lg text-white/70 mb-8">
              {{ hackathon.shortDescription }}
            </p>

            <div class="flex flex-wrap gap-6 text-white/80">
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-body-sm"
                  >{{ formatShortDate(hackathon.submissionStart) }} -
                  {{ formatShortDate(hackathon.submissionEnd) }}</span
                >
              </div>
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="text-body-sm"
                  >{{ hackathon.participantCount }} participants</span
                >
              </div>
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span class="text-body-sm"
                  >{{ hackathon.projectCount }} projets</span
                >
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-6 lg:p-8 shadow-modal w-full lg:w-auto lg:min-w-[320px]"
          >
            <div class="text-center mb-6">
              <div
                v-if="hackathon.prizes.length > 0"
                class="text-caption text-gray-500 mb-1"
              >
                A gagner
              </div>
              <div class="text-display-sm text-secondary font-bold">
                {{ hackathon.prizes[0]?.value }}
              </div>
            </div>

            <UiButton
              v-if="canRegister"
              variant="secondary"
              size="lg"
              full-width
              href="/register"
            >
              S'inscrire maintenant
            </UiButton>
            <UiButton
              v-else-if="hackathon.status === 'upcoming'"
              variant="outline"
              size="lg"
              full-width
              disabled
            >
              Inscriptions a venir
            </UiButton>
            <UiButton v-else variant="outline" size="lg" full-width disabled>
              Inscriptions fermees
            </UiButton>

            <p
              v-if="canRegister"
              class="text-caption text-gray-500 text-center mt-3"
            >
              Inscriptions jusqu'au
              {{ formatShortDate(hackathon.registrationEnd) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div class="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div class="lg:col-span-2 space-y-10">
            <div>
              <h2 class="text-heading text-primary mb-4">A propos</h2>
              <p class="text-body text-gray-600 whitespace-pre-line">
                {{ hackathon.description }}
              </p>
            </div>

            <div>
              <h2 class="text-heading text-primary mb-6">Calendrier</h2>
              <div class="space-y-4">
                <div
                  v-for="(step, index) in hackathon.steps"
                  :key="step.id"
                  class="flex gap-4"
                >
                  <div class="flex flex-col items-center">
                    <div
                      :class="[
                        'w-10 h-10 min-w-10 min-h-10 shrink-0 rounded-full flex items-center justify-center text-body font-semibold leading-none',
                        index === 0
                          ? 'bg-secondary text-white'
                          : 'bg-gray-100 text-gray-600',
                      ]"
                    >
                      {{ index + 1 }}
                    </div>
                    <div
                      v-if="index < hackathon.steps.length - 1"
                      class="w-0.5 h-full bg-gray-200 my-2"
                    />
                  </div>
                  <div class="flex-1 pb-8">
                    <h3 class="text-heading-sm text-primary mb-1">
                      {{ step.title }}
                    </h3>
                    <p class="text-body-sm text-gray-500 mb-2">
                      {{ formatShortDate(step.startDate) }}
                      <span v-if="step.startDate !== step.endDate">
                        - {{ formatShortDate(step.endDate) }}
                      </span>
                    </p>
                    <p class="text-body-sm text-gray-600">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="hackathon.prizes.length > 0">
              <h2 class="text-heading text-primary mb-6">Prix</h2>
              <div class="grid sm:grid-cols-3 gap-4">
                <UiCard
                  v-for="prize in hackathon.prizes"
                  :key="prize.position"
                  variant="outlined"
                  padding="md"
                  :class="prize.position === 1 ? 'border-secondary' : ''"
                >
                  <div class="text-center">
                    <div
                      :class="[
                        'w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center',
                        prize.position === 1
                          ? 'bg-secondary/10'
                          : 'bg-gray-100',
                      ]"
                    >
                      <svg
                        class="w-6 h-6"
                        :class="
                          prize.position === 1
                            ? 'text-secondary'
                            : 'text-gray-400'
                        "
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
                    </div>
                    <div class="text-body-sm text-gray-500 mb-1">
                      {{ prize.title }}
                    </div>
                    <div class="text-heading-sm text-primary font-bold mb-2">
                      {{ prize.value }}
                    </div>
                    <p class="text-caption text-gray-500">
                      {{ prize.description }}
                    </p>
                  </div>
                </UiCard>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <NuxtImg :src="hackathon.coverImage" class="w-full rounded-lg" />
            <UiCard>
              <h3 class="text-heading-sm text-primary mb-4">Dates cles</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="text-body-sm font-medium text-gray-900">
                      Inscriptions
                    </div>
                    <div class="text-caption text-gray-500">
                      {{ formatShortDate(hackathon.registrationStart) }} -
                      {{ formatShortDate(hackathon.registrationEnd) }}
                    </div>
                  </div>
                </div>
                <div class="flex justify-between items-start">
                  <div>
                    <div class="text-body-sm font-medium text-gray-900">
                      Hackathon
                    </div>
                    <div class="text-caption text-gray-500">
                      {{ formatShortDate(hackathon.submissionStart) }} -
                      {{ formatShortDate(hackathon.submissionEnd) }}
                    </div>
                  </div>
                </div>
                <div class="flex justify-between items-start">
                  <div>
                    <div class="text-body-sm font-medium text-gray-900">
                      Evaluation
                    </div>
                    <div class="text-caption text-gray-500">
                      {{ formatShortDate(hackathon.evaluationStart) }} -
                      {{ formatShortDate(hackathon.evaluationEnd) }}
                    </div>
                  </div>
                </div>
              </div>
            </UiCard>

            <UiCard>
              <h3 class="text-heading-sm text-primary mb-4">Partager</h3>
              <div class="flex gap-2">
                <button
                  class="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    class="w-5 h-5 mx-auto text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                  </svg>
                </button>
                <button
                  class="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    class="w-5 h-5 mx-auto text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                </button>
                <button
                  class="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    class="w-5 h-5 mx-auto text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </button>
              </div>
            </UiCard>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
