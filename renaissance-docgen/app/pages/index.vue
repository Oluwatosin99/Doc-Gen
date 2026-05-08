<template>
    <div class="max-w-7xl mx-auto px-6 py-10">
        <div v-if="newlyCreatedBatch.length > 0"
            class="bg-[#E6F7E6] p-10 rounded-[32px] mb-12 relative border border-[#CCF0CC dark:bg-slate-600 dark:border-none">
            <button @click="newlyCreatedBatch = []"
                class="absolute top-6 right-8 text-gray-400 font-bold capitalize text-[10px] tracking-widest hover:text-[#00B800] dark:text-white">Dismiss</button>
            <div class="mb-6">
                <h2 class="text-[#00B800] font-black text-lg">Successfully Generated {{ newlyCreatedBatch.length }} IDs
                </h2>
                <p class="text-gray-500 text-xs mt-1 dark:text-white">Your new document identifiers are ready to use.
                </p>
            </div>
            <div class="flex flex-wrap gap-4">
                <div v-for="id in newlyCreatedBatch" :key="id"
                    class="group relative bg-gray-100 px-6 py-5 rounded-2xl border border-white/5 min-w-[300px] flex items-center justify-between transition-all hover:border-[#00B800]/50 dark:bg-[#0B1511] dark:border-white/10">
                    <span class="text-[#00B800] font-mono text-sm font-bold tracking-wider">{{ id }}</span>
                    <button @click="copyText(id)"
                        class="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1 transition-opacity duration-300">
                        <Copy :size="14" class="text-[#00B800]" />
                        <span class="text-[8px] font-bold text-[#00B800] capitalize">Copy</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'generate'" class="grid grid-cols-12 gap-10 items-start">
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
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">
                            Select Company
                        </label>

                        <select v-model="form.company"
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">

                            <option value="">Select Company</option>

                            <option v-for="company in companies" :key="company.COMPANYCODE"
                                :value="company.COMPANYCODE">
                                {{ company.DESCRIPTION }} ({{ company.COMPANYCODE }})
                            </option>

                        </select>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">
                            Enter Document Title
                        </label>
                        <input v-model="form.title" type="text" placeholder="Type document title here..."
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                    </div>

                    <button v-ripple @click="step = 2" :disabled="!form.company || !form.title"
                        class="w-1/2 mt-auto bg-[#FF7A00] text-white py-3 rounded-2xl font-black text-sm capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden transition-all hover:translate-x-1">
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
                            <option value="">Select Function</option>

                            <option v-for="f in functions" :key="f.DISCIPLINECODE" :value="f.DISCIPLINECODE">
                                {{ f.DISCIPLINEDESC }} ({{ f.DISCIPLINECODE }})
                            </option>
                        </select>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Correspondence
                            Medium</label>
                        <select v-model="form.medium"
                            class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border-none dark:text-white">
                            <option value="">Select Medium</option>

                            <option v-for="m in mediums" :key="m.CORRESPONDENCECODE" :value="m.CORRESPONDENCECODE">
                                {{ m.CODEDESC }} ({{ m.CORRESPONDENCECODE }})
                            </option>
                        </select>
                    </div>

                    <div class="flex gap-4 mt-auto">
                        <button v-ripple @click="step = 1"
                            class="flex-1 border-2 border-green-500 text-green-500 py-3 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden hover:bg-[#00B800] hover:text-white">
                            <ChevronLeft :size="18" /> Back
                        </button>
                        <button v-ripple @click="step = 3" :disabled="!form.function || !form.medium"
                            class="flex-1 bg-[#FF7A00] text-white py-3 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-50">
                            Next Step
                            <ChevronRight :size="18" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 3" class="space-y-8 flex-1 flex flex-col dark:bg-gray-900 p-8 rounded-2xl">
                    <h2 class="font-semibold text-[#00B800] text-2xl tracking-tight">Quantity</h2>
                    <div class="space-y-3">
                        <div class="space-y-3">
                            <label class="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-100">Quantity To
                                Generate</label>
                            <input v-model="form.quantity" type="number" min="1"
                                class="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-[#00B800] dark:bg-gray-800 dark:border dark:text-white">
                        </div>
                    </div>

                    <div class="flex gap-4 mt-auto">
                        <button v-ripple @click="step = 2"
                            class="flex-1 border-2  border-green-500 text-green-500  py-3 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden hover:bg-[#00B800] hover:text-white">
                            <ChevronLeft :size="18" />Back
                        </button>
                        <button v-ripple @click="handleGenerate"
                            class="flex-1 bg-[#FF7A00] text-white py-3 rounded-2xl font-black capitalize tracking-widest flex items-center justify-center gap-2 relative overflow-hidden">Generate
                            ID
                            <ChevronRight :size="18" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-span-5 space-y-4">
                <div class="bg-[#00B800] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div class="text-xl font-mono font-bold mb-10 tracking-widest uppercase">
                        {{ form.company || '???' }}-{{ form.function || '???' }}-{{ form.medium || '???' }}-2026-{{
                            String(form.sequence).padStart(4, '0') }}
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
                    </div>
                    <button :disabled="!isReady" :class="[
                        'w-full mt-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300',
                        isReady
                            ? 'bg-[#FF7A00] text-white shake-btn shadow-orange-500/50 shadow-lg'
                            : 'bg-white/20 text-white/50 cursor-not-allowed border border-white/10'
                    ]">
                        <component :is="isReady ? Rocket : Timer" :size="18" />
                        {{ isReady ? 'READY TO GO' : 'WAITING FOR SELECTION...' }}
                    </button>
                </div>

                <div
                    class="bg-white border border-gray-100 rounded-2xl p-4 dark:bg-gray-800 dark:border-none dark:text-white shadow-sm flex items-center gap-3">
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

        <div v-if="activeTab === 'docs' || activeTab === 'generate'"
            :class="activeTab === 'generate' ? 'mt-16' : 'mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700'"
            class="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm dark:bg-gray-800 dark:border-none">
            <div class="mb-8">
                <h3 class="font-semibold text-[#00B800] text-2xl tracking-tight">
                    {{ activeTab === 'docs' ? 'My Document Numbers' : 'Recent Document Numbers' }}
                </h3>
                <p class="text-gray-400 text-[10px] font-bold capitalize tracking-widest mt-1">A list of document
                    identifiers you have generated.</p>
            </div>
            <DocumentTable :documents="activeTab === 'generate' ? myDocs.slice(0, 5) : myDocs" :is-admin="true" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Copy, ChevronRight, ChevronLeft, Check, Info, Rocket, Timer } from 'lucide-vue-next';
