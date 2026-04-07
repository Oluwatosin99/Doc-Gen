<script setup>
const colorMode = useColorMode()

const toggleDark = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
    <button @click="toggleDark" v-ripple
        class="p-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-[#00B800] transition-all">
        <Sun v-if="colorMode.value === 'dark'" :size="20" />
        <Moon v-else :size="20" />
    </button>
</template>