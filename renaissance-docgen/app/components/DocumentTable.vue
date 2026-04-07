<template>
    <div class="overflow-x-auto">
        <table class="w-full text-left border-separate border-spacing-0 border-b border-gray-300 dark:bg-gray-800 dark:border-gray-500"> 
            <thead>
                <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded border bg-gray-100 dark:text-white dark:border-gray-500">
                    <th class="py-4 px-4 rounded-t1-xl">Document Title</th>
                    <th class="py-4 px-4 text-center">Document ID</th>
                    <th class="py-4 px-4">Type</th>
                    <th class="py-4 px-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                <tr v-for="doc in documents" :key="doc.id" class="group">
                    <td class="py-5">
                        <div class="font-bold text-gray-800 text-sm">{{ doc.title || 'Untitled' }}</div>
                        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                            By Current User • {{ formatTime(doc.timestamp) }}
                        </div>
                    </td>
                    <td class="py-5 text-center">
                        <span class="font-mono text-[11px] font-bold text-[#00B800] uppercase tracking-wider">
                            {{ doc.id }}
                        </span>
                    </td>
                    <td class="py-5">
                        <span
                            class="bg-[#F0FFF0] text-[#00B800] text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                            {{ doc.type }}
                        </span>
                    </td>
                    <td class="py-5 text-right">
                        <button @click="copyToClipboard(doc.id)" v-ripple
                            class="text-gray-300 hover:text-[#00B800] transition-colors p-2 relative overflow-hidden">
                            <Copy :size="16" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { Copy } from 'lucide-vue-next';

defineProps(['documents', 'isAdmin']);

const formatTime = (date) => {
    if (!date) return 'Just Now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 5) return 'Just Now';
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add a toast notification here if you have one
};

// Simple Ripple Directive
const vRipple = {
    mounted(el) {
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
</script>

<style>
.ripple {
    position: absolute;
    background: rgba(0, 184, 0, 0.3);
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
</style>