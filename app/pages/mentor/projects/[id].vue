<script setup lang="ts">
import { mockProjects, mockHackathons } from "~/data/mock";
import type { Project, ProjectStatus } from "~/types";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();

const project = computed(() =>
  mockProjects.find((p) => p.id === route.params.id),
);

useHead({
  title: computed(() =>
    project.value?.title ? `${project.value.title} - Evaluation` : "Projet",
  ),
});

// Evaluation criteria
const criteria = ref([
  {
    id: "innovation",
    label: "Innovation",
    description: "Originalite et caractere innovant de la solution",
    score: 0,
    weight: 25,
  },
  {
    id: "feasibility",
    label: "Faisabilite",
    description: "Realisme technique et viabilite du projet",
    score: 0,
    weight: 25,
  },
  {
    id: "impact",
    label: "Impact",
    description: "Potentiel d'impact social ou economique",
    score: 0,
    weight: 20,
  },
  {
    id: "presentation",
    label: "Presentation",
    description: "Qualite du pitch et des livrables",
    score: 0,
    weight: 15,
  },
  {
    id: "team",
    label: "Equipe",
    description: "Competences et complementarite de l'equipe",
    score: 0,
    weight: 15,
  },
]);

const feedback = ref("");
const isSubmitting = ref(false);
const showConfirmation = ref(false);

// Computed
const totalScore = computed(() => {
  const weightedSum = criteria.value.reduce(
    (sum, c) => sum + c.score * c.weight,
    0,
  );
  const totalWeight = criteria.value.reduce((sum, c) => sum + c.weight, 0);
  return Math.round((weightedSum / totalWeight) * 10) / 10;
});

const canSubmit = computed(
  () =>
    criteria.value.every((c) => c.score > 0) &&
    feedback.value.trim().length >= 50,
);

