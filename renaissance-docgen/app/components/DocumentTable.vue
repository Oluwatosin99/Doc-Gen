<template>
    <div class="overflow-x-auto mt-4">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated ID</th>
                    <th class="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document Title</th>
                    <th v-if="isAdmin" class="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Created By</th>
                    <th class="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team</th>
                    <th class="py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
                    <th class="py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                <tr v-for="doc in documents" :key="doc.id" class="group hover:bg-gray-50 transition-colors">
                    <td class="py-5">
                        <span class="font-mono text-xs font-bold text-[#00B800] bg-[#E6F7E6] px-2 py-1 rounded-md">
                            {{ doc.id }}
                        </span>
                    </td>

                    <td class="py-5">
                        <div class="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
                            {{ doc.title || 'Untitled Document' }}
                        </div>
                    </td>

                    <td v-if="isAdmin" class="py-5">
                        <div class="flex items-center gap-2">
                            <div
                                class="w-6 h-6 rounded-full bg-gray-200 text-[10px] flex items-center justify-center font-bold">
                                {{ doc.author.charAt(0) }}
                            </div>
                            <span class="text-xs font-medium text-gray-600">{{ doc.author }}</span>
                        </div>
                    </td>

                    <td class="py-5">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {{ doc.team }}
                        </span>
                    </td>

                    <td class="py-5 text-xs text-gray-400 font-medium">
                        {{ doc.time }}
                    </td>

                    <td class="py-5 text-right">
                        <button class="text-gray-300 hover:text-[#FF7A00] transition-colors p-2">
                            <MoreHorizontal :size="18" />
                        </button>
                    </td>
                </tr>

                <tr v-if="documents.length === 0">
                    <td colspan="6" class="py-20 text-center text-gray-400 text-sm italic">
                        No documents generated yet. Follow the steps above to get started.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { MoreHorizontal } from 'lucide-vue-next';

// Define the data that comes from the parent page
const props = defineProps({
    documents: {
        type: Array,
        required: true,
        default: () => []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped>
/* Optional: Makes the scrollbar look cleaner if table is wide */
::-webkit-scrollbar {
    height: 4px;
}

::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 10px;
}
</style>