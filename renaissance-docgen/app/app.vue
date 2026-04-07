<template>
  <div class="min-h-screen transition-colors duration-300 
              bg-white dark:bg-[#0B1511] text-gray-900 dark:text-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// You can add global transitions or head metadata here if needed
useHead({
  title: 'Renaissance | Document Generator',
  meta: [
    { name: 'description', content: 'Corporate document identifier system.' }
  ],
})
</script>

<style>
/* Global styles to match your UI's clean look */
body {
  background-color: #F9FAFB;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dark body {
  background-color: #0B1511;
}

/* Optional: Smooth page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>