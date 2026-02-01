<script setup lang="ts">
useHead({
  title: 'Accueil - ISM Incubator',
  meta: [
    {
      name: 'description',
      content: 'L\'incubateur de l\'ISM accompagne les porteurs de projets innovants. Participez a nos hackathons et donnez vie a vos ambitions entrepreneuriales.',
    },
  ],
})
</script>

<template>
  <div>
    <HeroSection />
    <WhySection />
    <HackathonListing />
    <ImmersiveGameSection />
    <ResourcesSection />
    <AchievementsSection />
    <CTASection />
  </div>
</template>
