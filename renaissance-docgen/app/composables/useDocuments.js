export const useDocuments = () => {
    const myDocs = useState('myDocs', () => []);
    const userStore = useUserStore();

    const refresh = async () => {
        const name = userStore.user?.fullName;

        // 🔥 WAIT until user exists
        if (!name) return;

        const finalSearch = name.replace(/\./g, ' ');

        try {
            const res = await $fetch('/api/documents/my-list', {
                params: { search: finalSearch }
            });

            if (res.success) {
                myDocs.value = res.data || [];
            }
        } catch (err) {
            console.error('Doc fetch failed:', err);
            myDocs.value = [];
        }
    };

    // 🔥 AUTO-REFETCH when user becomes available
    watch(
        () => userStore.user?.fullName,
        async (newName) => {
            if (newName) {
                await refresh();
            }
        },
        { immediate: true } // 👈 THIS is the magic
    );

    return { myDocs, refresh };
};