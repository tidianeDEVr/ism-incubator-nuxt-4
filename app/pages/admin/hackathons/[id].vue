<script setup lang="ts">
import { mockHackathons, mockProjects, mockMentors } from "~/data/mock";
import type { Project, ProjectStatus, Mentor, HackathonStatus } from "~/types";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const hackathonId = route.params.id as string;

// Find hackathon
const hackathon = ref(mockHackathons.find((h) => h.id === hackathonId));

if (!hackathon.value) {
  throw createError({
    statusCode: 404,
    message: "Hackathon non trouve",
  });
}

useHead({
  title: `${hackathon.value.title} - Admin ISM Incubator`,
});

// State
const activeTab = ref<"overview" | "projects" | "ranking">("overview");
const searchQuery = ref("");
const filterStatus = ref<ProjectStatus | "all">("all");
const showAssignMentorModal = ref(false);
const showRankingModal = ref(false);
const selectedProject = ref<Project | null>(null);
const selectedMentorId = ref<string>("");

// Get projects for this hackathon
const hackathonProjects = ref<Project[]>(
  mockProjects.filter((p) => p.hackathonId === hackathonId),
);

// Available mentors
const availableMentors = computed(() => mockMentors.filter((m) => m.isActive));

// Filtered projects
const filteredProjects = computed(() => {
  let result = hackathonProjects.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.members.some((m) => m.name.toLowerCase().includes(query)),
    );
  }

  if (filterStatus.value !== "all") {
    result = result.filter((p) => p.status === filterStatus.value);
  }

  return result;
});

// Projects by status for pipeline
const projectsByStatus = computed(() => ({
  submitted: hackathonProjects.value.filter((p) => p.status === "submitted"),
  evaluation: hackathonProjects.value.filter((p) => p.status === "evaluation"),
  finalist: hackathonProjects.value.filter((p) => p.status === "finalist"),
  winner: hackathonProjects.value.filter((p) => p.status === "winner"),
}));

// Stats
const stats = computed(() => [
  {
    label: "Projets soumis",
    value: hackathonProjects.value.length,
    color: "text-primary",
  },
  {
    label: "Participants",
    value: hackathonProjects.value.reduce(
      (sum, p) => sum + p.members.length,
      0,
    ),
    color: "text-secondary",
  },
  {
    label: "Finalistes",
    value: projectsByStatus.value.finalist.length,
    color: "text-purple-600",
  },
  {
    label: "Gagnants",
    value: projectsByStatus.value.winner.length,
    color: "text-green-600",
  },
]);

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    variant: "default" | "info" | "success" | "warning" | "error";
  }
> = {
  draft: { label: "Brouillon", variant: "default" },
  submitted: { label: "Soumis", variant: "info" },
  evaluation: { label: "En evaluation", variant: "warning" },
  finalist: { label: "Finaliste", variant: "info" },
  winner: { label: "Gagnant", variant: "success" },
  rejected: { label: "Rejete", variant: "error" },
};

const hackathonStatusConfig: Record<
  HackathonStatus,
  {
    label: string;
    variant: "default" | "info" | "success" | "warning" | "error";
  }
> = {
  draft: { label: "Brouillon", variant: "default" },
  upcoming: { label: "A venir", variant: "info" },
  active: { label: "En cours", variant: "success" },
  evaluation: { label: "Evaluation", variant: "warning" },
  completed: { label: "Termine", variant: "default" },
};

// Helpers
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getMentorById(mentorId?: string): Mentor | undefined {
  if (!mentorId) return undefined;
  return mockMentors.find((m) => m.id === mentorId);
}

// Actions
function openAssignMentorModal(project: Project) {
  selectedProject.value = project;
  selectedMentorId.value = project.assignedMentorId || "";
  showAssignMentorModal.value = true;
}

function assignMentor() {
  if (selectedProject.value) {
    const projectIndex = hackathonProjects.value.findIndex(
      (p) => p.id === selectedProject.value!.id,
    );
    if (projectIndex !== -1) {
      hackathonProjects.value[projectIndex] = {
        ...hackathonProjects.value[projectIndex],
        assignedMentorId: selectedMentorId.value || undefined,
      };
    }
  }
  showAssignMentorModal.value = false;
}