import { useUserStore } from '~/stores/user';

// --- 1. Store & Auth Logic ---
const userStore = useUserStore();
const config = useRuntimeConfig();

// We can pull the domain from your .env automatically
const appDomain = config.public.appDomain || 'spnigeria.com';

onMounted(async () => {
    // If we already have a session, stop.
    if (userStore.user) return;

    try {
        const authApi = config.public.authApiBaseUrl; // http://api.authenticate.spin-ng.local/authenticate

        // 1. Call the Corporate SSO endpoint
        // 'include' credentials tells the browser to send your Edge/Windows login
        const authRes = await $fetch(authApi, {
            credentials: 'include'
        });

        // 2. Extract the email (assuming the API returns it in a field named 'email' or 'user')
        const detectedEmail = authRes.email || authRes.user;

        if (detectedEmail) {
            // 3. Now verify this email with your local 'check-admin' DB
            const adminRes = await $fetch('/api/check-admin', {
                params: { email: detectedEmail }
            });

            // 4. Format and Save
            const namePart = detectedEmail.split('@')[0];
            const fullName = namePart.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            const role = (adminRes.isAdmin === 'Y' || adminRes.isAdmin === true) ? 'admin' : 'general';

            userStore.setUser({ email: detectedEmail, fullName }, role);
        }
    } catch (err) {
        console.error("Corporate SSO failed. Please ensure you are on the company network.", err);
    }
});
// 1. Fetch everything in one go
const { data: optionsResponse } = await useFetch('/api/options/all');

