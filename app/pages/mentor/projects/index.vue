<script setup lang="ts">
import { mockProjects, mockHackathons } from "~/data/mock";
import type { Project, ProjectStatus, ProjectMember } from "~/types";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Suivi Participants - ISM Incubator",
});

// Mock current mentor ID
const currentMentorId = "mentor-003";

// State
const activeTab = ref<"projects" | "participants">("participants");
const searchQuery = ref("");
const filterStatus = ref<"all" | "action-needed" | "on-track" | "completed">(
  "all",
);
const selectedParticipant = ref<ParticipantInfo | null>(null);
const showParticipantModal = ref(false);
const showNoteModal = ref(false);
const newNote = ref("");

// Extended participant interface for tracking
interface ParticipantInfo {
  member: ProjectMember;
  project: Project;
  hackathonTitle: string;
  lastInteraction?: string;
  notes: string[];
  progressStatus: "action-needed" | "on-track" | "completed";
}

// Get assigned projects
const assignedProjects = computed(() =>
  mockProjects.filter((p) => p.assignedMentorId === currentMentorId),
);

// Extract all participants with their project context
const allParticipants = computed<ParticipantInfo[]>(() => {
  const participants: ParticipantInfo[] = [];

  assignedProjects.value.forEach((project) => {
    const hackathonTitle = getHackathonTitle(project.hackathonId);
    project.members.forEach((member) => {
      // Mock progress status based on project status
      let progressStatus: ParticipantInfo["progressStatus"] = "on-track";
      if (project.status === "submitted") progressStatus = "action-needed";
      if (project.status === "winner" || project.status === "finalist")
        progressStatus = "completed";

      participants.push({
        member,
        project,
        hackathonTitle,
        lastInteraction: getRandomLastInteraction(),
        notes: getMockNotes(member.userId),
        progressStatus,
      });
    });
  });

  return participants;
});

// Filtered participants
const filteredParticipants = computed(() => {
  let result = allParticipants.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.member.name.toLowerCase().includes(query) ||
        p.project.title.toLowerCase().includes(query),
    );
  }

  if (filterStatus.value !== "all") {
    result = result.filter((p) => p.progressStatus === filterStatus.value);
  }

  return result;
});

// Filtered projects
const filteredProjects = computed(() => {
  let result = assignedProjects.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.members.some((m) => m.name.toLowerCase().includes(query)),
    );
  }

  return result;
});

// Stats
const stats = computed(() => ({
  totalParticipants: allParticipants.value.length,
  totalProjects: assignedProjects.value.length,
  actionNeeded: allParticipants.value.filter(
    (p) => p.progressStatus === "action-needed",
  ).length,
  onTrack: allParticipants.value.filter((p) => p.progressStatus === "on-track")
    .length,
  completed: allParticipants.value.filter(
    (p) => p.progressStatus === "completed",
  ).length,
}));

