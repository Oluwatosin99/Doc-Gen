<template>
    <div class="max-w-7xl mx-auto px-6 py-10">
        <div v-if="newlyCreatedBatch.length > 0"
            class="bg-[#E6F7E6] p-10 rounded-[32px] mb-12 relative border border-[#CCF0CC]">
            <button @click="newlyCreatedBatch = []"
                class="absolute top-6 right-8 text-gray-400 font-bold capitalize text-[10px] tracking-widest hover:text-[#00B800]">Dismiss</button>
            <div class="mb-6">
                <h2 class="text-[#00B800] font-black text-lg">Successfully Generated {{ newlyCreatedBatch.length }} IDs
                </h2>
                <p class="text-gray-500 text-xs mt-1">Your new document identifiers are ready to use.</p>
            </div>
            <div class="flex flex-wrap gap-4">
                <div v-for="id in newlyCreatedBatch" :key="id"
                    class="group relative bg-[#0B1511] px-6 py-8 rounded-2xl border border-white/5 min-w-[300px] flex items-center justify-between transition-all hover:border-[#00B800]/50">
                    <span class="text-[#00B800] font-mono text-sm font-bold tracking-wider">{{ id }}</span>
                    <button @click="copyText(id)"
                        class="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1 transition-opacity duration-300">
                        <Copy :size="14" class="text-[#00B800]" />
                        <span class="text-[8px] font-bold text-[#00B800] capitalize">Copy</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-10 items-start">
            <div
                class="col-span-7 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm min-h-[550px] flex flex-col dark:bg-gray-800 dark:border-none">
                <div class="flex items-center gap-4 mb-12">
                    <div v-for="i in 3" :key="i" class="flex items-center flex-1 last:flex-none">
                        <div :class="step >= i ? 'bg-[#00B800] text-white shadow-lg shadow-green-100' : 'bg-gray-100 text-gray-400'"
                            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                            <span v-if="step > i">
                                <Check :size="18" />
                            </span>
                            <span v-else>{{ i }}</span>
                        </div>
                        <div v-if="i < 3" class="flex-1 h-[2px] bg-gray-100 mx-4"></div>
                    </div>
                </div>

                <div v-if="step === 1" class="space-y-8 flex-1 flex flex-col dark:bg-gray-900 p-8 rounded-2xl">
                    <h2 class="font-semibold text-[#00B800] text-2xl tracking-tight">General Information</h2>
                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Select
                            Company</label>
                        <select v-model="form.company"
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                            <option value="">Select Company</option>
                            <option value="REN">Renaissance Africa Energy Limited (REN)</option>
                            <option value="RBO">Renaissance Business Operations (RBO)</option>
                        </select>
                    </div>
                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Enter Document
                            Title</label>
                        <input v-model="form.title" type="text" placeholder="Type document title here..."
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                    </div>
                    <button v-ripple @click="step = 2" :disabled="!form.company || !form.title"
                        class="w-1/2 mt-auto bg-[#FF7A00] text-white py-5 rounded-2xl font-black text-sm capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden transition-all hover:translate-x-1">
                        Next Step
                        <ChevronRight :size="18" />
                    </button>
                </div>

                <div v-if="step === 2" class="space-y-8 flex-1 flex flex-col dark:bg-gray-900 p-8 rounded-2xl">
                    <h2 class="font-semibold text-[#00B800] text-2xl tracking-tight">Function & Medium</h2>
                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Select
                            Function</label>
                        <select v-model="form.function"
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                            <option value="FIN">Finance</option>
                            <option value="GAS">Gas</option>
                            <option value="HR">Human Resources</option>
                        </select>
                    </div>
                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Correspondence
                            Medium</label>
                        <select v-model="form.medium"
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                            <option value="MOM">Minutes of Meeting</option>
                            <option value="TRANS">Transmittal</option>
                            <option value="MEMO">Internal Memo</option>
                        </select>
                    </div>
                    <div class="flex gap-4 mt-auto">
                        <button v-ripple @click="step = 1"
                            class="flex-1 border-2 border-green-500 text-green-500 py-5 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden hover:bg-[#00B800] hover:text-white"><ChevronLeft :size="18" /> Back</button>
                        <button v-ripple @click="step = 3"
                            class="flex-1 bg-[#FF7A00] text-white py-5 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden">Next Step <ChevronRight :size="18" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 3" class="space-y-8 flex-1 flex flex-col dark:bg-gray-900 p-8 rounded-2xl">
                    <h2 class="font-semibold text-[#00B800] text-2xl tracking-tight">Team & Sequence</h2>
                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Select
                            Team</label>
                        <select v-model="form.team"
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                            <option value="GEO">Geology</option>
                            <option value="RSV">Reservoir</option>
                            <option value="SCM">Supply Chain</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="space-y-3">
                            <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Starting
                                Sequence</label>
                            <input v-model="form.sequence" type="number"
                                class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Quantity To
                                Generate</label>
                            <input v-model="form.quantity" type="number" min="1"
                                class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border dark:text-white">
                        </div>
                    </div>
                    <div class="flex gap-4 mt-auto">
                        <button v-ripple @click="step = 2"
                            class="flex-1 border-2  border-green-500 text-green-500  py-5 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden hover:bg-[#00B800] hover:text-white"><ChevronLeft :size="18" />Back</button>
                        <button v-ripple @click="handleGenerate"
                            class="flex-1 bg-[#FF7A00] text-white py-5 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden">Generate
                            ID <ChevronRight :size="18" /></button>
                    </div>
                </div>
            </div>

            <div class="col-span-5 space-y-4">
                <div class="bg-[#00B800] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div class="text-xl font-mono font-bold mb-10 tracking-widest uppercase">
                        {{ form.company || '???' }}-{{ form.function || '???' }}-{{ form.medium || '???' }}-{{ form.team
                            || '???' }}-2026-{{ String(form.sequence).padStart(4, '0') }}
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between text-xs border-b border-white/10 pb-2 ">
                            <span class="opacity-60 uppercase">Company</span> <span class="font-bold">{{ form.company ||
                                'Not set' }}</span>
                        </div>
                        <div class="flex justify-between text-xs border-b border-white/10 pb-2">
                            <span class="opacity-60 uppercase">Function</span> <span class="font-bold">{{ form.function
                                || 'Not set' }}</span>
                        </div>
                        <div class="flex justify-between text-xs border-b border-white/10 pb-2">
                            <span class="opacity-60 uppercase">Medium</span> <span class="font-bold">{{ form.medium ||
                                'Not set' }}</span>
                        </div>
                        <div class="flex justify-between text-xs border-b border-white/10 pb-2">
                            <span class="opacity-60 uppercase">Team</span> <span class="font-bold">{{ form.team || 'Not set' }} </span>
                        </div>
                    </div>
                    <button
                        class="w-full mt-8 bg-[#FF7A00] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Copy :size="18" /> Copy ID
                    </button>
                </div>

                <div class="bg-white border border-gray-100 rounded-2xl p-4 dark:bg-gray-800 dark:border-none dark:text-white shadow-sm flex items-center gap-3">
                    <div class="text-[#00B800]">
                        <Info :size="20" />
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-[#00B800] uppercase">Document Title</div>
                        <div class="text-sm font-medium text-gray-500 italic dark:text-gray-300">"{{ form.title || 'No title entered yet...' }}"</div>
                    </div>
                </div>
            </div>

        </div>

        <div class="mt-16 bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm dark:bg-gray-800 dark:border-none">
            <div class="mb-8">
                <h3 class="font-semibold text-[#00B800] text-2xl tracking-tight">My Document Numbers</h3>
                <p class="text-gray-400 text-[10px] font-bold capitalize tracking-widest mt-1">A list of document
                    identifiers you have generated.</p>
            </div>
            <DocumentTable :documents="myDocs" :is-admin="false" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Copy, ChevronRight, ChevronLeft,  Check, Info } from 'lucide-vue-next';

