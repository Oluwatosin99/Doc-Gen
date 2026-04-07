<template>
    <div
        class="flex min-h-screen bg-[#F9FAFB] dark:bg-[#0B1511] font-sans text-gray-900 dark:text-white transition-colors duration-300">

        <aside
            class="w-64 bg-white dark:bg-[#0B1511] border-r border-gray-100 dark:border-white/5 flex flex-col p-6 fixed h-full z-10 transition-colors">
  <!-- LOGO -->
<div class="mb-12 flex items-center">
  <img
    :src="colorMode.preference === 'dark'
      ? '/images/RENAISSANCE-dark.png'
      : '/images/RENAISSANCE-light.png'"
    alt="Renaissance Africa Energy Logo"
    class="h-[52px] w-auto transition-all duration-300"
   /> 
</div>
            <nav class="flex-1 space-y-4">
                <template v-if="currentRole === 'general'">
                    <NuxtLink to="/" class="flex items-center gap-3 p-3 rounded-xl transition-all text-sm"
                        :class="route.path === '/' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <LayoutGrid :size="20" /> Generate
                    </NuxtLink>
                    <NuxtLink to="/archives"
                        class="flex items-center gap-3 p-3 rounded-xl transition-all text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
                        <Archive :size="20" /> Archives
                    </NuxtLink>
                </template>

                <template v-else>
                    <button @click="adminTab = 'docs'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl transition-all text-sm"
                        :class="adminTab === 'docs' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <FileText :size="20" /> My Document Numbers
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
                        class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">General</button>
                    <button @click="navigateTo('/admin')"
                        :class="currentRole === 'admin' ? 'bg-[#00B800] text-white shadow-md' : 'text-gray-400'"
                        class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">Admin</button>
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
                    <div class="relative w-64">
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
                        <input type="text" placeholder="Search..."
                            class="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#00B800] dark:text-white transition-all">
                    </div>

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
                            <p class="text-sm font-bold text-gray-900 dark:text-white leading-none">Bimbola A.</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{{
                                currentRole }}</p>
                        </div>
                        <div
                            class="w-10 h-10 rounded-full border-2 border-white dark:border-[#0B1511] shadow-sm overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Bimbola+A&background=00B800&color=fff"
                                alt="Avatar">
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

const route = useRoute();
const colorMode = useColorMode();
const adminTab = useState('adminActiveTab', () => 'docs');

const currentRole = computed(() => route.path.startsWith('/admin') ? 'admin' : 'general');

const toggleColorMode = () => {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
};
</script>