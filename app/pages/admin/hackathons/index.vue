<script setup lang="ts">
import { mockHackathons } from "~/data/mock";
import type { Hackathon, HackathonStatus } from "~/types";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Gestion des Hackathons - ISM Incubator",
});

// State
const hackathons = ref<Hackathon[]>([...mockHackathons]);
const searchQuery = ref("");
const filterStatus = ref<HackathonStatus | "all">("all");
const isModalOpen = ref(false);
const editingHackathon = ref<Hackathon | null>(null);
const isSubmitting = ref(false);
const activeTab = ref("general");

// Form state
const form = ref({
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  coverImage: "",
  registrationStart: "",
  registrationEnd: "",
  submissionStart: "",
  submissionEnd: "",
  evaluationStart: "",
  evaluationEnd: "",
  status: "draft" as HackathonStatus,
  prizes: [] as {
    position: number;
    title: string;
    value: string;
    description?: string;
  }[],
});

// New prize input
const newPrize = ref({
  title: "",
  value: "",
  description: "",
});

const formTabs = [
  { id: "general", label: "Informations" },
  { id: "dates", label: "Dates" },
  { id: "prizes", label: "Prix" },
];

// Table columns
const columns = [
  { key: "title", label: "Hackathon" },
  { key: "category", label: "Categorie", class: "hidden md:table-cell" },
  { key: "dates", label: "Periode", class: "hidden lg:table-cell" },
  { key: "participants", label: "Stats", class: "hidden sm:table-cell" },
  { key: "status", label: "Statut" },
  { key: "actions", label: "", class: "w-24" },
];

const statusConfig: Record<
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

// Computed
const filteredHackathons = computed(() => {
  let result = hackathons.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (h) =>
        h.title.toLowerCase().includes(query) ||
        h.category.toLowerCase().includes(query),
    );
  }

  if (filterStatus.value !== "all") {
    result = result.filter((h) => h.status === filterStatus.value);
  }

  return result;
});

const modalTitle = computed(() =>
  editingHackathon.value ? "Modifier le hackathon" : "Creer un hackathon",
);

