<script setup lang="ts">
import { mockMentors } from "~/data/mock";
import type { Mentor } from "~/types";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Gestion des Mentors - ISM Incubator",
});

// State
const mentors = ref<Mentor[]>([...mockMentors]);
const searchQuery = ref("");
const filterStatus = ref<"all" | "active" | "inactive">("all");
const isModalOpen = ref(false);
const editingMentor = ref<Mentor | null>(null);
const isSubmitting = ref(false);

// Form state
const form = ref({
  name: "",
  expertise: [] as string[],
  bio: "",
  linkedInUrl: "",
  isActive: true,
});

const expertiseInput = ref("");

// Table columns
const columns = [
  { key: "avatar", label: "", class: "w-12" },
  { key: "name", label: "Nom" },
  { key: "expertise", label: "Expertise" },
  { key: "projects", label: "Projets", class: "hidden md:table-cell" },
  { key: "status", label: "Statut" },
  { key: "actions", label: "", class: "w-24" },
];

// Computed
const filteredMentors = computed(() => {
  let result = mentors.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.expertise.some((e) => e.toLowerCase().includes(query)),
    );
  }

  if (filterStatus.value !== "all") {
    result = result.filter((m) =>
      filterStatus.value === "active" ? m.isActive : !m.isActive,
    );
  }

  return result;
});

const modalTitle = computed(() =>
  editingMentor.value ? "Modifier le mentor" : "Ajouter un mentor",
);

// Methods
function openCreateModal() {
  editingMentor.value = null;
  form.value = {
    name: "",
    expertise: [],
    bio: "",
    linkedInUrl: "",
    isActive: true,
  };
  isModalOpen.value = true;
}

function openEditModal(mentor: Mentor) {
  editingMentor.value = mentor;
  form.value = {
    name: mentor.name,
    expertise: [...mentor.expertise],
    bio: mentor.bio,
    linkedInUrl: mentor.linkedInUrl || "",
    isActive: mentor.isActive,
  };
  isModalOpen.value = true;
}

function addExpertise() {
  const trimmed = expertiseInput.value.trim();
  if (trimmed && !form.value.expertise.includes(trimmed)) {
    form.value.expertise.push(trimmed);
    expertiseInput.value = "";
  }
}

function removeExpertise(index: number) {
  form.value.expertise.splice(index, 1);
}

