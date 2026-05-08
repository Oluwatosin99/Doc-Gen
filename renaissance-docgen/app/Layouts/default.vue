<template>

    <div
        class="flex min-h-screen bg-[#F9FAFB] dark:bg-[#0B1511] font-sans text-gray-900 dark:text-white transition-colors duration-300">

        <aside
            class="w-64 bg-white dark:bg-[#0B1511] border-r border-gray-100 dark:border-white/5 flex flex-col p-6 fixed h-full z-10 transition-colors">
            <!-- LOGO -->
            <ClientOnly>
                <div class="mb-12 flex items-center">
                    <img :src="colorMode.preference === 'dark'
                        ? '/images/RENAISSANCE-dark2.png'
                        : '/images/RENAISSANCE-light.png'" alt="Renaissance Africa Energy Logo"
                        class="h-[54px] w-auto transition-all duration-300" />
                </div>
            </ClientOnly>
            <nav class="flex-1 space-y-4">
                <template v-if="currentRole === 'general'">
                    <button @click="adminTab = 'generate'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl transition-all text-sm"
                        :class="adminTab === 'generate' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <LayoutGrid :size="20" /> Generate
                    </button>

                    <button @click="adminTab = 'docs'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl transition-all text-sm"
                        :class="adminTab === 'docs' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold shadow-sm' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <FileText :size="20" />
                        <span class="tracking-tight">My Doc Numbers</span>
                    </button>
                </template>

                <template v-else>
                    <button @click="adminTab = 'docs'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl transition-all text-sm"
                        :class="adminTab === 'docs' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <FileText :size="20" /> My Doc Numbers
                    </button>

                    <div class="pt-2 space-y-1">
                        <p class="text-[10px] font-bold text-gray-300 uppercase px-3 tracking-widest mb-2">Reports</p>
                        <button @click="adminTab = 'search'"
                            class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                            :class="adminTab === 'search' ? 'text-[#00B800] font-bold' : 'text-gray-400 hover:text-[#00B800]'">
                            <Search :size="18" /> Document Search
                        </button>
                    </div>

                    <div class="pt-2 space-y-1">
                        <p class="text-[10px] font-bold text-gray-300 uppercase px-3 tracking-widest mb-2">
                            Administration</p>
                        <div class="space-y-1">
                            <button @click="adminTab = 'modify'"
                                class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                                :class="adminTab === 'modify' ? 'text-[#00B800] font-bold' : 'text-gray-400 hover:text-[#00B800]'">
                                <Settings2 :size="18" /> Update & Modify Items
                            </button>
                            <button @click="adminTab = 'tracking'"
                                class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                                :class="adminTab === 'tracking' ? 'text-[#00B800] font-bold' : 'text-gray-400 hover:text-[#00B800]'">
                                <Activity :size="18" /> Activity Tracking
                            </button>
                            <button @click="adminTab = 'users'"
                                class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                                :class="adminTab === 'users' ? 'text-[#00B800] font-bold' : 'text-gray-400 hover:text-[#00B800]'">
                                <ShieldCheck :size="18" /> Admin Management
                            </button>
                        </div>
                    </div>
                </template>
            </nav>

            <div class="mt-auto space-y-4">
                <NuxtLink v-if="currentRole === 'admin'" to="/"
                    class="flex items-center justify-center gap-2 w-full py-4 bg-[#FF7A00] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#e66e00] transition-all shadow-lg shadow-orange-100 dark:shadow-none">
                    <ArrowLeft :size="16" /> Return to Generator
                </NuxtLink>

                <div
                    class="p-1 bg-[#F3F4F6] dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl flex gap-1">
                    <button @click="navigateTo('/')"
                        :class="currentRole === 'general' ? 'bg-[#00B800] text-white shadow-md' : 'text-gray-400'"
                        class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">
                        General
                    </button>

                    <button @click="handleAdminClick"
                        :class="currentRole === 'admin' ? 'bg-[#00B800] text-white shadow-md' : 'text-gray-400'"
                        class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">
                        Admin
                    </button>
                </div>

                <button
                    class="flex items-center gap-3 p-3 text-gray-400 hover:text-red-500 transition-colors w-full text-sm font-medium">
                    <LogOut :size="20" /> Logout
                </button>
            </div>
        </aside>

        <main class="flex-1 ml-64 p-10 flex flex-col min-h-screen dark:bg-gray-900 transition-colors">
            <header class="flex justify-between items-center mb-8">
                <h1 class="font-black text-xl tracking-tight text-green-500 dark:text-white uppercase italic">
                    Document Number Generator
                </h1>

                <div class="flex items-center gap-6">

                    <button @click="toggleColorMode"
                        class="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-500 dark:text-[#00B800] hover:shadow-sm transition-all">
                        <ClientOnly>
                            <Moon v-if="colorMode.preference === 'light'" :size="20" />
                            <Sun v-else :size="20" />
                            <template #fallback>
                                <div class="w-5 h-5"></div>
                            </template>
                        </ClientOnly>
                    </button>

                    <div class="flex items-center gap-3 border-l pl-6 border-gray-100 dark:border-white/10">
                        <div class="text-right">
                            <p class="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                {{ userStore.user?.fullName || 'General User' }}
                            </p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{{
                                currentRole }}</p>
                        </div>
                        <div
                            class="w-10 h-10 rounded-full border-2 border-white dark:border-[#0B1511] shadow-sm overflow-hidden">
                            <img :src="`https://ui-avatars.com/api/?name=${userStore.user?.fullName || 'User'}&background=00B800&color=fff`"
                                alt="Avatar" />
                        </div>
                    </div>
                </div>
            </header>

            <div class="flex-1">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup>
import {
    LayoutGrid, Archive, LogOut, FileText, Search,
    Settings2, Activity, ShieldCheck, ArrowLeft, Sun, Moon
} from 'lucide-vue-next';
import { useUserStore } from '~/stores/user';

const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();
const adminTab = useState('adminActiveTab', () => 'generate');
const userStore = useUserStore();

// This will track if the user is actually in the admin table
const isVerifiedAdmin = ref(false);

// 1. Helper function to format name and check DB
const verifyAdminStatus = async (fullName) => {
    if (!fullName) return;

    // Transformation: "Oluwatosin Dawodu" -> "Oluwatosin.Dawodu"
    const formattedName = fullName.trim().replace(/\s+/g, '.');

    try {
        const data = await $fetch('/api/check-admin', {
            params: { name: formattedName }
        });
        isVerifiedAdmin.value = data.isAdmin;
    } catch (err) {
        console.error("Verification failed", err);
        isVerifiedAdmin.value = false;
    }
};

// 2. Handle the "Timing" on Reload
// This waits for the store to actually have the user data
watch(() => userStore.user?.fullName, (newName) => {
    if (newName) verifyAdminStatus(newName);
}, { immediate: true });

// 3. Role determination for UI elements
const currentRole = computed(() => {
    // Only show 'admin' role if the path is admin AND they are verified
    return (route.path.startsWith('/admin') && isVerifiedAdmin.value) ? 'admin' : 'general';
});

// 4. The Button Click Logic
const handleAdminClick = async () => {
    const currentUserName = userStore.user?.fullName;

    if (!currentUserName) {
        alert("User profile loading... please try again.");
        return;
    }

    // Re-verify just in case
    await verifyAdminStatus(currentUserName);

    if (isVerifiedAdmin.value) {
        router.push('/admin');
    } else {
        alert("Unauthorized: Your name (formatted as " + currentUserName.trim().replace(/\s+/g, '.') + ") was not found in the Admin list.");
    }
};

const toggleColorMode = () => {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
};
</script>