function getHackathonTitle(hackathonId: string) {
  return mockHackathons.find((h) => h.id === hackathonId)?.title || "Inconnu";
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function submitEvaluation() {
  if (!canSubmit.value) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  isSubmitting.value = false;
  showConfirmation.value = true;

  // Redirect after delay
  setTimeout(() => {
    router.push("/mentor/projects");
  }, 2000);
}

const statusConfig: Record<ProjectStatus, { label: string; class: string }> = {
  draft: { label: "Brouillon", class: "bg-gray-100 text-gray-700" },
  submitted: { label: "Soumis", class: "bg-blue-100 text-blue-700" },
  evaluation: { label: "En evaluation", class: "bg-amber-100 text-amber-700" },
  finalist: { label: "Finaliste", class: "bg-purple-100 text-purple-700" },
  winner: { label: "Gagnant", class: "bg-green-100 text-green-700" },
  rejected: { label: "Rejete", class: "bg-red-100 text-red-700" },
};
</script>

<template>
  <div v-if="project">
    <div class="flex items-center gap-2 text-body-sm text-gray-500 mb-6">
      <NuxtLink to="/mentor/projects" class="hover:text-primary">
        Mes Projets
      </NuxtLink>
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
      <span class="text-gray-900">{{ project.title }}</span>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UiCard>
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 class="text-heading-lg text-primary mb-1">
                {{ project.title }}
              </h1>
              <p class="text-body text-secondary">
                {{ getHackathonTitle(project.hackathonId) }}
              </p>
            </div>
            <span
              :class="[
                'px-3 py-1.5 rounded-full text-sm font-medium',
                statusConfig[project.status].class,
              ]"
            >
              {{ statusConfig[project.status].label }}
            </span>
          </div>

          <p class="text-body text-gray-600 mb-6">{{ project.description }}</p>

          <div class="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-body-sm font-semibold text-gray-900 mb-2">
                Probleme identifie
              </h3>
              <p class="text-body-sm text-gray-600">
                {{ project.problemStatement }}
              </p>
            </div>
            <div>
              <h3 class="text-body-sm font-semibold text-gray-900 mb-2">
                Solution proposee
              </h3>
              <p class="text-body-sm text-gray-600">{{ project.solution }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-body-sm font-semibold text-gray-900 mb-2">
              Technologies
            </h3>
            <div class="flex flex-wrap gap-2">
              <UiBadge
                v-for="tech in project.techStack"
                :key="tech"
                variant="default"
                size="sm"
              >
                {{ tech }}
              </UiBadge>
            </div>
          </div>

          <div
            v-if="
              project.pitchDeckUrl ||
              project.demoVideoUrl ||
              project.sourceCodeUrl
            "
            class="pt-4 border-t border-neutral-border"
          >
            <h3 class="text-body-sm font-semibold text-gray-900 mb-3">
              Ressources
            </h3>
            <div class="flex flex-wrap gap-3">
              <a
                v-if="project.pitchDeckUrl"
                :href="project.pitchDeckUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-body-sm text-gray-700 transition-colors"
              >
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Pitch Deck
              </a>
              <a
                v-if="project.demoVideoUrl"
                :href="project.demoVideoUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-body-sm text-gray-700 transition-colors"
              >
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Demo Video
              </a>
              <a
                v-if="project.sourceCodeUrl"
                :href="project.sourceCodeUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-body-sm text-gray-700 transition-colors"
              >
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Code Source
              </a>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Equipe</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="member in project.members"
              :key="member.userId"
              class="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
            >
              <UiAvatar :name="member.name" size="lg" />
              <div>
                <div class="text-body font-medium text-gray-900">
                  {{ member.name }}
                  <UiBadge
                    v-if="member.isLead"
                    variant="secondary"
                    size="sm"
                    class="ml-2"
                  >
                    Lead
                  </UiBadge>
                </div>
                <div class="text-body-sm text-gray-500">{{ member.role }}</div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>

      <div class="space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Evaluation</h2>

          <div
            v-if="showConfirmation"
            class="p-4 bg-green-50 border border-green-200 rounded-lg mb-4"
          >
            <div class="flex items-center gap-3">
              <svg
                class="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="text-body-sm font-medium text-green-800">
                  Evaluation soumise
                </p>
                <p class="text-caption text-green-600">
                  Redirection en cours...
                </p>
              </div>
            </div>
          </div>

          <div class="text-center p-4 bg-primary/5 rounded-lg mb-6">
            <div class="text-display-sm text-primary font-bold">
              {{ totalScore }}/10
            </div>
            <div class="text-body-sm text-gray-500">Score global</div>
          </div>

          <div class="space-y-6">
            <div v-for="criterion in criteria" :key="criterion.id">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <label class="text-body-sm font-medium text-gray-900">
                    {{ criterion.label }}
                  </label>
                  <span class="text-caption text-gray-400 ml-2"
                    >({{ criterion.weight }}%)</span
                  >
                </div>
                <span class="text-body-sm font-semibold text-primary"
                  >{{ criterion.score }}/10</span
                >
              </div>
              <p class="text-caption text-gray-500 mb-2">
                {{ criterion.description }}
              </p>
              <input
                v-model.number="criterion.score"
                type="range"
                min="0"
                max="10"
                step="1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div class="flex justify-between text-caption text-gray-400 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <h3 class="text-body font-semibold text-gray-900 mb-3">
            Commentaires
          </h3>
          <UiTextarea
            v-model="feedback"
            placeholder="Vos commentaires sur le projet (minimum 50 caracteres)..."
            rows="5"
          />
          <div class="flex justify-between mt-2">
            <span
              :class="[
                'text-caption',
                feedback.length >= 50 ? 'text-green-600' : 'text-gray-400',
              ]"
            >
              {{ feedback.length }}/50 caracteres min.
            </span>
          </div>
        </UiCard>

        <UiButton
          :disabled="!canSubmit || isSubmitting"
          :loading="isSubmitting"
          full-width
          @click="submitEvaluation"
        >
          Soumettre l'evaluation
        </UiButton>

        <p class="text-caption text-center text-gray-500">
          Une fois soumise, l'evaluation ne peut plus etre modifiee.
        </p>
      </div>
    </div>
  </div>

  <UiCard v-else class="text-center py-12">
    <svg
      class="w-16 h-16 mx-auto mb-4 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p class="text-body text-gray-500 mb-4">Projet non trouve</p>
    <UiButton variant="outline" href="/mentor/projects">
      Retour aux projets
    </UiButton>
  </UiCard>
</template>