const { myDocs, addDocuments } = useDocuments();
const step = ref(1);
const newlyCreatedBatch = ref([]);
const form = ref({ company: '', title: '', function: 'FIN', medium: 'MOM', team: 'GEO', sequence: 1, quantity: 1 });

const previewId = computed(() => {
    const s = String(form.value.sequence).padStart(4, '0');
    const co = form.value.company || '???';
    return `${co}-${form.value.function}-${form.value.medium}-${form.value.team}-2026-${s}`;
});

const handleGenerate = () => {
    const batch = [];
    for (let i = 0; i < form.value.quantity; i++) {
        const s = String(Number(form.value.sequence) + i).padStart(4, '0');
        batch.push({
            id: `${form.value.company}-${form.value.function}-${form.value.medium}-${form.value.team}-2026-${s}`,
            title: form.value.title,
            author: 'Bimbola A.',
            team: form.value.team,
            type: form.value.medium
        });
    }
    newlyCreatedBatch.value = batch.map(d => d.id);
    addDocuments(batch);
    step.value = 1;
};

const copyText = (text) => navigator.clipboard.writeText(text);

const vRipple = {
    mounted(el) {
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.addEventListener('mousedown', (e) => {
            const rect = el.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }
};
</script>

<style>
/* Same ripple styles as component */
.ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
</style>