// 2. Computed properties for the loops
const companies = computed(() => optionsResponse.value?.data?.companies || []);
const functions = computed(() => optionsResponse.value?.data?.functions || []);
const mediums = computed(() => optionsResponse.value?.data?.mediums || []);

// --- 2. Existing Generator Logic ---
const { myDocs, addDocuments } = useDocuments();
const step = ref(1);
const newlyCreatedBatch = ref([]);
const form = ref({
    company: '',
    title: '',
    function: '',
    medium: '',
    quantity: 1
});

// Clean Preview: COMPANY-YEAR-MONTH-????
const previewId = computed(() => {
    const co = form.value.company || '???';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    return `${co}-${year}-${month}-????`;
});

const handleGenerate = async () => {
    try {
        const response = await $fetch('/api/generate', {
            method: 'POST',
            body: {
                company: form.value.company,
                title: form.value.title,
                functionCode: form.value.function, // Still sent for metadata
                medium: form.value.medium,         // Still sent for metadata
                quantity: form.value.quantity,
                fullName: userStore.user?.fullName,
                userEmail: userStore.user?.email
            }
        });

        if (response.success) {
            newlyCreatedBatch.value = response.documents.map(d => d.id);

            await refreshDocuments();

            step.value = 1;
            form.value.title = '';
        }
    } catch (err) {
        console.error("Generation error:", err);
    }
};

const copyText = (text) => navigator.clipboard.writeText(text);

// --- 3. UI Directive ---
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

// Inside <script setup>

const activeTab = useState('adminActiveTab');

const refreshDocuments = async (manualName = null) => {
    // Priority: 1. Manual name passed in, 2. Store name, 3. Fallback
    let searchName = manualName || userStore.user?.fullName;

    // Safety: If it's still empty, don't fetch yet or use a clean default
    if (!searchName) return;

    // Ensure the format matches what your DB actually stores 
    // (If DB uses dots, keep it. If DB uses spaces, replace dots with spaces)
    const finalSearch = searchName.replace(/\./g, ' ');

    try {
        const response = await $fetch('/api/documents/my-list', {
            params: { search: finalSearch }
        });

        if (response.success) {
            myDocs.value = response.data;
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
};

onMounted(async () => {
    // If we already have a session, just load the docs and stop.
    if (userStore.user) {
        await refreshDocuments();
        return;
    }

    try {
        const authApi = config.public.appApiBaseUrl;
        const authRes = await $fetch(authApi, { credentials: 'include' });

        const detectedEmail = authRes.email || authRes.user;

        if (detectedEmail) {
            const adminRes = await $fetch('/api/check-admin', {
                params: { email: detectedEmail }
            });

            const namePart = detectedEmail.split('@')[0];
            const fullName = namePart.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            const role = (adminRes.isAdmin === 'Y' || adminRes.isAdmin === true) ? 'admin' : 'general';

            // 1. Set the user in the store
            userStore.setUser({ email: detectedEmail, fullName }, role);

            await nextTick(); // Ensure the store update is processed

            // 2. CRITICAL: Now that the user is set, fetch the documents
            await refreshDocuments();
        }
    } catch (err) {
        console.error("Corporate SSO failed.", err);
    }
});

// Logic to check if all sections are set
const isReady = computed(() => {
    const f = form.value;
    return !!(f.company && f.function && f.medium);
});

</script>

<style scoped>
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

/* The shake animation triggers when the .shake-btn class is applied */
.shake-btn {
    animation: ready-shake 0.8s ease-in-out infinite;
}

@keyframes ready-shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-2px) rotate(-1deg);
    }

    75% {
        transform: translateX(2px) rotate(1deg);
    }
}
</style>