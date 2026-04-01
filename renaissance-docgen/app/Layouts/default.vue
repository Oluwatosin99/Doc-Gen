<template>
    <div class="flex min-h-screen bg-[#F9FAFB] font-sans text-gray-900">
        <aside class="w-64 bg-white border-r flex flex-col p-6 fixed h-full z-10">
            <div class="text-[#00B800] font-black text-2xl tracking-tight mb-10 italic">
                RENAISSANCE
            </div>

            <nav class="flex-1 space-y-2">
                <NuxtLink to="/" class="flex items-center gap-3 p-3 rounded-xl transition-all"
                    :class="route.path === '/' ? 'bg-[#E6F7E6] text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50'">
                    <LayoutGrid :size="20" /> Generate
                </NuxtLink>

                <template v-if="currentRole === 'admin'">
                    <NuxtLink to="/archives"
                        class="flex items-center gap-3 p-3 rounded-xl transition-all text-gray-400 hover:bg-gray-50">
                        <Archive :size="20" /> Archives
                    </NuxtLink>
                    <NuxtLink to="/settings"
                        class="flex items-center gap-3 p-3 rounded-xl transition-all text-gray-400 hover:bg-gray-50">
                        <Settings :size="20" /> Settings
                    </NuxtLink>
                </template>
            </nav>

            <div class="mt-auto">
                <div class="p-1 bg-[#F3F4F6] border border-gray-100 rounded-xl flex gap-1 mb-6">
                    <button @click="setView('general')"
                        :class="currentRole === 'general' ? 'bg-[#00B800] text-white shadow-md' : 'text-gray-400'"
                        class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">
                        General
                    </button>
                    <button @click="setView('admin')"
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

        <main class="flex-1 ml-64 p-10 flex flex-col min-h-screen">
            <header class="flex justify-between items-center mb-8">
                <div class="relative w-96">
                    <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
                    <input type="text" placeholder="Search for anything..."
                        class="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#00B800]">
                </div>

                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="text-sm font-bold text-gray-900 leading-none">Bimbola A.</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{{ currentRole }}
                        </p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Bimbola+A&background=00B800&color=fff" alt="Avatar">
                    </div>
                </div>
            </header>

            <div class="flex-1">
                <slot />
            </div>

            <footer
                class="mt-12 pt-8 border-t flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                <div>© 2026 DOCID PRO SYSTEMS. ALL RIGHTS RESERVED.</div>
                <div class="flex gap-6 lowercase">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                </div>
            </footer>
        </main>
    </div>
</template>

<script setup>
import { LayoutGrid, Archive, Settings, LogOut, Search } from 'lucide-vue-next';

const route = useRoute();
const setView = (role) => {
    if (role === 'admin') navigateTo('/admin');
    else navigateTo('/');
};

const currentRole = computed(() => route.path === '/admin' ? 'admin' : 'general');
</script>