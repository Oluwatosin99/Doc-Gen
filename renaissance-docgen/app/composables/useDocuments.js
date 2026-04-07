// composables/useDocuments.js
export const useDocuments = () => {
    const globalDocs = useState('global_documents', () => []);
    const myDocs = useState('my_documents', () => []);

    const addDocuments = (newDocs) => {
        // Add a real Date object for relative time calculation
        const docsWithTime = newDocs.map(doc => ({
            ...doc,
            timestamp: new Date()
        }));

        myDocs.value = [...docsWithTime, ...myDocs.value];
        globalDocs.value = [...docsWithTime, ...globalDocs.value];
    };

    return { globalDocs, myDocs, addDocuments };
};