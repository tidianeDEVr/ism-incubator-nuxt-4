<template>
  <section class="py-16 lg:py-24">
    <div class="container-padded">
      <div class="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-16">
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary"
          />
          <div
            class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-secondary"
          />
        </div>

        <div class="relative z-10 max-w-2xl mx-auto text-center">
          <h2 class="text-display-sm text-white mb-4">
            Pret a transformer votre idee en realite ?
          </h2>
          <p class="text-body-lg text-white/70 mb-8">
            Rejoignez notre communaute d'entrepreneurs et participez au prochain
            hackathon de l'incubateur ISM. C'est gratuit et ouvert a tous.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UiButton variant="secondary" size="lg" href="/register">
              Créer mon compte
            </UiButton>
            <UiButton
              variant="ghost"
              size="lg"
              href="/hackathons"
              class="!text-white hover:!bg-white/10"
            >
              Explorer les hackathons
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
