<template>
    <div class="flex items-center gap-4 mb-10">
        <template v-for="n in 3" :key="n">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors"
                :class="currentStep >= n ? 'bg-[#00B800] text-white' : 'bg-gray-100 text-gray-300'">
                {{ n }}
            </div>
            <div v-if="n < 3" class="flex-1 h-[2px] bg-gray-100"></div>
        </template>
    </div>
</template>

<script setup>
defineProps({ currentStep: { type: Number, default: 1 } });
</script>