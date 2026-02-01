<script setup lang="ts">
import { mockProjects, mockHackathons, mockMentors } from "~/data/mock";
import type { ProjectStatus } from "~/types";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();

const project = computed(() =>
  mockProjects.find((p) => p.id === route.params.id),
);

const hackathon = computed(() =>
  project.value
    ? mockHackathons.find((h) => h.id === project.value!.hackathonId)
    : null,
);

const mentor = computed(() =>
  project.value?.assignedMentorId
    ? mockMentors.find((m) => m.id === project.value!.assignedMentorId)
    : null,
);

useHead({
  title: computed(() => project.value?.title || "Projet"),
});

// State
const isEditing = ref(false);
const isSubmitting = ref(false);
const activeTab = ref("overview");

const tabs = [
  { id: "overview", label: "Apercu" },
  { id: "edit", label: "Modifier" },
  { id: "team", label: "Equipe" },
];

// Form state
const form = ref({
  title: "",
  description: "",
  problemStatement: "",
  solution: "",
  techStack: [] as string[],
  pitchDeckUrl: "",
  demoVideoUrl: "",
  sourceCodeUrl: "",
});

const techInput = ref("");

// Initialize form with project data
watch(
  project,
  (p) => {
    if (p) {
      form.value = {
        title: p.title,
        description: p.description,
        problemStatement: p.problemStatement,
        solution: p.solution,
        techStack: [...p.techStack],
        pitchDeckUrl: p.pitchDeckUrl || "",
        demoVideoUrl: p.demoVideoUrl || "",
        sourceCodeUrl: p.sourceCodeUrl || "",
      };
    }
  },
  { immediate: true },
);

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addTech() {
  const trimmed = techInput.value.trim();
  if (trimmed && !form.value.techStack.includes(trimmed)) {
    form.value.techStack.push(trimmed);
    techInput.value = "";
  }
}

function removeTech(index: number) {
  form.value.techStack.splice(index, 1);
}

async function saveProject() {
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  isSubmitting.value = false;
  activeTab.value = "overview";
}

async function submitProject() {
  if (!project.value || project.value.status !== "draft") return;

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In real app, this would update the project status
  isSubmitting.value = false;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; class: string; description: string }
> = {
  draft: {
    label: "Brouillon",
    class: "bg-gray-100 text-gray-700",
    description: "Completez votre projet et soumettez-le",
  },
  submitted: {
    label: "Soumis",
    class: "bg-blue-100 text-blue-700",
    description: "Votre projet est en attente d'evaluation",
  },
  evaluation: {
    label: "En evaluation",
    class: "bg-amber-100 text-amber-700",
    description: "Les mentors evaluent votre projet",
  },
  finalist: {
    label: "Finaliste",
    class: "bg-purple-100 text-purple-700",
    description: "Felicitations! Preparez-vous pour la finale",
  },
  winner: {
    label: "Gagnant",
    class: "bg-green-100 text-green-700",
    description: "Bravo! Vous avez gagne ce hackathon!",
  },
  rejected: {
    label: "Non retenu",
    class: "bg-red-100 text-red-700",
    description: "Merci pour votre participation",
  },
};

const pipelineSteps = [
  "draft",
  "submitted",
  "evaluation",
  "finalist",
  "winner",
];
</script>

