<template>
    <aside
        class="w-64 bg-white dark:bg-[#0B1511] border-r border-gray-100 dark:border-white/5 flex flex-col p-6 fixed h-full z-10 transition-colors">
        <div class="text-[#00B800] font-black text-2xl mb-10 uppercase italic">Renaissance</div>

        <nav class="flex-1 space-y-6">
            <button @click="adminTab = 'docs'"
                class="flex items-center gap-3 w-full p-3 rounded-xl transition-all text-sm"
                :class="adminTab === 'docs' && route.path === '/admin' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                <FileText :size="20" /> My Document Numbers
            </button>

            <div class="space-y-2">
                <p class="text-[10px] font-bold text-gray-300 uppercase px-3 tracking-widest">Reports</p>
                <button @click="adminTab = 'search'"
                    class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                    :class="adminTab === 'search' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                    <Search :size="20" /> Document Search
                </button>
            </div>

            <div class="space-y-2">
                <p class="text-[10px] font-bold text-gray-300 uppercase px-3 tracking-widest">Administration</p>
                <div class="space-y-1">
                    <button @click="adminTab = 'modify'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                        :class="adminTab === 'modify' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <Settings2 :size="20" /> Update & Modify
                    </button>
                    <button @click="adminTab = 'tracking'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                        :class="adminTab === 'tracking' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <Activity :size="20" /> Activity Tracking
                    </button>
                    <button @click="adminTab = 'users'"
                        class="flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all"
                        :class="adminTab === 'users' ? 'bg-[#E6F7E6] dark:bg-[#00B800]/10 text-[#00B800] font-bold' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <ShieldCheck :size="20" /> Admin Management
                    </button>
                </div>
            </div>
        </nav>

        <div class="mt-auto space-y-4">
            <NuxtLink to="/"
                class="flex items-center justify-center gap-2 w-full py-4 bg-[#FF7A00] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#e66e00] transition-all shadow-lg shadow-orange-100 dark:shadow-none">
                <ArrowLeft :size="16" /> Return to Generator
            </NuxtLink>

            <button
                class="flex items-center gap-3 p-3 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium w-full">
                <LogOut :size="20" /> Logout
            </button>
        </div>
    </aside>
</template>

<script setup>
import {
    FileText, Search, Settings2, Activity,
    ShieldCheck, ArrowLeft, LogOut
} from 'lucide-vue-next';

const route = useRoute();
// This state is shared with the admin page
const adminTab = useState('adminActiveTab', () => 'docs');
</script>