// Helpers
function getHackathonTitle(hackathonId: string) {
  return mockHackathons.find((h) => h.id === hackathonId)?.title || "Inconnu";
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRandomLastInteraction(): string {
  const days = Math.floor(Math.random() * 14);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

function getMockNotes(userId: string): string[] {
  const allNotes = [
    "Progresse bien sur le frontend",
    "A besoin d'aide sur l'architecture backend",
    "Excellente presentation lors du dernier point",
    "Doit revoir la partie securite",
    "Proposition interessante pour le pitch",
  ];
  const count = Math.floor(Math.random() * 3);
  return allNotes.slice(0, count);
}

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    variant: "default" | "info" | "success" | "warning" | "error";
  }
> = {
  draft: { label: "Brouillon", variant: "default" },
  submitted: { label: "A evaluer", variant: "info" },
  evaluation: { label: "En cours", variant: "warning" },
  finalist: { label: "Finaliste", variant: "info" },
  winner: { label: "Gagnant", variant: "success" },
  rejected: { label: "Rejete", variant: "error" },
};

const progressConfig = {
  "action-needed": {
    label: "Action requise",
    color: "bg-status-error",
    textColor: "text-status-error",
  },
  "on-track": {
    label: "En bonne voie",
    color: "bg-status-warning",
    textColor: "text-status-warning",
  },
  completed: {
    label: "Termine",
    color: "bg-status-success",
    textColor: "text-status-success",
  },
};

// Actions
function openParticipantDetail(participant: ParticipantInfo) {
  selectedParticipant.value = participant;
  showParticipantModal.value = true;
}

function openNoteModal(participant: ParticipantInfo) {
  selectedParticipant.value = participant;
  newNote.value = "";
  showNoteModal.value = true;
}

function addNote() {
  if (selectedParticipant.value && newNote.value.trim()) {
    selectedParticipant.value.notes.push(newNote.value.trim());
    newNote.value = "";
    showNoteModal.value = false;
  }
}

function sendMessage(participant: ParticipantInfo) {
  navigateTo(`/mentor/messages?to=${participant.member.userId}`);
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-heading-lg text-primary mb-1">Suivi des Participants</h1>
      <p class="text-body text-gray-500">
        Suivez la progression de vos participants et accompagnez-les vers le
        succes
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-primary">
          {{ stats.totalParticipants }}
        </div>
        <div class="text-caption text-gray-500">Participants</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-secondary">
          {{ stats.totalProjects }}
        </div>
        <div class="text-caption text-gray-500">Projets</div>
      </UiCard>
      <UiCard
        class="text-center cursor-pointer hover:shadow-card-hover transition-shadow"
        @click="filterStatus = 'action-needed'"
      >
        <div class="text-2xl font-bold text-status-error">
          {{ stats.actionNeeded }}
        </div>
        <div class="text-caption text-gray-500">Action requise</div>
      </UiCard>
      <UiCard
        class="text-center cursor-pointer hover:shadow-card-hover transition-shadow"
        @click="filterStatus = 'on-track'"
      >
        <div class="text-2xl font-bold text-status-warning">
          {{ stats.onTrack }}
        </div>
        <div class="text-caption text-gray-500">En bonne voie</div>
      </UiCard>
      <UiCard
        class="text-center cursor-pointer hover:shadow-card-hover transition-shadow"
        @click="filterStatus = 'completed'"
      >
        <div class="text-2xl font-bold text-status-success">
          {{ stats.completed }}
        </div>
        <div class="text-caption text-gray-500">Termines</div>
      </UiCard>
    </div>

    <UiCard class="mb-6">
      <div
        class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
      >
        <div class="w-full lg:w-80">
          <UiInput
            v-model="searchQuery"
            placeholder="Rechercher participant ou projet..."
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

        <div class="flex gap-2">
          <button
            :class="[
              'px-4 py-2 rounded-lg text-body-sm font-medium transition-colors flex items-center gap-2',
              activeTab === 'participants'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="activeTab = 'participants'"
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Vue Participants
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-lg text-body-sm font-medium transition-colors flex items-center gap-2',
              activeTab === 'projects'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="activeTab = 'projects'"
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Vue Projets
          </button>
        </div>

        <div v-if="activeTab === 'participants'" class="flex gap-2">
          <button
            v-for="status in [
              { value: 'all', label: 'Tous' },
              { value: 'action-needed', label: 'Action requise' },
              { value: 'on-track', label: 'En voie' },
              { value: 'completed', label: 'Termines' },
            ]"
            :key="status.value"
            :class="[
              'px-3 py-1.5 rounded-full text-caption font-medium transition-colors',
              filterStatus === status.value
                ? 'bg-secondary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="filterStatus = status.value as any"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </UiCard>

    <div v-if="activeTab === 'participants'">
      <div v-if="filteredParticipants.length > 0" class="space-y-3">
        <UiCard
          v-for="participant in filteredParticipants"
          :key="`${participant.member.userId}-${participant.project.id}`"
          class="hover:shadow-card-hover transition-shadow"
        >
          <div class="flex flex-col lg:flex-row lg:items-center gap-4">
            <div class="flex items-center gap-3 flex-1">
              <UiAvatar :name="participant.member.name" size="lg" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-body font-semibold text-gray-900">
                    {{ participant.member.name }}
                  </h3>
                  <span
                    v-if="participant.member.isLead"
                    class="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
                  >
                    Chef d'equipe
                  </span>
                </div>
                <p class="text-body-sm text-gray-500">
                  {{ participant.member.role }}
                </p>
              </div>
            </div>

            <div class="flex-1 min-w-0 px-4 border-l border-neutral-border">
              <NuxtLink
                :to="`/mentor/projects/${participant.project.id}`"
                class="hover:text-primary transition-colors"
              >
                <p class="text-body-sm font-medium text-gray-900 truncate">
                  {{ participant.project.title }}
                </p>
              </NuxtLink>
              <p class="text-caption text-secondary">
                {{ participant.hackathonTitle }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-center">
                <UiBadge
                  :variant="statusConfig[participant.project.status].variant"
                  size="sm"
                >
                  {{ statusConfig[participant.project.status].label }}
                </UiBadge>
                <p class="text-caption text-gray-400 mt-1">
                  {{ participant.lastInteraction }}
                </p>
              </div>

              <div class="flex items-center gap-1">
                <span
                  :class="[
                    'w-2 h-2 rounded-full',
                    progressConfig[participant.progressStatus].color,
                  ]"
                />
                <span
                  :class="[
                    'text-caption font-medium',
                    progressConfig[participant.progressStatus].textColor,
                  ]"
                >
                  {{ progressConfig[participant.progressStatus].label }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 lg:ml-4">
              <UiTooltip text="Envoyer un message" position="left" :delay="100">
                <button
                  class="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                  @click="sendMessage(participant)"
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </UiTooltip>
              <UiTooltip text="Ajouter une note" position="left" :delay="100">
                <button
                  class="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-colors"
                  @click="openNoteModal(participant)"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </UiTooltip>
              <UiTooltip text="Voir les details" position="left" :delay="100">
                <button
                  class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  @click="openParticipantDetail(participant)"
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
                </button>
              </UiTooltip>
            </div>
          </div>

          <div
            v-if="participant.notes.length > 0"
            class="mt-3 pt-3 border-t border-neutral-border"
          >
            <div
              class="flex items-center gap-2 text-caption text-gray-500 mb-1"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {{ participant.notes.length }} note(s)
            </div>
            <p class="text-body-sm text-gray-600 line-clamp-1">
              {{ participant.notes[participant.notes.length - 1] }}
            </p>
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p class="text-body text-gray-500">Aucun participant trouve</p>
      </UiCard>
    </div>

    <div v-else>
      <div v-if="filteredProjects.length > 0" class="grid md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="project in filteredProjects"
          :key="project.id"
          :to="`/mentor/projects/${project.id}`"
          class="block"
        >
          <UiCard class="h-full hover:shadow-card-hover transition-shadow">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 class="text-body font-semibold text-gray-900 mb-1">
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

            <p class="text-body-sm text-gray-600 line-clamp-2 mb-4">
              {{ project.description }}
            </p>

            <div class="mb-4">
              <p class="text-caption font-medium text-gray-700 mb-2">
                Equipe ({{ project.members.length }})
              </p>
              <div class="space-y-2">
                <div
                  v-for="member in project.members"
                  :key="member.userId"
                  class="flex items-center gap-2"
                >
                  <UiAvatar :name="member.name" size="sm" />
                  <div class="flex-1 min-w-0">
                    <p class="text-body-sm font-medium text-gray-900 truncate">
                      {{ member.name }}
                    </p>
                    <p class="text-caption text-gray-500">{{ member.role }}</p>
                  </div>
                  <span
                    v-if="member.isLead"
                    class="px-1.5 py-0.5 bg-secondary/10 text-secondary text-xs rounded"
                  >
                    Lead
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="tech in project.techStack.slice(0, 3)"
                :key="tech"
                class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.techStack.length > 3"
                class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                +{{ project.techStack.length - 3 }}
              </span>
            </div>

            <div
              class="flex items-center justify-between pt-3 border-t border-neutral-border text-caption text-gray-400"
            >
              <span>Soumis le {{ formatDate(project.submittedAt) }}</span>
              <span class="text-primary font-medium">Voir details →</span>
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
        <p class="text-body text-gray-500">Aucun projet trouve</p>
      </UiCard>
    </div>

    <UiModal
      v-model="showParticipantModal"
      :title="selectedParticipant?.member.name"
      size="lg"
    >
      <div v-if="selectedParticipant" class="space-y-6">
        <div class="flex items-center gap-4">
          <UiAvatar :name="selectedParticipant.member.name" size="xl" />
          <div>
            <h3 class="text-heading-sm text-gray-900">
              {{ selectedParticipant.member.name }}
            </h3>
            <p class="text-body text-gray-500">
              {{ selectedParticipant.member.role }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  progressConfig[selectedParticipant.progressStatus].color,
                ]"
              />
              <span
                :class="[
                  'text-body-sm',
                  progressConfig[selectedParticipant.progressStatus].textColor,
                ]"
              >
                {{ progressConfig[selectedParticipant.progressStatus].label }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-body-sm font-semibold text-gray-700 mb-2">Projet</h4>
          <p class="text-body font-medium text-gray-900">
            {{ selectedParticipant.project.title }}
          </p>
          <p class="text-body-sm text-secondary">
            {{ selectedParticipant.hackathonTitle }}
          </p>
          <div class="mt-2">
            <UiBadge
              :variant="
                statusConfig[selectedParticipant.project.status].variant
              "
              size="sm"
            >
              {{ statusConfig[selectedParticipant.project.status].label }}
            </UiBadge>
          </div>
        </div>

        <div>
          <h4 class="text-body-sm font-semibold text-gray-700 mb-3">
            Coequipiers
          </h4>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="member in selectedParticipant.project.members.filter(
                (m) => m.userId !== selectedParticipant?.member.userId,
              )"
              :key="member.userId"
              class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
            >
              <UiAvatar :name="member.name" size="sm" />
              <div>
                <p class="text-body-sm font-medium text-gray-900">
                  {{ member.name }}
                </p>
                <p class="text-caption text-gray-500">{{ member.role }}</p>
              </div>
            </div>
            <div
              v-if="selectedParticipant.project.members.length === 1"
              class="text-body-sm text-gray-400 italic"
            >
              Projet solo
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-body-sm font-semibold text-gray-700">
              Notes de suivi
            </h4>
            <button
              class="text-body-sm text-primary hover:underline"
              @click="showNoteModal = true"
            >
              + Ajouter une note
            </button>
          </div>
          <div v-if="selectedParticipant.notes.length > 0" class="space-y-2">
            <div
              v-for="(note, index) in selectedParticipant.notes"
              :key="index"
              class="p-3 bg-gray-50 rounded-lg text-body-sm text-gray-700"
            >
              {{ note }}
            </div>
          </div>
          <p v-else class="text-body-sm text-gray-400 italic">
            Aucune note pour l'instant
          </p>
        </div>
      </div>

      <template #footer>
        <UiButton variant="ghost" @click="showParticipantModal = false"
          >Fermer</UiButton
        >
        <UiButton @click="sendMessage(selectedParticipant!)">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Envoyer un message
        </UiButton>
      </template>
    </UiModal>

    <UiModal v-model="showNoteModal" title="Ajouter une note" size="md">
      <div class="space-y-4">
        <p class="text-body-sm text-gray-500">
          Ajouter une note de suivi pour
          <strong>{{ selectedParticipant?.member.name }}</strong>
        </p>
        <textarea
          v-model="newNote"
          class="w-full p-3 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          rows="4"
          placeholder="Ex: A termine la partie frontend, doit revoir l'API..."
        />
      </div>

      <template #footer>
        <UiButton variant="ghost" @click="showNoteModal = false"
          >Annuler</UiButton
        >
        <UiButton :disabled="!newNote.trim()" @click="addNote">
          Enregistrer
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
