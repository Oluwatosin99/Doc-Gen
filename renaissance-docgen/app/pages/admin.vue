<template>
    <div v-if="verifiedAdmin" class="space-y-6">
        <div v-if="adminTab === 'docs'" class="space-y-6">
            <div class="flex justify-between items-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <h2 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-[#00B800]">
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

            <div v-if="myDocs && myDocs.length > 0"
                class="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden shadow-sm p-4">
                <DocumentTable :documents="myDocs" :key="myDocs.length" />
            </div>

            <div v-else class="p-12 text-center text-gray-400">
                <Activity class="animate-spin mx-auto mb-4" :size="32" />
                <p class="text-xs font-bold uppercase tracking-widest">Loading Documents...</p>
            </div>
        </div>

        <div v-else-if="adminTab === 'search' || adminTab === 'search-admin'" class="space-y-6">

            <div
                class="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/10">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                        <label class="block text-[10px] font-black uppercase text-gray-400 mb-2">Company/Org</label>
                        <select v-model="searchForm.company"
                            class="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#00B800] font-bold">
                            <option value="">Select Company</option>
                            <option v-for="co in companies" :key="co.COMPANYCODE" :value="co.COMPANYCODE">
                                {{ co.COMPANYCODE }} - {{ co.DESCRIPTION }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black uppercase text-gray-400 mb-2">Year</label>
                        <select v-model="searchForm.year"
                            class="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#00B800] font-bold">
                            <option value="">All Years</option>
                            <option v-for="yr in availableYears" :key="yr" :value="yr">{{ yr }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black uppercase text-gray-400 mb-2">Doc Number</label>
                        <input v-model="searchForm.docNo" type="text" placeholder="Search ID..."
                            class="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#00B800]" />
                    </div>
                    <div class="flex items-center gap-4">
                        <label class="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" v-model="searchForm.showAll"
                                class="rounded border-gray-300 text-[#00B800] focus:ring-[#00B800]">
                            <span class="text-[10px] font-black uppercase text-gray-500 group-hover:text-[#00B800]">All
                                Records</span>
                        </label>
                        <button @click="handleSearch"
                            class="flex-1 bg-[#00B800] hover:bg-[#009000] text-white font-bold py-3 rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-green-500/20">
                            {{ isSearching ? 'Processing...' : 'Filter Records' }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="searchResults.length > 0"
                class="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 dark:bg-white/5">
                        <tr class="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                            <th class="p-4 border-b border-gray-100 dark:border-white/10">User Details</th>
                            <th class="p-4 border-b border-gray-100 dark:border-white/10">Time Requested</th>
                            <th class="p-4 border-b border-gray-100 dark:border-white/10">Date of Request</th>
                            <th class="p-4 border-b border-gray-100 dark:border-white/10">Title</th>
                            <th class="p-4 border-b border-gray-100 dark:border-white/10">Organisation</th>
                            <th class="p-4 border-b border-gray-100 dark:border-white/10 text-right">DocumentNo</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm font-medium">
                        <tr v-for="row in searchResults" :key="row.DocumentNo"
                            class="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 transition-colors text-gray-700 dark:text-gray-300">
                            <td class="p-4">
                                <div class="font-bold text-gray-900 dark:text-white uppercase">{{
                                    row.UserDetails.split('\\').pop() }}</div>
                                <div class="text-[10px] opacity-40">{{ row.UserDetails }}</div>
                            </td>
                            <td class="p-4 font-mono text-xs opacity-60">{{ row.ReqTime }}</td>
                            <td class="p-4">{{ row.ReqDate }}</td>
                            <td class="p-4 italic max-w-[200px] truncate" :title="row.Title">{{ row.Title }}</td>
                            <td class="p-4">
                                <span
                                    class="px-2 py-1 bg-[#00B800]/10 text-[#00B800] rounded text-[10px] font-black uppercase">
                                    {{ row.Organisation }}
                                </span>
                            </td>
                            <td class="p-4 text-right font-bold text-[#FF7A00]">{{ row.DocumentNo }}</td>
                        </tr>
                    </tbody>
                </table>

                <div
                    class="p-4 bg-gray-50 dark:bg-white/5 flex items-center justify-between border-t border-gray-100 dark:border-white/10">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Showing Page {{ searchCurrentPage
                    }}</span>
                    <div
                        class="flex items-center gap-1 overflow-x-auto max-w-[250px] custom-scrollbar px-2 py-1 border-x border-gray-200 dark:border-white/10">
                        <button v-for="page in searchPageRange" :key="page" @click="searchCurrentPage = page" :class="[
                            'min-w-[30px] h-[30px] rounded-lg text-[10px] font-black transition-all',
                            searchCurrentPage === page ? 'bg-[#FF7A00] text-white scale-110 shadow-lg' : 'bg-white dark:bg-white/10 text-gray-400 hover:text-[#00B800]'
                        ]">
                            {{ page }}
                        </button>
                    </div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase">{{ totalSearchRecords }} Records
                        Found</span>
                </div>
            </div>

            <div v-else class="min-h-[300px] flex flex-col items-center justify-center text-gray-400">
                <Search :size="48" class="opacity-10 mb-4" />
                <p class="font-bold uppercase tracking-widest text-xs">Run a search to see records</p>
            </div>
        </div>

        <div v-else-if="adminTab === 'modify'" class="space-y-6">
            <div
                class="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/10">
                <div class="flex flex-wrap items-center gap-6">
                    <div class="flex-1">
                        <label class="block text-[10px] font-black uppercase text-gray-400 mb-2">Item Category</label>
                        <select v-model="modifyType"
                            class="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#00B800] font-bold">
                            <option value="company">Company List</option>
                            <option value="function">Functions</option>
                            <option value="correspondence">Correspondence Types</option>
                        </select>
                    </div>
                    <button @click="openModifyModal()"
                        class="mt-6 bg-[#00B800] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#009000] transition-all flex items-center gap-2">
                        <Plus :size="14" /> Add New {{ modifyType }}
                    </button>
                </div>
            </div>

            <div
                class="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 dark:bg-white/5">
                        <tr class="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                            <th class="p-4">Code / ID</th>
                            <th class="p-4">Description / Name</th>
                            <th class="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm font-medium">
                        <tr v-for="item in currentModifyList" :key="item.id || item.COMPANYCODE"
                            class="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 transition-colors">
                            <td class="p-4 font-bold text-[#00B800]">{{ item.COMPANYCODE || item.DISCIPLINECODE ||
                                item.CORRESPONDENCECODE }}</td>
                            <td class="p-4 text-gray-600 dark:text-gray-300">{{ item.DESCRIPTION || item.DISCIPLINEDESC ||
                                item.CODEDESC }}</td>
                            <td class="p-4 text-right">
                                <button @click="openModifyModal(item)"
                                    class="p-2 hover:bg-[#FF7A00]/10 rounded-lg text-gray-400 hover:text-[#FF7A00] transition-colors">
                                    <Edit3 :size="16" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="showModifyModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div
                    class="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border dark:border-white/10">
                    <h2 class="text-xl font-black uppercase tracking-tight mb-6 dark:text-white">
                        {{ isEditingModify ? 'Edit' : 'Add New' }} {{ modifyType }}
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="text-[10px] font-black uppercase text-gray-400">Unique Code</label>
                            <input v-model="modifyData.code" type="text" :disabled="isEditingModify"
                                class="w-full mt-1 bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:text-white disabled:opacity-50">
                        </div>
                        <div>
                            <label class="text-[10px] font-black uppercase text-gray-400">Description</label>
                            <input v-model="modifyData.description" type="text"
                                class="w-full mt-1 bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:text-white">
                        </div>
                    </div>
                    <div class="flex gap-4 mt-8">
                        <button @click="showModifyModal = false"
                            class="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Cancel</button>
                        <button @click="saveModifyItem"
                            class="flex-1 bg-[#00B800] text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="adminTab === 'tracking'" class="flex flex-col h-full animate-in fade-in duration-500">
            <div class="overflow-x-auto min-h-[500px]">
                <table
                    class="w-full text-left border-separate border-spacing-0 border-b border-gray-100 dark:border-white/10">
                    <thead>
                        <tr
                            class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-100 dark:bg-white/5">
                            <th class="py-4 px-6 rounded-tl-2xl">Action</th>
                            <th class="py-4 px-6">User</th>
                            <th class="py-4 px-6">Details</th>
                            <th class="py-4 px-6 rounded-tr-2xl">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-white/5">
                        <tr v-for="log in paginatedLogs" :key="log.id"
                            class="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                            <td class="py-4 px-6">
                                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase"
                                    :class="log.action === 'INSERT' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'">
                                    {{ log.action }}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{{ log.username }}
                            </td>
                            <td class="py-4 px-6 text-[11px] text-gray-500 font-medium">{{ log.details }}</td>
                            <td class="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase">{{ log.date }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-8 flex items-center justify-center gap-2">
                <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                    class="h-8 w-8 rounded-full text-xs font-black transition-all duration-300" :class="currentPage === page
                        ? 'bg-[#00B800] text-white shadow-lg shadow-[#00B800]/30 scale-110'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10'">
                    {{ page }}
                </button>
            </div>
        </div>

        <div v-else-if="adminTab === 'users'" class="space-y-6">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-[#00B800] uppercase tracking-tight">
                        Administrator
                        Management</h3>
                    <p class="text-gray-400 text-xs font-medium">Manage system-level access and permissions</p>
                </div>
                <button @click="openAddModal"
                    class="bg-[#00B800] text-white px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#009600] transition-all flex items-center gap-2">
                    <UserPlus :size="14" /> Add Administrator
                </button>
            </div>

            <div
                class="bg-white dark:bg-gray-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 dark:bg-white/5">
                            <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Username</th>
                            <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status
                            </th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-white/5">
                        <tr v-for="admin in adminUsers" :key="admin.id" class="group transition-colors">
                            <td class="px-6 py-4">
                                <span class="text-sm font-bold text-gray-800 dark:text-white">{{ admin.username
                                }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="admin.enabled === 'TRUE' ? 'text-green-600' : 'text-red-600'"
                                    class="text-[10px] font-black uppercase">
                                    {{ admin.enabled === 'TRUE' ? 'Active' : 'Disabled' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="openEditModal(admin)"
                                        class="p-2 hover:bg-[#00B800]/10 rounded-lg text-gray-400 hover:text-[#00B800] transition-colors">
                                        <Edit3 :size="16" />
                                    </button>
                                    <button @click="deleteAdmin(admin)"
                                        class="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div
                    class="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border dark:border-white/10">
                    <h2 class="text-xl font-black uppercase tracking-tight mb-6 dark:text-white">
                        {{ isEditing ? 'Edit Administrator' : 'Add Administrator' }}
                    </h2>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[10px] font-black uppercase text-gray-400">Username</label>
                            <input v-model="modalData.username" type="text" placeholder="e.g. Firstname.Lastname"
                                class="w-full mt-1 bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00B800] dark:text-white">
                        </div>
                        <div>
                            <label class="text-[10px] font-black uppercase text-gray-400">Access Status</label>
                            <select v-model="modalData.enabled"
                                class="w-full mt-1 bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm outline-none dark:text-white">
                                <option value="TRUE">Enabled (Active)</option>
                                <option value="FALSE">Disabled</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex gap-4 mt-8">
                        <button @click="showModal = false"
                            class="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">Cancel</button>
                        <button @click="saveAdmin"
                            class="flex-1 bg-[#00B800] text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20">
                            {{ isEditing ? 'Update User' : 'Add User' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else
        class="min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/30 dark:bg-transparent">
        <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck class="text-gray-300" :size="32" />
        </div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Content Restricted</h3>
        <p class="text-gray-400 mt-2 font-medium">Verification in progress or access denied.</p>
    </div>
</template>

<script setup>
import { Search, Settings2, Trash2, Edit3, UserPlus, ShieldCheck } from 'lucide-vue-next';
import { useUserStore } from '~/stores/user';
import { ref, onMounted, watch, computed, nextTick } from 'vue';

// 1. Core State & Composables
const adminTab = useState('adminActiveTab', () => 'docs');
const { myDocs, refresh: refreshDocuments } = useDocuments();
const userStore = useUserStore();

// Default to false to keep content "blank" until verified
const verifiedAdmin = ref(false);

const adminUsers = ref([]);
const activityLogs = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const modalData = ref({
    id: null,
    username: '',
    enabled: 'TRUE'
});

// 2. Data Fetching Functions
const fetchAdmins = async () => {
    try {
        const response = await $fetch('/api/admin/users');
        if (response && response.success) {
            adminUsers.value = response.data;
        }
    } catch (err) {
        console.error("Database fetch error:", err);
    }
};

const fetchActivityLogs = async () => {
    try {
        const response = await $fetch('/api/admin/activity-logs');
        if (response.success) {
            activityLogs.value = response.data;
            currentPage.value = 1;
        }
    } catch (err) {
        console.error("Error fetching logs:", err);
    }
};

// 3. Verification Logic
// Verify admin status against database on load
onMounted(async () => {
    const checkAccess = async (name) => {
        if (!name) return;

        // Match your DB format exactly: replace space with dot
        const formattedName = name.trim().replace(/\s+/g, '.');

        try {
            const data = await $fetch('/api/check-admin', {
                params: { name: formattedName }
            });

            if (data.success && data.isAdmin) {
                verifiedAdmin.value = true;

                // Load your admin lists
                await fetchAdmins();
                await fetchActivityLogs();

                // This is the part that helps the table show up without switching
                if (adminTab.value === 'docs') {
                    await nextTick(); // Ensure UI updates before fetching documents
                    await refreshDocuments();
                }
            } else {
                verifiedAdmin.value = false;
            }
        } catch (error) {
            console.error('Admin verification failed:', error);
        }
    };

    // If user is already in store, check immediately
    if (userStore.user?.fullName) {
        await checkAccess(userStore.user.fullName);
    } else {
        // Watch for the name to arrive if store is hydrating
        watch(() => userStore.user?.fullName, (newName) => {
            if (newName) checkAccess(newName);
        });
    }
});

// 5. Computed Properties
const totalPages = computed(() => Math.ceil(activityLogs.value.length / itemsPerPage));

const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return activityLogs.value.slice(start, end);
});

// 6. Watchers
watch(adminTab, async (newTab) => {
    if (newTab === 'tracking') {
        fetchActivityLogs();
    } else {
        currentPage.value = 1;
    }

    // 🔥 ADD THIS PART
    if (newTab === 'docs' && verifiedAdmin.value) {
        await refreshDocuments();
    }
});

// ✅ ADD THIS RIGHT HERE (immediately after)
watch(() => userStore.user?.fullName, async (name) => {
    if (name && verifiedAdmin.value && adminTab.value === 'docs') {
        await refreshDocuments();
    }
});

// 7. Action Handlers
const editAdmin = async (admin) => {
    const newUsername = prompt("Edit Username:", admin.username);
    const newStatus = confirm("Enable Access?") ? "TRUE" : "FALSE";

    if (newUsername) {
        await $fetch('/api/admin/users', {
            method: 'PUT',
            body: {
                id: admin.id,
                username: newUsername,
                enabled: newStatus,
                editorEmail: userStore.user.email
            }
        });
        await fetchAdmins();
    }
};

const deleteAdmin = async (admin) => {
    if (!admin.id) return;

    // 1. Get the current editor's email dynamically
    const currentEditor = userStore.user?.email;

    // 2. Add a safety check: don't proceed if we don't know who is deleting
    if (!currentEditor) {
        alert("Session error: Could not identify current user. Please log in again.");
        return;
    }

    if (confirm(`Are you sure you want to revoke access for ${admin.username}?`)) {
        try {
            await $fetch('/api/admin/users', {
                method: 'DELETE',
                body: {
                    id: admin.id,
                    username: admin.username,
                    editorEmail: currentEditor // Now fully dynamic
                }
            });
            await fetchAdmins();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete user.");
        }
    }
};

const openAddModal = () => {
    isEditing.value = false;
    modalData.value = { id: null, username: '', enabled: 'TRUE' };
    showModal.value = true;
};

const openEditModal = (admin) => {
    isEditing.value = true;
    modalData.value = { ...admin };
    showModal.value = true;
};

const saveAdmin = async () => {
    const method = isEditing.value ? 'PUT' : 'POST';
    
    // 1. Get the authenticated email dynamically
    const currentEditor = userStore.user?.email;

    // 2. Safety Check: Don't allow saving if the editor is unknown
    if (!currentEditor) {
        alert("Session Expired: Please log in again to save admin changes.");
        return;
    }

    try {
        await $fetch('/api/admin/users', {
            method: method,
            body: {
                ...modalData.value,
                editorEmail: currentEditor // Dynamic value
            }
        });
        showModal.value = false;
        await fetchAdmins();
    } catch (err) {
        // Handle the unknown error type redline we discussed earlier
        const msg = err instanceof Error ? err.message : 'Unknown error';
        alert("Error saving: " + msg);
    }
};

// --- 1. Search State & Constants ---

const searchForm = ref({
    company: '',
    year: '',
    docNo: '',
    showAll: false
});

// SAFETY: Added a check for optionsResponse to prevent "undefined" crashes
const optionsResponse = ref(null);
const companies = computed(() => {
    return optionsResponse.value?.data?.companies ||
        optionsResponse.value?.companies || [];
});

const availableYears = ref([]);
const searchResults = ref([]);
const isSearching = ref(false);
const totalSearchRecords = ref(0);
const searchCurrentPage = ref(1);

// 2. Fetch Years (2006 to 2026)
const fetchYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let y = 2006; y <= currentYear; y++) {
        years.push(y);
    }

    availableYears.value = years;
};

const fetchOptions = async () => {
    try {
        const res = await $fetch('/api/options/all'); // adjust if different endpoint
        optionsResponse.value = res;
    } catch (err) {
        console.error("Options fetch failed:", err);
    }
};

// 3. Handle Search
const handleSearch = async () => {
    isSearching.value = true;
    try {
        const response = await $fetch('/api/admin/document-search', {
            method: 'GET',
            params: {
                company: searchForm.value.company,
                year: searchForm.value.year,
                docNo: searchForm.value.docNo,
                all: searchForm.value.showAll,
                page: searchCurrentPage.value,
                limit: itemsPerPage
            }
        });

        if (response.success) {
            searchResults.value = response.data || [];
            totalSearchRecords.value = response.total || 0;
        }
    } catch (err) {
        console.error("Search failed:", err);
    } finally {
        isSearching.value = false;
    }
};

// 4. Pagination Logic
const searchPageRange = computed(() => {
    const pages = Math.ceil(totalSearchRecords.value / itemsPerPage);
    if (pages <= 0) return [];
    return Array.from({ length: pages }, (_, i) => i + 1);
});

// Watch for page changes
watch(searchCurrentPage, () => {
    handleSearch();
});

// 5. Watch for tab changes (Safety added)
watch(adminTab, (newTab) => {
    if (newTab === 'search' || newTab === 'search-admin') {
        // Don't call handleSearch here yet, just reset. 
        // Let the user click the button first to ensure no crash.
        searchResults.value = [];
        searchForm.value = { company: '', year: '', docNo: '', showAll: false };
    }
});

onMounted(() => {
    fetchYears();
    fetchOptions();
});

// State for Modification Tab
const modifyType = ref('company'); // 'company', 'function', or 'correspondence'
const showModifyModal = ref(false);
const isEditingModify = ref(false);
const modifyData = ref({ id: null, code: '', description: '' });

// Computed list based on selection
const currentModifyList = computed(() => {
    if (modifyType.value === 'company') return optionsResponse.value?.data?.companies || [];
    if (modifyType.value === 'function') return optionsResponse.value?.data?.functions || [];
    return optionsResponse.value?.data?.mediums || [];
});

const openModifyModal = (item = null) => {
    if (item) {
        isEditingModify.value = true;
        modifyData.value = {
            id: item.id,
            code: item.COMPANYCODE || item.DISCIPLINECODE || item.CORRESPONDENCECODE,
            description: item.DESCRIPTION || item.DISCIPLINEDESC || item.CODEDESC
        };
    } else {
        isEditingModify.value = false;
        modifyData.value = { id: null, code: '', description: '' };
    }
    showModifyModal.value = true;
};

const saveModifyItem = async () => {
    if (!modifyData.value.code || !modifyData.value.description) {
        alert("Please fill in both the code and description.");
        return;
    }

    // Get the actual logged-in user
    const currentEditor = userStore.user?.email;

    if (!currentEditor) {
        alert("Session Error: Logged-in user not identified. Please re-login.");
        return;
    }

    try {
        await $fetch('/api/admin/modify-items', {
            method: 'POST',
            body: {
                type: modifyType.value,
                editorEmail: currentEditor, // No more hardcoded email
                data: {
                    code: modifyData.value.code.trim().toUpperCase(),
                    description: modifyData.value.description.trim()
                }
            }
        });

        showModifyModal.value = false;
        await fetchOptions(); 
    } catch (err) {
        alert("Error: " + (err.data?.statusMessage || "Failed to save"));
    }
};
</script>

<style scoped>
/* .no-scrollbar::-webkit-scrollbar {
    display: none;
} */

/* Force the scrollbar to be visible so people know to scroll */
.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    /* Light gray scrollbar */
    border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}
</style>