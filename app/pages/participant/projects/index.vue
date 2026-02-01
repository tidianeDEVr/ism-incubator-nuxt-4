<script setup lang="ts">
import { mockProjects, mockHackathons } from "~/data/mock";
import type { Project, ProjectStatus, Hackathon } from "~/types";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Mes Projets - ISM Incubator",
});

// Mock current user
const currentUserId = "user-p1";
const currentUserName = "Amadou Diop";

// State
const projects = ref<Project[]>([...mockProjects]);
const showSubmissionModal = ref(false);
const isSubmitting = ref(false);
const activeFormTab = ref("info");
const newTechInput = ref("");
const newMemberName = ref("");
const newMemberRole = ref("");

// Form state
const form = ref({
  hackathonId: "",
  title: "",
  description: "",
  problemStatement: "",
  solution: "",
  techStack: [] as string[],
  members: [
    {
      userId: currentUserId,
      name: currentUserName,
      role: "Chef de projet",
      isLead: true,
    },
  ] as { userId: string; name: string; role: string; isLead: boolean }[],
  pitchDeckUrl: "",
  demoVideoUrl: "",
  sourceCodeUrl: "",
});

// Form tabs
const formTabs = [
  { id: "info", label: "Informations" },
  { id: "team", label: "Equipe" },
  { id: "links", label: "Liens" },
];

// Get user's projects
const myProjects = computed(() =>
  projects.value.filter((p) =>
    p.members.some((m) => m.userId === currentUserId),
  ),
);

// Available hackathons for submission (active or upcoming)
const availableHackathons = computed(() =>
  mockHackathons.filter(
    (h) => h.status === "active" || h.status === "upcoming",
  ),
);

// Helpers
function getHackathonTitle(hackathonId: string) {
  return mockHackathons.find((h) => h.id === hackathonId)?.title || "Inconnu";
}

function getHackathon(hackathonId: string): Hackathon | undefined {
  return mockHackathons.find((h) => h.id === hackathonId);
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    variant: "default" | "info" | "success" | "warning" | "error";
    description: string;
  }
> = {
  draft: {
    label: "Brouillon",
    variant: "default",
    description: "Projet en cours de preparation",
  },
  submitted: {
    label: "Soumis",
    variant: "info",
    description: "Projet soumis, en attente d'evaluation",
  },
  evaluation: {
    label: "En evaluation",
    variant: "warning",
    description: "Votre projet est en cours d'evaluation",
  },
  finalist: {
    label: "Finaliste",
    variant: "info",
    description: "Felicitations! Votre projet est finaliste",
  },
  winner: {
    label: "Gagnant",
    variant: "success",
    description: "Bravo! Votre projet a gagne!",
  },
  rejected: {
    label: "Non retenu",
    variant: "error",
    description: "Projet non retenu pour cette edition",
  },
};

// Actions
function openSubmissionModal() {
  form.value = {
    hackathonId: availableHackathons.value[0]?.id || "",
    title: "",
    description: "",
    problemStatement: "",
    solution: "",
    techStack: [],
    members: [
      {
        userId: currentUserId,
        name: currentUserName,
        role: "Chef de projet",
        isLead: true,
      },
    ],
    pitchDeckUrl: "",
    demoVideoUrl: "",
    sourceCodeUrl: "",
  };
  activeFormTab.value = "info";
  showSubmissionModal.value = true;
}

function addTech() {
  if (
    newTechInput.value.trim() &&
    !form.value.techStack.includes(newTechInput.value.trim())
  ) {
    form.value.techStack.push(newTechInput.value.trim());
    newTechInput.value = "";
  }
}

function removeTech(tech: string) {
  form.value.techStack = form.value.techStack.filter((t) => t !== tech);
}

function addMember() {
  if (newMemberName.value.trim() && newMemberRole.value.trim()) {
    form.value.members.push({
      userId: `user-${Date.now()}`,
      name: newMemberName.value.trim(),
      role: newMemberRole.value.trim(),
      isLead: false,
    });
    newMemberName.value = "";
    newMemberRole.value = "";
  }
}

function removeMember(userId: string) {
  if (userId !== currentUserId) {
    form.value.members = form.value.members.filter((m) => m.userId !== userId);
  }
}

function canSubmit() {
  return (
    form.value.hackathonId &&
    form.value.title.trim() &&
    form.value.description.trim() &&
    form.value.problemStatement.trim() &&
    form.value.solution.trim()
  );
}

