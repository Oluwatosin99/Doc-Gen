<template>
    <div class="max-w-7xl mx-auto">
        <div v-if="newlyCreatedBatch.length > 0"
            class="bg-[#E6F7E6] border border-[#CCF0CC] p-8 rounded-2xl mb-8 relative">
            <button @click="newlyCreatedBatch = []"
                class="absolute top-4 right-6 text-gray-400 hover:text-[#00B800] text-[10px] font-bold uppercase tracking-widest">Dismiss</button>
            <h2 class="text-[#00B800] font-bold mb-4 uppercase text-[10px] tracking-widest">Successfully Generated {{
                newlyCreatedBatch.length }} IDs</h2>
            <div class="flex flex-wrap gap-3">
                <div v-for="id in newlyCreatedBatch" :key="id"
                    class="bg-white px-4 py-3 rounded-xl border border-[#CCF0CC] text-[#00B800] font-mono text-xs font-bold shadow-sm">
                    {{ id }}</div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-8 items-start mb-12">
            <div
                class="col-span-7 bg-white p-10 rounded-3xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
                <div class="flex items-center gap-4 mb-10">
                    <div v-for="i in 3" :key="i" class="flex items-center flex-1 last:flex-none">
                        <div :class="step >= i ? 'bg-[#00B800] text-white' : 'bg-gray-100 text-gray-400'"
                            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">{{ i }}
                        </div>
                        <div v-if="i < 3" class="flex-1 h-[2px] bg-gray-100 mx-4"></div>
                    </div>
                </div>

                <div v-if="step === 1" class="space-y-6 flex-1 flex flex-col">
                    <h2 class="text-[#00B800] font-bold text-xl">General Information</h2>
                    <select v-model="form.company"
                        class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 text-sm outline-none">
                        <option value="REN">Renaissance Africa Energy (REN)</option>
                        <option value="RBO">Renaissance Business Ops (RBO)</option>
                    </select>
                    <input v-model="form.title" type="text" placeholder="Document Title..."
                        class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 text-sm outline-none">
                    <button @click="step = 2" :disabled="!form.company || !form.title"
                        class="w-1/3 mt-auto bg-[#FF7A00] text-white py-4 rounded-xl font-bold hover:bg-[#ff0000]">Next Step ></button>
                </div>

                <div v-if="step === 2" class="space-y-6 flex-1 flex flex-col">
                    <h2 class="text-[#00B800] font-bold text-xl">Function & Medium</h2>
                    <select v-model="form.function"
                        class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 text-sm outline-none">
                        <option value="FIN">Finance</option>
                        <option value="GAS">Gas</option>
                    </select>
                    <select v-model="form.medium"
                        class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 text-sm outline-none">
                        <option value="MOM">Minutes of Meeting</option>
                        <option value="TRANS">Transmittal</option>
                    </select>
                    <div class="flex gap-4 mt-auto">
                        <button @click="step = 1" class="flex-1 border border-green-500 text-green-500 py-4 rounded-xl font-bold hover:bg-[#00B800] hover:text-white ">< Back</button>
                        <button @click="step = 3" class="flex-1 bg-[#FF7A00] text-white py-4 rounded-xl font-bold hover:bg-[#ff0000]">Next
                            Step ></button>
                    </div>
                </div>

                <div v-if="step === 3" class="space-y-6 flex-1 flex flex-col">
                    <h2 class="text-[#00B800] font-bold text-xl">Team & Sequence</h2>
                    <select v-model="form.team"
                        class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-[#00B800]">
                        <option value="GEO">Geology</option>
                        <option value="RSV">Reservoir</option>
                    </select>
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.sequence" type="number"
                            class="w-full bg-[#F9FAFB] border rounded-xl p-4 text-sm focus:ring-1 focus:ring-[#00B800]">
                        <input v-model="form.quantity" type="number" min="1"
                            class="w-full bg-[#F9FAFB] border rounded-xl p-4 text-sm focus:ring-1 focus:ring-[#00B800]">
                    </div>
                    <div class="flex gap-4 mt-auto">
                        <button @click="step = 2" class="flex-1 border  border-green-500 text-green-500 py-4 rounded-xl font-bold hover:bg-[#00B800] hover:text-white"> < Back</button>
                        <button @click="handleGenerate"
                            class="flex-1 bg-[#FF7A00] text-white py-4 rounded-xl font-bold hover:bg-[#ff0000]">Generate ID  ></button>
                    </div>
                </div>
            </div>

            <div class="col-span-5 space-y-4">
                <div class="bg-[#00B800] rounded-[32px] p-10 text-white shadow-xl relative overflow-hidden">
                    <div class="text-xl font-mono font-bold mb-10 tracking-widest uppercase">{{ previewId }}</div>
                    <div class="space-y-4 text-xs">
                        <div class="flex justify-between border-b border-white/10 pb-2"><span
                                class="opacity-60 uppercase">Company</span><span class="font-bold">{{ form.company ||
                                '???' }}</span></div>
                        <div class="flex justify-between border-b border-white/10 pb-2"><span
                                class="opacity-60 uppercase">Function</span><span class="font-bold">{{ form.function ||
                                '???' }}</span></div>
                        <div class="flex justify-between border-b border-white/10 pb-2"><span
                                class="opacity-60 uppercase">Medium</span><span class="font-bold">{{ form.medium ||
                                '???' }}</span></div>
                        <div class="flex justify-between border-b border-white/10 pb-2"><span
                                class="opacity-60 uppercase">Team</span><span class="font-bold">{{ form.team || '???'
                                }}</span></div>
                    </div>
                    <button
                        class="w-full mt-10 bg-[#FF7A00] py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
                        <Copy :size="20" /> Copy ID
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-[32px] border p-10 shadow-sm">
            <h3 class="font-bold text-[#00B800] text-lg mb-6">My Document Numbers</h3>
            <DocumentTable :documents="myDocs" :is-admin="false" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Copy, ChevronRight } from 'lucide-vue-next';
const { myDocs, addDocuments } = useDocuments();

const step = ref(1);
const newlyCreatedBatch = ref([]);
const form = ref({ company: 'REN', title: '', function: 'FIN', medium: 'MOM', team: 'GEO', sequence: 1, quantity: 1 });

const previewId = computed(() => {
    const s = String(form.value.sequence).padStart(4, '0');
    return `${form.value.company}-${form.value.function}-${form.value.medium}-${form.value.team}-2026-${s}`;
});

const handleGenerate = () => {
    const batch = [];
    for (let i = 0; i < form.value.quantity; i++) {
        const s = String(Number(form.value.sequence) + i).padStart(4, '0');
        batch.push({
            id: `${form.value.company}-${form.value.function}-${form.value.medium}-${form.value.team}-2026-${s}`,
            title: form.value.title,
            author: 'Bimbola A.',
            time: 'Just Now',
            team: form.value.team,
            type: form.value.medium
        });
    }
    newlyCreatedBatch.value = batch.map(d => d.id);
    addDocuments(batch);
    step.value = 1;
};
</script>