async function handleSubmit() {
  if (!form.value.name || form.value.expertise.length === 0) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (editingMentor.value) {
    // Update existing mentor
    const index = mentors.value.findIndex(
      (m) => m.id === editingMentor.value!.id,
    );
    if (index !== -1) {
      mentors.value[index] = {
        ...mentors.value[index]!,
        name: form.value.name,
        expertise: form.value.expertise,
        bio: form.value.bio,
        linkedInUrl: form.value.linkedInUrl || undefined,
        isActive: form.value.isActive,
      };
    }
  } else {
    // Create new mentor
    const newMentor: Mentor = {
      id: `mentor-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name: form.value.name,
      expertise: form.value.expertise,
      bio: form.value.bio,
      avatar: undefined,
      linkedInUrl: form.value.linkedInUrl || undefined,
      assignedProjectIds: [],
      isActive: form.value.isActive,
    };
    mentors.value.unshift(newMentor);
  }

  isSubmitting.value = false;
  isModalOpen.value = false;
}

function deleteMentor(mentor: Mentor) {
  if (confirm(`Etes-vous sur de vouloir supprimer ${mentor.name} ?`)) {
    mentors.value = mentors.value.filter((m) => m.id !== mentor.id);
  }
}

function toggleStatus(mentor: Mentor) {
  const index = mentors.value.findIndex((m) => m.id === mentor.id);
  if (index !== -1) {
    mentors.value[index]!.isActive = !mentors.value[index]!.isActive;
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-heading-lg text-primary mb-1">Mentors</h1>
        <p class="text-body text-gray-500">
          Gerez les mentors de la plateforme
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
        Ajouter un mentor
      </UiButton>
    </div>

    <!-- Filters -->
    <UiCard class="mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UiInput
            v-model="searchQuery"
            placeholder="Rechercher par nom ou expertise..."
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
            v-for="status in [
              { value: 'all', label: 'Tous' },
              { value: 'active', label: 'Actifs' },
              { value: 'inactive', label: 'Inactifs' },
            ]"
            :key="status.value"
            :class="[
              'px-4 py-2 rounded-lg text-body-sm font-medium transition-colors',
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
        :data="filteredMentors"
        empty-text="Aucun mentor trouve"
      >
        <template #avatar="{ item }">
          <UiAvatar :name="item.name" :src="item.avatar" size="sm" />
        </template>

        <template #name="{ item }">
          <div>
            <div class="text-body-sm font-medium text-gray-900">
              {{ item.name }}
            </div>
            <a
              v-if="item.linkedInUrl"
              :href="item.linkedInUrl"
              target="_blank"
              class="text-caption text-secondary hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </template>

        <template #expertise="{ item }">
          <div class="flex flex-wrap gap-1">
            <UiBadge
              v-for="exp in item.expertise.slice(0, 2)"
              :key="exp"
              variant="default"
              size="sm"
            >
              {{ exp }}
            </UiBadge>
            <UiBadge
              v-if="item.expertise.length > 2"
              variant="default"
              size="sm"
            >
              +{{ item.expertise.length - 2 }}
            </UiBadge>
          </div>
        </template>

        <template #projects="{ item }">
          <span class="text-body-sm text-gray-600">
            {{ item.assignedProjectIds.length }} projet(s)
          </span>
        </template>

        <template #status="{ item }">
          <UiBadge
            :variant="item.isActive ? 'success' : 'default'"
            size="sm"
            :dot="true"
          >
            {{ item.isActive ? "Actif" : "Inactif" }}
          </UiBadge>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center justify-end gap-2">
            <UiTooltip text="Modifier" position="left" :delay="100">
              <button
                class="p-1.5 text-gray-400 hover:text-primary transition-colors"
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
            </UiTooltip>
            <UiTooltip
              :text="item.isActive ? 'Desactiver' : 'Activer'"
              position="left"
              :delay="100"
            >
              <button
                class="p-1.5 text-gray-400 hover:text-secondary transition-colors"
                @click="toggleStatus(item)"
              >
                <svg
                  v-if="item.isActive"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
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
              </button>
            </UiTooltip>
            <UiTooltip text="Supprimer" position="left" :delay="100">
              <button
                class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                @click="deleteMentor(item)"
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
            </UiTooltip>
          </div>
        </template>
      </UiTable>
    </UiCard>

    <!-- Create/Edit Modal -->
    <UiModal
      :open="isModalOpen"
      :title="modalTitle"
      size="md"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
          v-model="form.name"
          label="Nom complet"
          placeholder="Ex: Dr. Mamadou Diallo"
          required
        />

        <div>
          <label class="block text-body-sm font-medium text-gray-700 mb-1.5">
            Expertise <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2 mb-2">
            <UiInput
              v-model="expertiseInput"
              placeholder="Ex: FinTech"
              class="flex-1"
              @keydown.enter.prevent="addExpertise"
            />
            <UiButton type="button" variant="outline" @click="addExpertise">
              Ajouter
            </UiButton>
          </div>
          <div v-if="form.expertise.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(exp, index) in form.expertise"
              :key="index"
              class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-body-sm"
            >
              {{ exp }}
              <button
                type="button"
                class="hover:text-red-500"
                @click="removeExpertise(index)"
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
          <p v-else class="text-caption text-gray-500">
            Ajoutez au moins une expertise
          </p>
        </div>

        <UiTextarea
          v-model="form.bio"
          label="Biographie"
          placeholder="Decrivez le parcours et l'experience du mentor..."
          :rows="3"
        />

        <UiInput
          v-model="form.linkedInUrl"
          label="Profil LinkedIn"
          placeholder="https://linkedin.com/in/..."
          type="url"
        />

        <div class="flex items-center gap-3">
          <input
            id="isActive"
            v-model="form.isActive"
            type="checkbox"
            class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label for="isActive" class="text-body-sm text-gray-700">
            Mentor actif
          </label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-neutral-border">
          <UiButton type="button" variant="ghost" @click="isModalOpen = false">
            Annuler
          </UiButton>
          <UiButton
            type="submit"
            :loading="isSubmitting"
            :disabled="!form.name || form.expertise.length === 0"
          >
            {{ editingMentor ? "Modifier" : "Créer" }}
          </UiButton>
        </div>
      </form>
    </UiModal>
  </div>
</template>
