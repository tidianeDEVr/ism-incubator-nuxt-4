<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useHead({
  title: "Connexion - ISM Incubator",
});

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");

async function handleSubmit() {
  error.value = "";
  isLoading.value = true;

  // Simulate login
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (!email.value || !password.value) {
    error.value = "Veuillez remplir tous les champs";
    isLoading.value = false;
    return;
  }

  // Redirect based on mock user (for demo purposes)
  if (email.value.includes("admin")) {
    navigateTo("/admin");
  } else if (email.value.includes("mentor")) {
    navigateTo("/mentor");
  } else {
    navigateTo("/participant");
  }

  isLoading.value = false;
}
</script>

<template>
  <div>
    <h1 class="text-display-sm text-primary mb-2">Connexion</h1>
    <p class="text-body text-gray-600 mb-8">
      Connectez-vous pour acceder a votre espace
    </p>

    <UiAlert
      v-if="error"
      variant="error"
      class="mb-6"
      dismissible
      @dismiss="error = ''"
    >
      {{ error }}
    </UiAlert>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <UiInput
        v-model="email"
        type="email"
        label="Email"
        placeholder="votre@email.com"
        required
      />

      <UiInput
        v-model="password"
        type="password"
        label="Mot de passe"
        placeholder="Votre mot de passe"
        required
      />

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span class="text-body-sm text-gray-600">Se souvenir de moi</span>
        </label>
        <NuxtLink
          to="/forgot-password"
          class="text-body-sm text-secondary hover:underline"
        >
          Mot de passe oublie ?
        </NuxtLink>
      </div>

      <UiButton
        type="submit"
        variant="secondary"
        size="lg"
        full-width
        :loading="isLoading"
      >
        Se connecter
      </UiButton>
    </form>

    <div class="mt-8 text-center">
      <p class="text-body-sm text-gray-600">
        Pas encore de compte ?
        <NuxtLink
          to="/register"
          class="text-secondary font-medium hover:underline"
        >
          Créer un compte
        </NuxtLink>
      </p>
    </div>

    <!-- Demo credentials -->
    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
      <p class="text-caption text-gray-500 mb-2">Comptes de demonstration:</p>
      <ul class="text-caption text-gray-600 space-y-1">
        <li>admin@ism.sn - Acces Admin</li>
        <li>mentor@ism.sn - Acces Mentor</li>
        <li>participant@ism.sn - Acces Participant</li>
      </ul>
    </div>
  </div>
</template>
