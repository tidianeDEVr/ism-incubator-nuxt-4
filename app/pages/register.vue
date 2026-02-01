<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Inscription - ISM Incubator',
})

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const isLoading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''

  // Validation
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
    error.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  if (formData.password !== formData.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (formData.password.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caracteres'
    return
  }

  if (!formData.acceptTerms) {
    error.value = 'Veuillez accepter les conditions d\'utilisation'
    return
  }

  isLoading.value = true

  // Simulate registration
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Redirect to login
  navigateTo('/login')

  isLoading.value = false
}
</script>

<template>
  <div>
    <h1 class="text-display-sm text-primary mb-2">Creer un compte</h1>
    <p class="text-body text-gray-600 mb-8">
      Rejoignez la communaute ISM Incubator
    </p>

    <UiAlert v-if="error" variant="error" class="mb-6" dismissible @dismiss="error = ''">
      {{ error }}
    </UiAlert>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <UiInput
          v-model="formData.firstName"
          label="Prenom"
          placeholder="Votre prenom"
          required
        />
        <UiInput
          v-model="formData.lastName"
          label="Nom"
          placeholder="Votre nom"
          required
        />
      </div>

      <UiInput
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="votre@email.com"
        required
      />

      <UiInput
        v-model="formData.password"
        type="password"
        label="Mot de passe"
        placeholder="Minimum 8 caracteres"
        hint="Le mot de passe doit contenir au moins 8 caracteres"
        required
      />

      <UiInput
        v-model="formData.confirmPassword"
        type="password"
        label="Confirmer le mot de passe"
        placeholder="Repetez votre mot de passe"
        required
      />

      <label class="flex items-start gap-3 cursor-pointer">
        <input
          v-model="formData.acceptTerms"
          type="checkbox"
          class="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
        >
        <span class="text-body-sm text-gray-600">
          J'accepte les
          <NuxtLink to="/terms" class="text-secondary hover:underline">conditions d'utilisation</NuxtLink>
          et la
          <NuxtLink to="/privacy" class="text-secondary hover:underline">politique de confidentialite</NuxtLink>
        </span>
      </label>

      <UiButton
        type="submit"
        variant="secondary"
        size="lg"
        full-width
        :loading="isLoading"
      >
        Creer mon compte
      </UiButton>
    </form>

    <div class="mt-8 text-center">
      <p class="text-body-sm text-gray-600">
        Deja un compte ?
        <NuxtLink to="/login" class="text-secondary font-medium hover:underline">
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