function updateProjectStatus(project: Project, newStatus: ProjectStatus) {
  const projectIndex = hackathonProjects.value.findIndex(
    (p) => p.id === project.id,
  );
  if (projectIndex !== -1) {
    hackathonProjects.value[projectIndex] = {
      ...hackathonProjects.value[projectIndex],
      status: newStatus,
    };
  }
}

function setAsWinner(project: Project, position: number) {
  // Remove winner status from other projects with same position
  hackathonProjects.value.forEach((p, index) => {
    if (p.status === "winner" && p.id !== project.id) {
      // Check if this project has the same position (we'd need to track positions)
    }
  });

  const projectIndex = hackathonProjects.value.findIndex(
    (p) => p.id === project.id,
  );
  if (projectIndex !== -1) {
    hackathonProjects.value[projectIndex] = {
      ...hackathonProjects.value[projectIndex],
      status: "winner",
    };
  }
}

function promoteToFinalist(project: Project) {
  updateProjectStatus(project, "finalist");
}

function removeFromFinalists(project: Project) {
  updateProjectStatus(project, "evaluation");
}

// Ranking
const rankedProjects = computed(() => {
  return hackathonProjects.value
    .filter((p) => p.status === "winner" || p.status === "finalist")
    .sort((a, b) => {
      if (a.status === "winner" && b.status !== "winner") return -1;
      if (b.status === "winner" && a.status !== "winner") return 1;
      return 0;
    });
});
</script>

