<template>
    <div class="bg-[#00B800] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <FileText class="absolute -right-4 -top-4 opacity-10 w-32 h-32 rotate-12" />
        <div class="text-xl font-mono font-bold mb-10 tracking-widest relative z-10 uppercase">
            {{ previewId }}
        </div>
        <div class="space-y-3 relative z-10">
            <div class="flex justify-between text-xs border-b border-white/20 pb-2">
                <span class="opacity-60">Company</span> <span class="font-bold">{{ form.company || 'Not set' }}</span>
            </div>
            <div class="flex justify-between text-xs border-b border-white/20 pb-2">
                <span class="opacity-60">Function</span> <span class="font-bold">{{ form.function || 'Not set' }}</span>
            </div>
        </div>
        <button
            class="w-full mt-8 bg-[#FF7A00] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Copy :size="18" /> Copy ID
        </button>
    </div>
</template>

<script setup>
import { FileText, Copy } from 'lucide-vue-next';
const props = defineProps(['form']);

const previewId = computed(() => {
    const co = props.form.company ? props.form.company.substring(0, 3).toUpperCase() : '???';
    const fn = props.form.function ? props.form.function.substring(0, 3).toUpperCase() : '???';
    return `${co}-${fn}-TRANS-RSV-2026-0001`;
});
</script>