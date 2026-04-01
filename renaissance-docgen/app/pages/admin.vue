<template>
    <div class="max-w-7xl mx-auto">
        <div v-if="generatedIds.length > 0" class="bg-[#E6F7E6] border border-[#CCF0CC] p-8 rounded-2xl mb-8 relative">
            <button @click="generatedIds = []"
                class="absolute top-4 right-6 text-gray-400 hover:text-[#00B800] text-xs font-bold">Dismiss</button>
            <h2 class="text-[#00B800] font-bold mb-4 uppercase text-xs">Successfully Generated {{ generatedIds.length }}
                IDs</h2>
            <div class="grid grid-cols-4 gap-3">
                <div v-for="id in generatedIds" :key="id"
                    class="bg-white p-4 rounded-xl border border-[#CCF0CC] text-[#00B800] font-mono text-xs font-bold shadow-sm">
                    {{ id }}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-8 items-start mb-12">
            <div class="col-span-7 bg-white p-10 rounded-3xl border shadow-sm min-h-[480px] flex flex-col">
                <div class="flex items-center gap-4 mb-10">
                    <div :class="step >= 1 ? 'bg-[#00B800] text-white' : 'bg-gray-100 text-gray-400'"
                        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">1</div>
                    <div class="flex-1 h-[2px] bg-gray-100"></div>
                    <div :class="step >= 2 ? 'bg-[#00B800] text-white' : 'bg-gray-100 text-gray-400'"
                        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                    <div class="flex-1 h-[2px] bg-gray-100"></div>
                    <div :class="step >= 3 ? 'bg-[#00B800] text-white' : 'bg-gray-100 text-gray-400'"
                        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">3</div>
                </div>

                <div v-if="step === 1" class="space-y-6 flex-1">
                    <h2 class="text-[#00B800] font-bold text-lg">General Information</h2>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase">Select Company</label>
                        <select v-model="form.company"
                            class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-3 mt-2">
                            <option value="REN">Renaissance Africa Energy Limited (REN)</option>
                            <option value="RBO">Renaissance Business Operations (RBO)</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase">Enter Document Title</label>
                        <input v-model="form.title" type="text" placeholder="Type document title here..."
                            class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-3 mt-2">
                    </div>
                    <button @click="step = 2" :disabled="!form.company || !form.title"
                        class="w-full mt-auto bg-[#FF7A00] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold">Next
                        Step</button>
                </div>

                <div v-if="step === 2" class="space-y-6 flex-1">
                    <h2 class="text-[#00B800] font-bold text-lg">Function & Medium</h2>
                    <select v-model="form.function" class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
                        <option value="FIN">Finance</option>
                        <option value="TEC">Technical</option>
                    </select>
                    <select v-model="form.medium" class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
                        <option value="MOM">Minutes of Meeting</option>
                        <option value="DOC">Document</option>
                    </select>
                    <div class="flex gap-4 mt-auto">
                        <button @click="step = 1"
                            class="flex-1 border border-gray-200 py-4 rounded-xl font-bold">Back</button>
                        <button @click="step = 3" class="flex-1 bg-[#FF7A00] text-white py-4 rounded-xl font-bold">Next
                            Step</button>
                    </div>
                </div>

                <div v-if="step === 3" class="space-y-6 flex-1">
                    <h2 class="text-[#00B800] font-bold text-lg">Team & Sequence</h2>
                    <select v-model="form.team" class="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
                        <option value="GEO">Geology</option>
                        <option value="RSV">Reservoir</option>
                    </select>
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.sequence" type="number" placeholder="Starting Sequence"
                            class="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
                        <input v-model="form.quantity" type="number" placeholder="Quantity"
                            class="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
                    </div>
                    <div class="flex gap-4 mt-auto">
                        <button @click="step = 2"
                            class="flex-1 border border-gray-200 py-4 rounded-xl font-bold">Back</button>
                        <button @click="generate"
                            class="flex-1 bg-[#FF7A00] text-white py-4 rounded-xl font-bold">Generate ID</button>
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
                        <div class="flex justify-between text-xs border-b border-white/10 pb-2">
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

                <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                    <div class="text-[#00B800]">
                        <Info :size="20" />
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-[#00B800] uppercase">Document Title</div>
                        <div class="text-sm font-medium text-gray-500 italic">"{{ form.title || 'No title entered yet...' }}"</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 class="font-bold text-[#00B800] mb-6">{{ isAdmin ? 'Global Activity Report' : 'My Document Numbers' }}
            </h3>
            <DocumentTable :documents="myDocs" :is-admin="false" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['isAdmin']);
const step = ref(1);
const generatedIds = ref([]);
const form = ref({ company: '', title: '', function: '', medium: '', team: '', sequence: 1, quantity: 1 });

const handleGenerate = () => {
    const batch = [];

    for (let i = 0; i < form.value.quantity; i++) {
        const seq = String(Number(form.value.sequence) + i).padStart(4, '0');
        const newId = `${form.value.company}-${form.value.function}-${form.value.medium}-${form.value.team}-2026-${seq}`;

        // Create the object that the table expects
        batch.push({
            id: newId,
            title: form.value.title,
            author: 'Bimbola A.',
            time: 'Just Now',
            team: form.value.team,
            type: form.value.medium
        });
    }

    // CRITICAL: This sends the data to the composable
    addDocuments(batch);

    // Optional: show the success alert
    newlyCreatedBatch.value = batch.map(d => d.id);
    step.value = 1;
};
</script>