<template>
  <div>
    <div class="mb-6">
      <nav class="flex items-center gap-2 text-body-sm text-gray-500 mb-3">
        <NuxtLink
          to="/admin/hackathons"
          class="hover:text-primary transition-colors"
        >
          Hackathons
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
        <span class="text-gray-900">{{ hackathon?.title }}</span>
      </nav>

      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-heading-lg text-primary">{{ hackathon?.title }}</h1>
            <UiBadge
              :variant="hackathonStatusConfig[hackathon!.status].variant"
            >
              {{ hackathonStatusConfig[hackathon!.status].label }}
            </UiBadge>
          </div>
          <p class="text-body text-gray-500">
            {{ hackathon?.shortDescription }}
          </p>
        </div>
        <div class="flex gap-2">
          <UiButton variant="outline" :href="`/admin/hackathons`">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Modifier
          </UiButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <UiCard v-for="stat in stats" :key="stat.label" class="text-center">
        <div :class="['text-2xl font-bold', stat.color]">{{ stat.value }}</div>
        <div class="text-caption text-gray-500">{{ stat.label }}</div>
      </UiCard>
    </div>

    <div class="flex gap-2 mb-6 border-b border-neutral-border">
      <button
        v-for="tab in [
          { id: 'overview', label: 'Apercu' },
          { id: 'projects', label: 'Projets' },
          { id: 'ranking', label: 'Classement' },
        ]"
        :key="tab.id"
        :class="[
          'px-4 py-3 text-body-sm font-medium transition-colors border-b-2 -mb-px',
          activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-900',
        ]"
        @click="activeTab = tab.id as any"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'overview'" class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Informations</h2>
          <div class="space-y-4">
            <div>
              <p class="text-body-sm font-medium text-gray-700 mb-1">
                Categorie
              </p>
              <UiBadge variant="default">{{ hackathon?.category }}</UiBadge>
            </div>
            <div>
              <p class="text-body-sm font-medium text-gray-700 mb-1">
                Description
              </p>
              <p class="text-body-sm text-gray-600">
                {{ hackathon?.description }}
              </p>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Calendrier</h2>
          <div class="space-y-3">
            <div
              class="flex items-center justify-between py-2 border-b border-neutral-border"
            >
              <span class="text-body-sm text-gray-600">Inscriptions</span>
              <span class="text-body-sm font-medium">
                {{ formatDate(hackathon!.registrationStart) }} -
                {{ formatDate(hackathon!.registrationEnd) }}
              </span>
            </div>
            <div
              class="flex items-center justify-between py-2 border-b border-neutral-border"
            >
              <span class="text-body-sm text-gray-600">Soumissions</span>
              <span class="text-body-sm font-medium">
                {{ formatDate(hackathon!.submissionStart) }} -
                {{ formatDate(hackathon!.submissionEnd) }}
              </span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-body-sm text-gray-600">Evaluation</span>
              <span class="text-body-sm font-medium">
                {{ formatDate(hackathon!.evaluationStart) }} -
                {{ formatDate(hackathon!.evaluationEnd) }}
              </span>
            </div>
          </div>
        </UiCard>
      </div>

      <div class="space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Prix</h2>
          <div class="space-y-3">
            <div
              v-for="prize in hackathon?.prizes"
              :key="prize.position"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                  prize.position === 1
                    ? 'bg-yellow-500'
                    : prize.position === 2
                      ? 'bg-gray-400'
                      : 'bg-amber-600',
                ]"
              >
                {{ prize.position }}
              </div>
              <div class="flex-1">
                <p class="text-body-sm font-medium text-gray-900">
                  {{ prize.title }}
                </p>
                <p class="text-caption text-secondary">{{ prize.value }}</p>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Mentors assignes</h2>
          <div class="space-y-2">
            <div
              v-for="mentorId in hackathon?.mentorIds"
              :key="mentorId"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <UiAvatar :name="getMentorById(mentorId)?.name || ''" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-body-sm font-medium text-gray-900 truncate">
                  {{ getMentorById(mentorId)?.name }}
                </p>
                <p class="text-caption text-gray-500 truncate">
                  {{
                    getMentorById(mentorId)?.expertise.slice(0, 2).join(", ")
                  }}
                </p>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>

    <div v-if="activeTab === 'projects'">
      <UiCard class="mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <UiInput
              v-model="searchQuery"
              placeholder="Rechercher un projet ou participant..."
              type="search"
            >
              <template #prefix>
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </template>
            </UiInput>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in [
                { value: 'all', label: 'Tous' },
                { value: 'submitted', label: 'Soumis' },
                { value: 'evaluation', label: 'En evaluation' },
                { value: 'finalist', label: 'Finalistes' },
                { value: 'winner', label: 'Gagnants' },
              ]"
              :key="status.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors',
                filterStatus === status.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
              @click="filterStatus = status.value as any"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
      </UiCard>

      <div v-if="filteredProjects.length > 0" class="space-y-4">
        <UiCard
          v-for="project in filteredProjects"
          :key="project.id"
          class="hover:shadow-card-hover transition-shadow"
        >
          <div class="flex flex-col lg:flex-row lg:items-center gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 class="text-body font-semibold text-gray-900">
                    {{ project.title }}
                  </h3>
                  <p class="text-caption text-gray-500">
                    Soumis le
                    {{ formatDate(project.submittedAt || project.createdAt) }}
                  </p>
                </div>
                <UiBadge :variant="statusConfig[project.status].variant">
                  {{ statusConfig[project.status].label }}
                </UiBadge>
              </div>
              <p class="text-body-sm text-gray-600 line-clamp-2 mb-3">
                {{ project.description }}
              </p>

              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                  <UiAvatar
                    v-for="member in project.members.slice(0, 4)"
                    :key="member.userId"
                    :name="member.name"
                    size="sm"
                    class="ring-2 ring-white"
                  />
                  <span
                    v-if="project.members.length > 4"
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 ring-2 ring-white"
                  >
                    +{{ project.members.length - 4 }}
                  </span>
                </div>
                <span class="text-caption text-gray-500"
                  >{{ project.members.length }} membre(s)</span
                >
              </div>
            </div>

            <div class="lg:w-48 lg:border-l lg:border-neutral-border lg:pl-4">
              <p class="text-caption font-medium text-gray-700 mb-2">
                Mentor assigne
              </p>
              <div
                v-if="project.assignedMentorId"
                class="flex items-center gap-2"
              >
                <UiAvatar
                  :name="getMentorById(project.assignedMentorId)?.name || ''"
                  size="sm"
                />
                <span class="text-body-sm text-gray-900">{{
                  getMentorById(project.assignedMentorId)?.name
                }}</span>
              </div>
              <button
                v-else
                class="text-body-sm text-primary hover:underline"
                @click="openAssignMentorModal(project)"
              >
                + Assigner un mentor
              </button>
            </div>

            <div
              class="flex items-center gap-2 lg:border-l lg:border-neutral-border lg:pl-4"
            >
              <button
                class="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                title="Assigner un mentor"
                @click="openAssignMentorModal(project)"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              <button
                v-if="
                  project.status !== 'finalist' && project.status !== 'winner'
                "
                class="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                title="Promouvoir finaliste"
                @click="promoteToFinalist(project)"
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
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
              <button
                v-if="project.status === 'finalist'"
                class="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Definir comme gagnant"
                @click="setAsWinner(project, 1)"
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </button>
              <NuxtLink
                :to="`/admin/projects?id=${project.id}`"
                class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Voir les details"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </UiCard>
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
        <p class="text-body text-gray-500">Aucun projet trouve</p>
      </UiCard>
    </div>

    <div v-if="activeTab === 'ranking'">
      <UiCard>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-heading-sm text-primary">Classement Final</h2>
          <p class="text-body-sm text-gray-500">
            {{ rankedProjects.length }} projet(s) classe(s)
          </p>
        </div>

        <div v-if="rankedProjects.length > 0" class="space-y-4">
          <div v-if="projectsByStatus.winner.length > 0">
            <h3
              class="text-body-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
              Gagnants
            </h3>
            <div class="space-y-3">
              <div
                v-for="(project, index) in projectsByStatus.winner"
                :key="project.id"
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl"
              >
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  :class="
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                        ? 'bg-gray-400'
                        : 'bg-amber-600'
                  "
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 class="text-body font-semibold text-gray-900">
                    {{ project.title }}
                  </h4>
                  <p class="text-body-sm text-gray-600">
                    {{ project.members.map((m) => m.name).join(", ") }}
                  </p>
                </div>
                <div v-if="hackathon?.prizes[index]" class="text-right">
                  <p class="text-body-sm font-medium text-gray-900">
                    {{ hackathon.prizes[index].title }}
                  </p>
                  <p class="text-caption text-secondary">
                    {{ hackathon.prizes[index].value }}
                  </p>
                </div>
                <button
                  class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Retirer du classement"
                  @click="updateProjectStatus(project, 'finalist')"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="projectsByStatus.finalist.length > 0" class="mt-6">
            <h3 class="text-body-sm font-semibold text-gray-700 mb-3">
              Finalistes
            </h3>
            <div class="space-y-2">
              <div
                v-for="project in projectsByStatus.finalist"
                :key="project.id"
                class="flex items-center gap-4 p-3 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <div
                  class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium"
                >
                  F
                </div>
                <div class="flex-1">
                  <h4 class="text-body-sm font-medium text-gray-900">
                    {{ project.title }}
                  </h4>
                  <p class="text-caption text-gray-500">
                    {{ project.members.map((m) => m.name).join(", ") }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="Promouvoir gagnant"
                    @click="
                      setAsWinner(project, projectsByStatus.winner.length + 1)
                    "
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
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </button>
                  <button
                    class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Retirer des finalistes"
                    @click="removeFromFinalists(project)"
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
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <h3 class="text-body font-semibold text-gray-900 mb-2">
            Aucun classement
          </h3>
          <p class="text-body-sm text-gray-500 mb-4">
            Promouvez des projets en finalistes puis definissez les gagnants
          </p>
          <UiButton variant="secondary" @click="activeTab = 'projects'">
            Voir les projets
          </UiButton>
        </div>
      </UiCard>
    </div>

    <UiModal
      v-model="showAssignMentorModal"
      title="Assigner un mentor"
      size="md"
    >
      <div v-if="selectedProject" class="space-y-4">
        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-body-sm font-medium text-gray-900">
            {{ selectedProject.title }}
          </p>
          <p class="text-caption text-gray-500">
            {{ selectedProject.members.length }} membre(s)
          </p>
        </div>

        <div>
          <label class="block text-body-sm font-medium text-gray-700 mb-2">
            Selectionner un mentor
          </label>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <label
              v-for="mentor in availableMentors"
              :key="mentor.id"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                selectedMentorId === mentor.id
                  ? 'border-primary bg-primary/5'
                  : 'border-neutral-border hover:border-gray-300',
              ]"
            >
              <input
                v-model="selectedMentorId"
                type="radio"
                :value="mentor.id"
                class="sr-only"
              />
              <UiAvatar :name="mentor.name" size="sm" />
              <div class="flex-1">
                <p class="text-body-sm font-medium text-gray-900">
                  {{ mentor.name }}
                </p>
                <p class="text-caption text-gray-500">
                  {{ mentor.expertise.slice(0, 2).join(", ") }}
                </p>
              </div>
              <div
                v-if="selectedMentorId === mentor.id"
                class="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              >
                <svg
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <UiButton variant="ghost" @click="showAssignMentorModal = false"
          >Annuler</UiButton
        >
        <UiButton @click="assignMentor">
          {{ selectedMentorId ? "Assigner" : "Retirer le mentor" }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
