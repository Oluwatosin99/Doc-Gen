<template>
    <aside class="w-64 bg-white border-r flex flex-col p-6 fixed h-full">
        <div class="text-[#00B800] font-black text-2xl mb-10 uppercase">Renaissance</div>

        <nav class="flex-1 space-y-2">
            <NuxtLink to="/" class="flex items-center gap-3 p-3 rounded-xl transition-all"
                :class="route.path === '/' ? 'bg-[#E6F7E6] text-[#00B800] font-bold' : 'text-gray-400'">
                <LayoutGrid :size="20" /> Generate
            </NuxtLink>
            <NuxtLink to="/archives" class="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-50 rounded-xl">
                <Archive :size="20" /> Archives
            </NuxtLink>
        </nav>

        <div class="mt-auto p-1 bg-gray-100 rounded-xl flex gap-1 mb-6">
            <button @click="navigateTo('/')"
                :class="route.path === '/' ? 'bg-[#00B800] text-white shadow-md' : 'text-gray-500'"
                class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">General</button>
            <button @click="navigateTo('/admin')"
                :class="route.path === '/admin' ? 'bg-[#00B800] text-white shadow-md' : 'text-gray-500'"
                class="flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all">Admin</button>
        </div>

        <button class="flex items-center gap-3 p-3 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut :size="20" /> Logout
        </button>
    </aside>
</template>

<script setup>
import { LayoutGrid, Archive, LogOut } from 'lucide-vue-next';
const route = useRoute();
</script>