// Methods
function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function formatDateInput(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

function openCreateModal() {
  editingHackathon.value = null;
  form.value = {
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    coverImage: "",
    registrationStart: "",
    registrationEnd: "",
    submissionStart: "",
    submissionEnd: "",
    evaluationStart: "",
    evaluationEnd: "",
    status: "draft",
    prizes: [],
  };
  newPrize.value = { title: "", value: "", description: "" };
  activeTab.value = "general";
  isModalOpen.value = true;
}

function openEditModal(hackathon: Hackathon) {
  editingHackathon.value = hackathon;
  form.value = {
    title: hackathon.title,
    shortDescription: hackathon.shortDescription,
    description: hackathon.description,
    category: hackathon.category,
    coverImage: hackathon.coverImage,
    registrationStart: formatDateInput(hackathon.registrationStart) as string,
    registrationEnd: formatDateInput(hackathon.registrationEnd) as string,
    submissionStart: formatDateInput(hackathon.submissionStart) as string,
    submissionEnd: formatDateInput(hackathon.submissionEnd) as string,
    evaluationStart: formatDateInput(hackathon.evaluationStart) as string,
    evaluationEnd: formatDateInput(hackathon.evaluationEnd) as string,
    status: hackathon.status,
    prizes:
      hackathon.prizes?.map((p) => ({
        position: p.position,
        title: p.title,
        value: p.value || "",
        description: p.description,
      })) || [],
  };
  newPrize.value = { title: "", value: "", description: "" };
  activeTab.value = "general";
  isModalOpen.value = true;
}

// Prize management
function addPrize() {
  if (newPrize.value.title.trim() && newPrize.value.value.trim()) {
    form.value.prizes.push({
      position: form.value.prizes.length + 1,
      title: newPrize.value.title.trim(),
      value: newPrize.value.value.trim(),
      description: newPrize.value.description.trim() || undefined,
    });
    newPrize.value = { title: "", value: "", description: "" };
  }
}

function removePrize(position: number) {
  form.value.prizes = form.value.prizes
    .filter((p) => p.position !== position)
    .map((p, i) => ({ ...p, position: i + 1 }));
}

async function handleSubmit() {
  if (!form.value.title || !form.value.category) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (editingHackathon.value) {
    // Update existing hackathon
    const index = hackathons.value.findIndex(
      (h) => h.id === editingHackathon.value!.id,
    );
    if (index !== -1) {
      const existing = hackathons.value[index];
      if (existing) {
        hackathons.value[index] = {
          ...existing,
          title: form.value.title,
          slug: form.value.title.toLowerCase().replace(/\s+/g, "-"),
          shortDescription: form.value.shortDescription,
          description: form.value.description,
          category: form.value.category,
          coverImage: form.value.coverImage,
          registrationStart: form.value.registrationStart,
          registrationEnd: form.value.registrationEnd,
          submissionStart: form.value.submissionStart,
          submissionEnd: form.value.submissionEnd,
          evaluationStart: form.value.evaluationStart,
          evaluationEnd: form.value.evaluationEnd,
          status: form.value.status,
          prizes: form.value.prizes,
          updatedAt: new Date().toISOString(),
        };
      }
    }
  } else {
    // Create new hackathon
    const newHackathon: Hackathon = {
      id: `hack-${Date.now()}`,
      title: form.value.title,
      slug: form.value.title.toLowerCase().replace(/\s+/g, "-"),
      shortDescription: form.value.shortDescription,
      description: form.value.description,
      category: form.value.category,
      coverImage: form.value.coverImage || "/images/hackathon-default.jpg",
      status: form.value.status,
      registrationStart: form.value.registrationStart,
      registrationEnd: form.value.registrationEnd,
      submissionStart: form.value.submissionStart,
      submissionEnd: form.value.submissionEnd,
      evaluationStart: form.value.evaluationStart,
      evaluationEnd: form.value.evaluationEnd,
      steps: [],
      prizes: form.value.prizes,
      mentorIds: [],
      participantCount: 0,
      projectCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    hackathons.value.unshift(newHackathon);
  }

  isSubmitting.value = false;
  isModalOpen.value = false;
}

function deleteHackathon(hackathon: Hackathon) {
  if (confirm(`Etes-vous sur de vouloir supprimer "${hackathon.title}" ?`)) {
    hackathons.value = hackathons.value.filter((h) => h.id !== hackathon.id);
  }
}

function duplicateHackathon(hackathon: Hackathon) {
  const duplicate: Hackathon = {
    ...hackathon,
    id: `hack-${Date.now()}`,
    title: `${hackathon.title} (copie)`,
    slug: `${hackathon.slug}-copy`,
    status: "draft",
    participantCount: 0,
    projectCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  hackathons.value.unshift(duplicate);
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-heading-lg text-primary mb-1">Hackathons</h1>
        <p class="text-body text-gray-500">
          Gerez les hackathons de la plateforme
        </p>
      </div>
      <UiButton @click="openCreateModal">
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
        Creer un hackathon
      </UiButton>
    </div>

    <!-- Filters -->
    <UiCard class="mb-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <UiInput
            v-model="searchQuery"
            placeholder="Rechercher par titre ou categorie..."
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
              { value: 'draft', label: 'Brouillon' },
              { value: 'upcoming', label: 'A venir' },
              { value: 'active', label: 'En cours' },
              { value: 'evaluation', label: 'Evaluation' },
              { value: 'completed', label: 'Termine' },
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

    <!-- Table -->
    <UiCard>
      <UiTable
        :columns="columns"
        :data="filteredHackathons"
        empty-text="Aucun hackathon trouve"
      >
        <template #title="{ item }">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0"
            >
              <img
                v-if="item.coverImage"
                :src="item.coverImage"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div class="text-body-sm font-medium text-gray-900">
                {{ item.title }}
              </div>
              <div class="text-caption text-gray-500 line-clamp-1">
                {{ item.shortDescription }}
              </div>
            </div>
          </div>
        </template>

        <template #category="{ item }">
          <UiBadge variant="default" size="sm">
            {{ item.category }}
          </UiBadge>
        </template>

        <template #dates="{ item }">
          <div class="text-body-sm text-gray-600">
            {{ formatDateShort(item.registrationStart) }} -
            {{ formatDateShort(item.submissionEnd) }}
          </div>
        </template>

        <template #participants="{ item }">
          <div class="flex gap-4 text-body-sm text-gray-600">
            <span class="flex items-center gap-1">
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
              {{ item.participantCount }}
            </span>
            <span class="flex items-center gap-1">
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
              {{ item.projectCount }}
            </span>
          </div>
        </template>

        <template #status="{ item }">
          <UiBadge
            :variant="statusConfig[item.status as HackathonStatus].variant"
            size="sm"
            :dot="item.status === 'active'"
          >
            {{ statusConfig[item.status as HackathonStatus].label }}
          </UiBadge>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center justify-end gap-1">
            <NuxtLink
              :to="`/admin/hackathons/${item.id}`"
              class="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
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
            <button
              class="p-1.5 text-gray-400 hover:text-primary transition-colors"
              title="Modifier"
              @click="openEditModal(item)"
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
            <button
              class="p-1.5 text-gray-400 hover:text-secondary transition-colors"
              title="Dupliquer"
              @click="duplicateHackathon(item)"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Supprimer"
              @click="deleteHackathon(item)"
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
        </template>
      </UiTable>
    </UiCard>

    <!-- Create/Edit Modal -->
    <UiModal
      :open="isModalOpen"
      :title="modalTitle"
      size="lg"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit">
        <UiTabs
          v-model="activeTab"
          :tabs="formTabs"
          variant="pills"
          class="mb-6"
        >
          <template #general>
            <div class="space-y-4">
              <UiInput
                v-model="form.title"
                label="Titre du hackathon"
                placeholder="Ex: FinTech Innovation Challenge 2026"
                required
              />

              <UiInput
                v-model="form.category"
                label="Categorie"
                placeholder="Ex: FinTech, GreenTech, HealthTech..."
                required
              />

              <UiTextarea
                v-model="form.shortDescription"
                label="Description courte"
                placeholder="Resume en une ou deux phrases..."
                :rows="2"
              />

              <UiTextarea
                v-model="form.description"
                label="Description complete"
                placeholder="Description detaillee du hackathon..."
                :rows="4"
              />

              <UiInput
                v-model="form.coverImage"
                label="Image de couverture (URL)"
                placeholder="https://..."
                type="url"
              />

              <div>
                <label
                  class="block text-body-sm font-medium text-gray-700 mb-1.5"
                >
                  Statut
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="draft">Brouillon</option>
                  <option value="upcoming">A venir</option>
                  <option value="active">En cours</option>
                  <option value="evaluation">Evaluation</option>
                  <option value="completed">Termine</option>
                </select>
              </div>
            </div>
          </template>

          <template #dates>
            <div class="space-y-6">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 class="text-body-sm font-semibold text-gray-900 mb-3">
                    Inscriptions
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <label
                        class="block text-body-sm font-medium text-gray-700 mb-1.5"
                        >Debut</label
                      >
                      <input
                        v-model="form.registrationStart"
                        type="date"
                        class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-body-sm font-medium text-gray-700 mb-1.5"
                        >Fin</label
                      >
                      <input
                        v-model="form.registrationEnd"
                        type="date"
                        class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-body-sm font-semibold text-gray-900 mb-3">
                    Soumissions
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <label
                        class="block text-body-sm font-medium text-gray-700 mb-1.5"
                        >Debut</label
                      >
                      <input
                        v-model="form.submissionStart"
                        type="date"
                        class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-body-sm font-medium text-gray-700 mb-1.5"
                        >Fin</label
                      >
                      <input
                        v-model="form.submissionEnd"
                        type="date"
                        class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 class="text-body-sm font-semibold text-gray-900 mb-3">
                    Evaluation
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <label
                        class="block text-body-sm font-medium text-gray-700 mb-1.5"
                        >Debut</label
                      >
                      <input
                        v-model="form.evaluationStart"
                        type="date"
                        class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-body-sm font-medium text-gray-700 mb-1.5"
                        >Fin</label
                      >
                      <input
                        v-model="form.evaluationEnd"
                        type="date"
                        class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #prizes>
            <div class="space-y-4">
              <!-- Liste des prix existants -->
              <div v-if="form.prizes.length > 0" class="space-y-3">
                <div
                  v-for="prize in form.prizes"
                  :key="prize.position"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-neutral-border"
                >
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0',
                      prize.position === 1
                        ? 'bg-yellow-500'
                        : prize.position === 2
                          ? 'bg-gray-400'
                          : 'bg-amber-600',
                    ]"
                  >
                    {{ prize.position }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-body-sm font-medium text-gray-900">
                      {{ prize.title }}
                    </p>
                    <p class="text-caption text-secondary">{{ prize.value }}</p>
                    <p
                      v-if="prize.description"
                      class="text-caption text-gray-500 truncate"
                    >
                      {{ prize.description }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Supprimer"
                    @click="removePrize(prize.position)"
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

              <div v-else class="text-center py-4 text-gray-500">
                <svg
                  class="w-10 h-10 mx-auto mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                <p class="text-body-sm">Aucun prix defini</p>
              </div>

              <!-- Formulaire d'ajout -->
              <div
                class="p-4 border border-dashed border-neutral-border rounded-lg"
              >
                <p class="text-body-sm font-medium text-gray-700 mb-3">
                  Ajouter un prix ({{ form.prizes.length + 1
                  }}{{ form.prizes.length === 0 ? "er" : "e" }} place)
                </p>
                <div class="grid sm:grid-cols-2 gap-3 mb-3">
                  <UiInput
                    v-model="newPrize.title"
                    placeholder="Titre (ex: Premier prix)"
                  />
                  <UiInput
                    v-model="newPrize.value"
                    placeholder="Valeur (ex: 500 000 FCFA)"
                  />
                </div>
                <UiInput
                  v-model="newPrize.description"
                  placeholder="Description (optionnel)"
                  class="mb-3"
                />
                <UiButton
                  type="button"
                  variant="outline"
                  size="sm"
                  :disabled="!newPrize.title.trim() || !newPrize.value.trim()"
                  @click="addPrize"
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
          </template>
        </UiTabs>

        <div class="flex justify-end gap-3 pt-4 border-t border-neutral-border">
          <UiButton type="button" variant="ghost" @click="isModalOpen = false">
            Annuler
          </UiButton>
          <UiButton
            type="submit"
            :loading="isSubmitting"
            :disabled="!form.title || !form.category"
          >
            {{ editingHackathon ? "Modifier" : "Creer" }}
          </UiButton>
        </div>
      </form>
    </UiModal>
  </div>
</template>
