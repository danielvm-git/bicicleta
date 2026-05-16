<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section
      class="relative h-[90vh] flex items-center border-b-4 border-black"
    >
      <div class="container mx-auto px-4 z-10">
        <div class="max-w-4xl">
          <h1 class="text-black mb-6 animate-slide-in">
            UNCOMPROMISING<br />
            <span class="text-primary bg-black px-4">PERFORMANCE</span>
          </h1>
          <p class="font-body text-2xl mb-12 max-w-2xl leading-tight">
            The ultimate custom bicycle configuration tool. Built for those who
            demand precision, technical clarity, and market-accurate pricing.
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink to="/builder" class="brutalist-button text-xl px-8 py-4">
              Start Building
            </NuxtLink>
            <NuxtLink
              to="/components"
              class="brutalist-card px-8 py-4 font-display font-black uppercase text-xl hover:bg-black hover:text-white transition-colors"
            >
              Explore Catalog
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
        class="absolute right-0 top-0 h-full w-1/2 hidden lg:block bg-gray-100 border-l-4 border-black overflow-hidden"
      >
        <img
          src="/img/hero-bike.png"
          alt="Premium Component Close-up"
          class="w-full h-full object-cover grayscale contrast-125"
        />
        <div class="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
      </div>

      <!-- Brutalist Background Text -->
      <div
        class="absolute -bottom-20 -left-20 opacity-5 font-display font-black text-[20rem] leading-none select-none pointer-events-none"
      >
        MTB
      </div>
    </section>

    <!-- Core Features Grid -->
    <section class="bg-black text-white py-24">
      <div class="container mx-auto px-4">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white"
        >
          <div
            class="p-12 border-b-4 md:border-b-0 md:border-r-4 border-white hover:bg-primary transition-colors group"
          >
            <h3
              class="mb-4 text-4xl group-hover:translate-x-2 transition-transform"
            >
              01. SIMULATOR
            </h3>
            <p class="font-body text-lg opacity-80">
              Build your dream bike piece by piece. Real-time compatibility
              checks and weight calculation.
            </p>
          </div>
          <div
            class="p-12 border-b-4 md:border-b-0 md:border-r-4 border-white hover:bg-primary transition-colors group"
          >
            <h3
              class="mb-4 text-4xl group-hover:translate-x-2 transition-transform"
            >
              02. CATALOG
            </h3>
            <p class="font-body text-lg opacity-80">
              Over 5,000 components from the world's top brands. Verified specs
              and community reviews.
            </p>
          </div>
          <div class="p-12 hover:bg-primary transition-colors group">
            <h3
              class="mb-4 text-4xl group-hover:translate-x-2 transition-transform"
            >
              03. PRICING
            </h3>
            <p class="font-body text-lg opacity-80">
              Live market tracking from Mercado Livre. Never overpay for a
              component again.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-32 bg-white text-center">
      <div class="container mx-auto px-4">
        <h2 class="text-6xl mb-12">READY TO ASCEND?</h2>
        <NuxtLink to="/builder" class="brutalist-button text-3xl px-12 py-6">
          ENTER THE BUILDER
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-in {
  animation: slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
