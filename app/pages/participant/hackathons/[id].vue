<script setup lang="ts">
import { mockHackathons } from "~/data/mock";
import type { HackathonStatus } from "~/types";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();

const hackathon = computed(() =>
  mockHackathons.find((h) => h.id === route.params.id),
);

useHead({
  title: computed(() => hackathon.value?.title || "Hackathon"),
});

// State
const isRegistrationModalOpen = ref(false);
const registrationType = ref<"solo" | "team">("solo");
const isSubmitting = ref(false);
const isRegistered = ref(false);

// Form
const teamForm = ref({
  teamName: "",
  description: "",
  members: [""],
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isRegistrationOpen() {
  if (!hackathon.value) return false;
  const now = new Date();
  const start = new Date(hackathon.value.registrationStart);
  const end = new Date(hackathon.value.registrationEnd);
  return now >= start && now <= end;
}

function addTeamMember() {
  if (teamForm.value.members.length < 5) {
    teamForm.value.members.push("");
  }
}

function removeTeamMember(index: number) {
  if (teamForm.value.members.length > 1) {
    teamForm.value.members.splice(index, 1);
  }
}

async function handleRegistration() {
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  isSubmitting.value = false;
  isRegistrationModalOpen.value = false;
  isRegistered.value = true;
}

const statusConfig: Record<HackathonStatus, { label: string; class: string }> =
  {
    draft: { label: "Brouillon", class: "bg-gray-100 text-gray-700" },
    upcoming: { label: "A venir", class: "bg-blue-100 text-blue-700" },
    active: { label: "En cours", class: "bg-green-100 text-green-700" },
    evaluation: { label: "Evaluation", class: "bg-amber-100 text-amber-700" },
    completed: { label: "Termine", class: "bg-gray-100 text-gray-700" },
  };
</script>

<template>
  <div v-if="hackathon">
    <div class="flex items-center gap-2 text-body-sm text-gray-500 mb-6">
      <NuxtLink to="/participant/hackathons" class="hover:text-primary">
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
      <span class="text-gray-900">{{ hackathon.title }}</span>
    </div>

    <div class="relative mb-8 rounded-xl overflow-hidden">
      <div class="h-64 bg-gray-200">
        <img
          v-if="hackathon.coverImage"
          :src="hackathon.coverImage"
          :alt="hackathon.title"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
      />
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="flex items-center gap-3 mb-2">
          <UiBadge
            variant="default"
            size="sm"
            class="bg-white/20 text-white border-0"
          >
            {{ hackathon.category }}
          </UiBadge>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              statusConfig[hackathon.status].class,
            ]"
          >
            {{ statusConfig[hackathon.status].label }}
          </span>
        </div>
        <h1 class="text-heading-lg text-white mb-2">{{ hackathon.title }}</h1>
        <p class="text-body text-white/80">{{ hackathon.shortDescription }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">A propos</h2>
          <p class="text-body text-gray-600 whitespace-pre-line">
            {{ hackathon.description }}
          </p>
        </UiCard>

        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Calendrier</h2>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full bg-primary" />
                <div class="flex-1 w-0.5 bg-gray-200" />
              </div>
              <div class="pb-6">
                <h3 class="text-body font-medium text-gray-900">
                  Inscriptions
                </h3>
                <p class="text-body-sm text-gray-500">
                  {{ formatDate(hackathon.registrationStart) }} -
                  {{ formatDate(hackathon.registrationEnd) }}
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full bg-secondary" />
                <div class="flex-1 w-0.5 bg-gray-200" />
              </div>
              <div class="pb-6">
                <h3 class="text-body font-medium text-gray-900">Soumissions</h3>
                <p class="text-body-sm text-gray-500">
                  {{ formatDate(hackathon.submissionStart) }} -
                  {{ formatDate(hackathon.submissionEnd) }}
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full bg-purple-500" />
              </div>
              <div>
                <h3 class="text-body font-medium text-gray-900">
                  Evaluation & Resultats
                </h3>
                <p class="text-body-sm text-gray-500">
                  {{ formatDate(hackathon.evaluationStart) }} -
                  {{ formatDate(hackathon.evaluationEnd) }}
                </p>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard v-if="hackathon.prizes.length > 0">
          <h2 class="text-heading-sm text-primary mb-4">Prix</h2>
          <div class="grid sm:grid-cols-3 gap-4">
            <div
              v-for="prize in hackathon.prizes"
              :key="prize.position"
              :class="[
                'p-4 rounded-lg text-center',
                prize.position === 1
                  ? 'bg-amber-50 border-2 border-amber-200'
                  : prize.position === 2
                    ? 'bg-gray-50 border border-gray-200'
                    : 'bg-orange-50 border border-orange-200',
              ]"
            >
              <div
                :class="[
                  'w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl font-bold',
                  prize.position === 1
                    ? 'bg-amber-400 text-white'
                    : prize.position === 2
                      ? 'bg-gray-400 text-white'
                      : 'bg-orange-400 text-white',
                ]"
              >
                {{ prize.position }}
              </div>
              <h3 class="text-body font-semibold text-gray-900 mb-1">
                {{ prize.title }}
              </h3>
              <p
                v-if="prize.value"
                class="text-heading-sm text-secondary font-bold"
              >
                {{ prize.value }}
              </p>
              <p class="text-body-sm text-gray-500 mt-2">
                {{ prize.description }}
              </p>
            </div>
          </div>
        </UiCard>
      </div>

      <div class="space-y-6">
        <UiCard class="sticky top-24">
          <div class="text-center mb-4">
            <div class="flex items-center justify-center gap-4 mb-4">
              <div class="text-center">
                <div class="text-heading-sm text-primary font-bold">
                  {{ hackathon.participantCount }}
                </div>
                <div class="text-caption text-gray-500">Participants</div>
              </div>
              <div class="w-px h-8 bg-gray-200" />
              <div class="text-center">
                <div class="text-heading-sm text-primary font-bold">
                  {{ hackathon.projectCount }}
                </div>
                <div class="text-caption text-gray-500">Projets</div>
              </div>
            </div>
          </div>

          <div
            v-if="isRegistered"
            class="p-4 bg-green-50 border border-green-200 rounded-lg mb-4"
          >
            <div class="flex items-center gap-2 text-green-700">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-body-sm font-medium">Vous etes inscrit!</span>
            </div>
          </div>

          <UiButton
            v-if="isRegistrationOpen() && !isRegistered"
            full-width
            @click="isRegistrationModalOpen = true"
          >
            S'inscrire maintenant
          </UiButton>

          <UiButton
            v-else-if="isRegistered"
            variant="secondary"
            full-width
            href="/participant/projects"
          >
            Voir mes projets
          </UiButton>

          <div v-else class="text-center">
            <p class="text-body-sm text-gray-500">
              Les inscriptions sont fermees
            </p>
          </div>

          <div class="mt-4 pt-4 border-t border-neutral-border">
            <h4 class="text-body-sm font-medium text-gray-900 mb-2">
              Dates cles
            </h4>
            <dl class="space-y-2 text-body-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">Inscriptions</dt>
                <dd class="text-gray-900">
                  {{ formatDate(hackathon.registrationEnd) }}
                </dd>
              </div>
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
          </div>
        </UiCard>
      </div>
    </div>

    <UiModal
      :open="isRegistrationModalOpen"
      title="Inscription au hackathon"
      size="md"
      @close="isRegistrationModalOpen = false"
    >
      <form @submit.prevent="handleRegistration" class="space-y-6">
        <div>
          <label class="block text-body-sm font-medium text-gray-700 mb-3">
            Type d'inscription
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              :class="[
                'p-4 rounded-lg border-2 text-center transition-all',
                registrationType === 'solo'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
              @click="registrationType = 'solo'"
            >
              <svg
                class="w-8 h-8 mx-auto mb-2 text-gray-600"
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
              <div class="text-body-sm font-medium text-gray-900">Solo</div>
              <div class="text-caption text-gray-500">Participer seul</div>
            </button>
            <button
              type="button"
              :class="[
                'p-4 rounded-lg border-2 text-center transition-all',
                registrationType === 'team'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
              @click="registrationType = 'team'"
            >
              <svg
                class="w-8 h-8 mx-auto mb-2 text-gray-600"
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
              <div class="text-body-sm font-medium text-gray-900">Equipe</div>
              <div class="text-caption text-gray-500">2-5 membres</div>
            </button>
          </div>
        </div>

        <template v-if="registrationType === 'team'">
          <UiInput
            v-model="teamForm.teamName"
            label="Nom de l'equipe"
            placeholder="Ex: Team Innovation"
            required
          />

          <UiTextarea
            v-model="teamForm.description"
            label="Description de l'equipe"
            placeholder="Decrivez votre equipe en quelques mots..."
            rows="2"
          />

          <div>
            <label class="block text-body-sm font-medium text-gray-700 mb-2">
              Membres de l'equipe (emails)
            </label>
            <div class="space-y-2">
              <div
                v-for="(_, index) in teamForm.members"
                :key="index"
                class="flex gap-2"
              >
                <UiInput
                  v-model="teamForm.members[index]"
                  placeholder="email@example.com"
                  type="email"
                  class="flex-1"
                />
                <button
                  v-if="teamForm.members.length > 1"
                  type="button"
                  class="p-2 text-gray-400 hover:text-red-500"
                  @click="removeTeamMember(index)"
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
            <button
              v-if="teamForm.members.length < 5"
              type="button"
              class="mt-2 text-body-sm text-secondary hover:underline"
              @click="addTeamMember"
            >
              + Ajouter un membre
            </button>
          </div>
        </template>

        <div class="flex justify-end gap-3 pt-4 border-t border-neutral-border">
          <UiButton
            type="button"
            variant="ghost"
            @click="isRegistrationModalOpen = false"
          >
            Annuler
          </UiButton>
          <UiButton type="submit" :loading="isSubmitting">
            Confirmer l'inscription
          </UiButton>
        </div>
      </form>
    </UiModal>
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
    <p class="text-body text-gray-500 mb-4">Hackathon non trouve</p>
    <UiButton variant="outline" href="/participant/hackathons">
      Retour aux hackathons
    </UiButton>
  </UiCard>
</template>