<template>
  <div v-if="project">
    <div class="flex items-center gap-2 text-body-sm text-gray-500 mb-6">
      <NuxtLink to="/participant/projects" class="hover:text-primary">
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

    <div
      class="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6"
    >
      <div>
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-heading-lg text-primary">{{ project.title }}</h1>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              statusConfig[project.status].class,
            ]"
          >
            {{ statusConfig[project.status].label }}
          </span>
        </div>
        <p class="text-body text-gray-500">
          {{ hackathon?.title }} &bull; Soumis le
          {{ formatDate(project.submittedAt) }}
        </p>
      </div>
      <div v-if="project.status === 'draft'" class="flex gap-3">
        <UiButton variant="outline" @click="activeTab = 'edit'">
          Modifier
        </UiButton>
        <UiButton :loading="isSubmitting" @click="submitProject">
          Soumettre le projet
        </UiButton>
      </div>
    </div>

    <UiCard class="mb-6">
      <div class="flex items-center justify-between">
        <template v-for="(step, index) in pipelineSteps" :key="step">
          <div class="flex flex-col items-center">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                pipelineSteps.indexOf(project.status) >= index
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400',
              ]"
            >
              <svg
                v-if="pipelineSteps.indexOf(project.status) > index"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="text-caption text-gray-500 mt-2 hidden sm:block">
              {{ statusConfig[step as ProjectStatus].label }}
            </span>
          </div>
          <div
            v-if="index < pipelineSteps.length - 1"
            :class="[
              'flex-1 h-1 mx-2',
              pipelineSteps.indexOf(project.status) > index
                ? 'bg-primary'
                : 'bg-gray-200',
            ]"
          />
        </template>
      </div>
      <p class="text-center text-body-sm text-gray-600 mt-4">
        {{ statusConfig[project.status].description }}
      </p>
    </UiCard>

    <UiTabs v-model="activeTab" :tabs="tabs" variant="underline">
      <template #overview>
        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <UiCard>
              <h2 class="text-heading-sm text-primary mb-4">Description</h2>
              <p class="text-body text-gray-600 whitespace-pre-line">
                {{ project.description }}
              </p>
            </UiCard>

            <div class="grid sm:grid-cols-2 gap-6">
              <UiCard>
                <h3 class="text-body font-semibold text-gray-900 mb-2">
                  Probleme identifie
                </h3>
                <p class="text-body-sm text-gray-600">
                  {{ project.problemStatement }}
                </p>
              </UiCard>
              <UiCard>
                <h3 class="text-body font-semibold text-gray-900 mb-2">
                  Solution proposee
                </h3>
                <p class="text-body-sm text-gray-600">{{ project.solution }}</p>
              </UiCard>
            </div>

            <UiCard>
              <h3 class="text-body font-semibold text-gray-900 mb-3">
                Technologies
              </h3>
              <div class="flex flex-wrap gap-2">
                <UiBadge
                  v-for="tech in project.techStack"
                  :key="tech"
                  variant="default"
                >
                  {{ tech }}
                </UiBadge>
              </div>
            </UiCard>

            <UiCard
              v-if="
                project.pitchDeckUrl ||
                project.demoVideoUrl ||
                project.sourceCodeUrl
              "
            >
              <h3 class="text-body font-semibold text-gray-900 mb-3">
                Ressources
              </h3>
              <div class="space-y-2">
                <a
                  v-if="project.pitchDeckUrl"
                  :href="project.pitchDeckUrl"
                  target="_blank"
                  class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    class="w-6 h-6 text-gray-500"
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
                  <span class="text-body-sm text-gray-700">Pitch Deck</span>
                </a>
                <a
                  v-if="project.demoVideoUrl"
                  :href="project.demoVideoUrl"
                  target="_blank"
                  class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    class="w-6 h-6 text-gray-500"
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
                  <span class="text-body-sm text-gray-700">Video Demo</span>
                </a>
                <a
                  v-if="project.sourceCodeUrl"
                  :href="project.sourceCodeUrl"
                  target="_blank"
                  class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    class="w-6 h-6 text-gray-500"
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
                  <span class="text-body-sm text-gray-700">Code Source</span>
                </a>
              </div>
            </UiCard>
          </div>

          <div class="space-y-6">
            <UiCard>
              <h3 class="text-body font-semibold text-gray-900 mb-3">
                Mentor assigne
              </h3>
              <div v-if="mentor" class="flex items-center gap-3">
                <UiAvatar :name="mentor.name" size="lg" />
                <div>
                  <p class="text-body font-medium text-gray-900">
                    {{ mentor.name }}
                  </p>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span
                      v-for="exp in mentor.expertise.slice(0, 2)"
                      :key="exp"
                      class="text-caption text-gray-500"
                    >
                      {{ exp }}
                    </span>
                  </div>
                </div>
              </div>
              <p v-else class="text-body-sm text-gray-500">
                Aucun mentor assigne pour le moment
              </p>
            </UiCard>

            <UiCard v-if="hackathon">
              <h3 class="text-body font-semibold text-gray-900 mb-3">
                Hackathon
              </h3>
              <p class="text-body-sm font-medium text-gray-900 mb-1">
                {{ hackathon.title }}
              </p>
              <p class="text-caption text-gray-500 mb-3">
                {{ hackathon.category }}
              </p>
              <dl class="space-y-2 text-body-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-500">Soumissions</dt>
                  <dd class="text-gray-900">
                    {{ formatDate(hackathon.submissionEnd) }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Resultats</dt>
                  <dd class="text-gray-900">
                    {{ formatDate(hackathon.evaluationEnd) }}
                  </dd>
                </div>
              </dl>
            </UiCard>
          </div>
        </div>
      </template>

      <template #edit>
        <UiCard>
          <form @submit.prevent="saveProject" class="space-y-6">
            <UiInput
              v-model="form.title"
              label="Titre du projet"
              placeholder="Nom de votre projet"
              required
            />

            <UiTextarea
              v-model="form.description"
              label="Description"
              placeholder="Decrivez votre projet en detail..."
              rows="4"
              required
            />

            <div class="grid sm:grid-cols-2 gap-6">
              <UiTextarea
                v-model="form.problemStatement"
                label="Probleme identifie"
                placeholder="Quel probleme resolvez-vous?"
                rows="3"
              />
              <UiTextarea
                v-model="form.solution"
                label="Solution proposee"
                placeholder="Comment resolvez-vous ce probleme?"
                rows="3"
              />
            </div>

            <div>
              <label class="block text-body-sm font-medium text-gray-700 mb-2">
                Technologies utilisees
              </label>
              <div class="flex gap-2 mb-2">
                <UiInput
                  v-model="techInput"
                  placeholder="Ex: Vue.js"
                  class="flex-1"
                  @keydown.enter.prevent="addTech"
                />
                <UiButton type="button" variant="outline" @click="addTech">
                  Ajouter
                </UiButton>
              </div>
              <div
                v-if="form.techStack.length > 0"
                class="flex flex-wrap gap-2"
              >
                <span
                  v-for="(tech, index) in form.techStack"
                  :key="index"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-body-sm"
                >
                  {{ tech }}
                  <button
                    type="button"
                    class="hover:text-red-500"
                    @click="removeTech(index)"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <div class="grid sm:grid-cols-3 gap-4">
              <UiInput
                v-model="form.pitchDeckUrl"
                label="Lien Pitch Deck"
                placeholder="https://..."
                type="url"
              />
              <UiInput
                v-model="form.demoVideoUrl"
                label="Lien Video Demo"
                placeholder="https://..."
                type="url"
              />
              <UiInput
                v-model="form.sourceCodeUrl"
                label="Lien Code Source"
                placeholder="https://github.com/..."
                type="url"
              />
            </div>

            <div
              class="flex justify-end gap-3 pt-4 border-t border-neutral-border"
            >
              <UiButton
                type="button"
                variant="ghost"
                @click="activeTab = 'overview'"
              >
                Annuler
              </UiButton>
              <UiButton type="submit" :loading="isSubmitting">
                Enregistrer
              </UiButton>
            </div>
          </form>
        </UiCard>
      </template>

      <template #team>
        <UiCard>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-heading-sm text-primary">Membres de l'equipe</h2>
            <UiButton variant="outline" size="sm" disabled>
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Inviter un membre
            </UiButton>
          </div>

          <div class="space-y-4">
            <div
              v-for="member in project.members"
              :key="member.userId"
              class="flex items-center justify-between p-4 rounded-lg bg-gray-50"
            >
              <div class="flex items-center gap-4">
                <UiAvatar :name="member.name" size="lg" />
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-body font-medium text-gray-900">{{
                      member.name
                    }}</span>
                    <UiBadge v-if="member.isLead" variant="secondary" size="sm"
                      >Lead</UiBadge
                    >
                  </div>
                  <span class="text-body-sm text-gray-500">{{
                    member.role
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </UiCard>
      </template>
    </UiTabs>
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
    <UiButton variant="outline" href="/participant/projects">
      Retour aux projets
    </UiButton>
  </UiCard>
</template>
