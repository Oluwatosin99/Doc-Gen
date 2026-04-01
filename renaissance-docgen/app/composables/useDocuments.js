export const useDocuments = () => {
    const globalDocs = useState('global_docs', () => []);
    const myDocs = useState('my_docs', () => []);

    const addDocuments = (newDocs) => {
        // This is the critical part: adding new items to the arrays
        myDocs.value = [...newDocs, ...myDocs.value];
        globalDocs.value = [...newDocs, ...globalDocs.value];
    };

    return { globalDocs, myDocs, addDocuments };
};