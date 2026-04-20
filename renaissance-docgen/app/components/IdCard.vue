<template>
    <div class="bg-[#00B800] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <FileText class="absolute -right-4 -top-4 opacity-10 w-32 h-32 rotate-12" />

        <div class="text-xl font-mono font-bold mb-10 tracking-widest relative z-10 uppercase">
            {{ previewId }}
        </div>

        <div class="space-y-3 relative z-10">
            <div class="flex justify-between text-xs border-b border-white/20 pb-2">
                <span class="opacity-60 uppercase tracking-wider">Company</span>
                <span class="font-bold">{{ form.company || 'Not set' }}</span>
            </div>

            <div class="flex justify-between text-xs border-b border-white/20 pb-2">
                <span class="opacity-60 uppercase tracking-wider">Function</span>
                <span class="font-bold">{{ form.function || 'Not set' }}</span>
            </div>

            <div class="flex justify-between text-xs border-b border-white/20 pb-2">
                <span class="opacity-60 uppercase tracking-wider">Medium</span>
                <span class="font-bold">{{ form.medium || 'Not set' }}</span>
            </div>
        </div>

        <button @click="$emit('copy', previewId)"
            class="w-full mt-8 bg-[#FF7A00] hover:bg-[#e66e00] transition-colors text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Copy :size="18" /> Copy ID
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { FileText, Copy } from 'lucide-vue-next';

const props = defineProps(['form']);
defineEmits(['copy']);

const previewId = computed(() => {
    const co = props.form.company || '???';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // We use a placeholder for the sequence since the DB generates it
    return `${co}-${year}-${month}-????`;
});
</script>