async function handleSubmit(asDraft = false) {
  if (!canSubmit()) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newProject: Project = {
    id: `proj-${Date.now()}`,
    hackathonId: form.value.hackathonId,
    title: form.value.title,
    description: form.value.description,
    problemStatement: form.value.problemStatement,
    solution: form.value.solution,
    techStack: form.value.techStack,
    members: form.value.members,
    status: asDraft ? "draft" : "submitted",
    pitchDeckUrl: form.value.pitchDeckUrl || undefined,
    demoVideoUrl: form.value.demoVideoUrl || undefined,
    sourceCodeUrl: form.value.sourceCodeUrl || undefined,
    screenshots: [],
    submittedAt: asDraft ? undefined : new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.value.unshift(newProject);
  isSubmitting.value = false;
  showSubmissionModal.value = false;
}
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-heading-lg text-primary mb-1">Mes Projets</h1>
        <p class="text-body text-gray-500">
          Gerez vos projets et suivez leur avancement
        </p>
      </div>
      <UiButton @click="openSubmissionModal">
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Soumettre un projet
      </UiButton>
    </div>

    <div v-if="myProjects.length > 0" class="space-y-4">
      <NuxtLink
        v-for="project in myProjects"
        :key="project.id"
        :to="`/participant/projects/${project.id}`"
        class="block"
      >
        <UiCard class="hover:shadow-card-hover transition-shadow">
          <div class="flex flex-col lg:flex-row lg:items-center gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 class="text-body font-semibold text-gray-900">
                    {{ project.title }}
                  </h3>
                  <p class="text-caption text-secondary">
                    {{ getHackathonTitle(project.hackathonId) }}
                  </p>
                </div>
                <UiBadge
                  :variant="statusConfig[project.status].variant"
                  size="sm"
                >
                  {{ statusConfig[project.status].label }}
                </UiBadge>
              </div>
              <p class="text-body-sm text-gray-600 line-clamp-2 mb-3">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in project.techStack.slice(0, 4)"
                  :key="tech"
                  class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.techStack.length > 4"
                  class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  +{{ project.techStack.length - 4 }}
                </span>
              </div>
            </div>

            <div class="lg:w-72 lg:border-l lg:border-neutral-border lg:pl-6">
              <div class="mb-3">
                <p class="text-body-sm text-gray-500 mb-1">Statut actuel</p>
                <p class="text-body-sm font-medium text-gray-900">
                  {{ statusConfig[project.status].description }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <UiAvatar
                    v-for="member in project.members.slice(0, 3)"
                    :key="member.userId"
                    :name="member.name"
                    size="sm"
                    class="ring-2 ring-white"
                  />
                </div>
                <span class="text-caption text-gray-500">
                  {{ project.members.length }} membre(s)
                </span>
              </div>
            </div>
          </div>
        </UiCard>
      </NuxtLink>
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <h3 class="text-body font-semibold text-gray-900 mb-2">Aucun projet</h3>
      <p class="text-body-sm text-gray-500 mb-6 max-w-sm mx-auto">
        Vous n'avez pas encore de projet. Soumettez votre premiere idee!
      </p>
      <UiButton variant="secondary" @click="openSubmissionModal">
        Soumettre un projet
      </UiButton>
    </UiCard>

    <UiModal
      v-model="showSubmissionModal"
      title="Soumettre un projet"
      size="xl"
    >
      <form @submit.prevent="handleSubmit(false)">
        <div
          class="mb-6 p-4 bg-secondary/5 border border-secondary/20 rounded-lg"
        >
          <label class="block text-body-sm font-medium text-gray-700 mb-2">
            Hackathon cible
          </label>
          <select
            v-model="form.hackathonId"
            class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          >
            <option value="" disabled>Selectionnez un hackathon</option>
            <option v-for="h in availableHackathons" :key="h.id" :value="h.id">
              {{ h.title }} ({{ h.category }})
            </option>
          </select>
          <p v-if="form.hackathonId" class="mt-2 text-caption text-gray-500">
            Date limite:
            {{ formatDate(getHackathon(form.hackathonId)?.submissionEnd) }}
          </p>
        </div>

        <div class="flex gap-2 mb-6 border-b border-neutral-border">
          <button
            v-for="tab in formTabs"
            :key="tab.id"
            type="button"
            :class="[
              'px-4 py-2 text-body-sm font-medium transition-colors border-b-2 -mb-px',
              activeFormTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-900',
            ]"
            @click="activeFormTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-show="activeFormTab === 'info'" class="space-y-4">
          <UiInput
            v-model="form.title"
            label="Nom du projet"
            placeholder="Ex: FinApp Mobile"
            required
          />

          <UiTextarea
            v-model="form.description"
            label="Description courte"
            placeholder="Decrivez votre projet en quelques phrases..."
            :rows="2"
            required
          />

          <UiTextarea
            v-model="form.problemStatement"
            label="Probleme a resoudre"
            placeholder="Quel probleme votre projet resout-il?"
            :rows="3"
            required
          />

          <UiTextarea
            v-model="form.solution"
            label="Solution proposee"
            placeholder="Comment votre projet resout-il ce probleme?"
            rows="3"
            required
          />

          <div>
            <label class="block text-body-sm font-medium text-gray-700 mb-1.5">
              Technologies utilisees
            </label>
            <div class="flex gap-2 mb-2">
              <UiInput
                v-model="newTechInput"
                placeholder="Ex: Vue.js, Python..."
                class="flex-1"
                @keydown.enter.prevent="addTech"
              />
              <UiButton type="button" variant="outline" @click="addTech">
                Ajouter
              </UiButton>
            </div>
            <div v-if="form.techStack.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="tech in form.techStack"
                :key="tech"
                class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {{ tech }}
                <button
                  type="button"
                  class="hover:text-primary/70"
                  @click="removeTech(tech)"
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
        </div>

        <div v-show="activeFormTab === 'team'" class="space-y-4">
          <div>
            <label class="block text-body-sm font-medium text-gray-700 mb-3">
              Membres de l'equipe
            </label>

            <div class="space-y-2 mb-4">
              <div
                v-for="member in form.members"
                :key="member.userId"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <UiAvatar :name="member.name" size="sm" />
                <div class="flex-1">
                  <p class="text-body-sm font-medium text-gray-900">
                    {{ member.name }}
                  </p>
                  <p class="text-caption text-gray-500">{{ member.role }}</p>
                </div>
                <span
                  v-if="member.isLead"
                  class="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
                >
                  Chef d'equipe
                </span>
                <button
                  v-else
                  type="button"
                  class="p-1 text-gray-400 hover:text-red-500"
                  @click="removeMember(member.userId)"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div
              class="p-4 border border-dashed border-neutral-border rounded-lg"
            >
              <p class="text-body-sm font-medium text-gray-700 mb-3">
                Ajouter un membre
              </p>
              <div class="grid sm:grid-cols-2 gap-3 mb-3">
                <UiInput v-model="newMemberName" placeholder="Nom complet" />
                <UiInput
                  v-model="newMemberRole"
                  placeholder="Role (ex: Developer, Designer...)"
                />
              </div>
              <UiButton
                type="button"
                variant="outline"
                size="sm"
                :disabled="!newMemberName.trim() || !newMemberRole.trim()"
                @click="addMember"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Ajouter
              </UiButton>
            </div>
          </div>
        </div>

        <div v-show="activeFormTab === 'links'" class="space-y-4">
          <UiInput
            v-model="form.pitchDeckUrl"
            label="Pitch Deck (URL)"
            placeholder="https://docs.google.com/presentation/..."
            type="url"
            hint="Lien vers votre presentation (Google Slides, PDF...)"
          />

          <UiInput
            v-model="form.demoVideoUrl"
            label="Video de demonstration (URL)"
            placeholder="https://youtube.com/watch?v=..."
            type="url"
            hint="Lien YouTube ou Vimeo de votre demo"
          />

          <UiInput
            v-model="form.sourceCodeUrl"
            label="Code source (URL)"
            placeholder="https://github.com/..."
            type="url"
            hint="Lien vers votre repository GitHub/GitLab"
          />

          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex gap-3">
              <svg
                class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="text-body-sm font-medium text-blue-900">Conseil</p>
                <p class="text-body-sm text-blue-700">
                  Les liens ne sont pas obligatoires pour soumettre, mais
                  fortement recommandes pour l'evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <UiButton variant="ghost" @click="showSubmissionModal = false">
            Annuler
          </UiButton>
          <div class="flex-1" />
          <UiButton
            variant="outline"
            :loading="isSubmitting"
            :disabled="!canSubmit()"
            @click="handleSubmit(true)"
          >
            Sauvegarder brouillon
          </UiButton>
          <UiButton
            :loading="isSubmitting"
            :disabled="!canSubmit()"
            @click="handleSubmit(false)"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Soumettre
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>
