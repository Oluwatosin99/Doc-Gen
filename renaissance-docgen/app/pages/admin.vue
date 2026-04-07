<template>
    <div class="space-y-6">
        <div v-if="adminTab === 'docs'" class="space-y-6">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                        My Document Numbers
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Overview of all document sequences generated within the system.
                    </p>
                </div>

                <div class="flex gap-4">
                    <div
                        class="px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-center">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Generated</p>
                        <p class="text-lg font-black text-[#00B800]">{{ myDocs.length }}</p>
                    </div>
                </div>
            </div>

            <div
                class="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm p-4">
                <DocumentTable :documents="myDocs" />
            </div>
        </div>

        <div v-else-if="adminTab === 'search' || adminTab === 'search-admin'"
            class="min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/30 dark:bg-transparent">
            <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search class="text-gray-400" :size="32" />
            </div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Document Search</h3>
            <p class="text-gray-400 mt-2 font-medium">Advanced filtering and report generation</p>
            <div
                class="mt-8 px-6 py-2 bg-[#00B800]/10 text-[#00B800] rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                Coming Soon
            </div>
        </div>

        <div v-else-if="adminTab === 'modify'"
            class="min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/30 dark:bg-transparent">
            <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Settings2 class="text-gray-400" :size="32" />
            </div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Update & Modify Items
            </h3>
            <p class="text-gray-400 mt-2 font-medium">Manage company codes, departments, and prefixes</p>
            <div
                class="mt-8 px-6 py-2 bg-[#00B800]/10 text-[#00B800] rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                Coming Soon
            </div>
        </div>

        <div v-else-if="adminTab === 'tracking'"
            class="min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/30 dark:bg-transparent">
            <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Activity class="text-gray-400" :size="32" />
            </div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Activity Tracking</h3>
            <p class="text-gray-400 mt-2 font-medium">Audit logs and user generation history</p>
            <div
                class="mt-8 px-6 py-2 bg-[#00B800]/10 text-[#00B800] rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                Coming Soon
            </div>
        </div>

        <div v-else-if="adminTab === 'users'"
            class="min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/30 dark:bg-transparent">
            <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck class="text-gray-400" :size="32" />
            </div>
            <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Administrator
                Management</h3>
            <p class="text-gray-400 mt-2 font-medium">Manage permissions and admin access levels</p>
            <div
                class="mt-8 px-6 py-2 bg-[#00B800]/10 text-[#00B800] rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                Coming Soon
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Search,
    Settings2,
    Activity,
    ShieldCheck,
    FileText
} from 'lucide-vue-next';

// This links directly to the Sidebar buttons in default.vue
const adminTab = useState('adminActiveTab', () => 'docs');

// Access the documents from your shared state/composable
const { myDocs } = useDocuments();
</script>