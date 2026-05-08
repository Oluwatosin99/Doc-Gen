// server/api/documents/my-list.get.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const searchRaw = String(query.search || '');

        if (!searchRaw) return { success: true, data: [] };

        // 1. Logic for name variants to handle different name formats
        const searchWithSpaces = searchRaw.replace(/\./g, ' ');
        const searchWithDots = searchRaw.replace(/ /g, '.');

        // 2. MSSQL Query
        // Using ReqDate and ReqTime for ordering since rowid is SQLite-specific
        const sql = `
            SELECT 
                DocumentNo, 
                Title, 
                Organisation, 
                ReqDate, 
                ReqTime
            FROM DocumentRegister 
            WHERE UserDetails LIKE '%${searchRaw}%' 
                OR UserDetails LIKE '%${searchWithSpaces}%' 
                OR UserDetails LIKE '%${searchWithDots}%'
            ORDER BY ReqDate DESC, ReqTime DESC
        `;

        const userDocs = await queryDatabase(sql);

        // 3. Mapping the data to match your frontend requirements
        const formattedData = userDocs.map((item) => {
            return {
                id: item.DocumentNo,
                docNo: item.DocumentNo,
                title: item.Title || 'Untitled',
                organization: item.Organisation || 'REN',
                // Combines date and time for a clean timestamp display
                timestamp: `${item.ReqDate || ''} ${item.ReqTime || ''}`.trim()
            };
        });

        return { success: true, data: formattedData };
    } catch (e: any) {
        console.error("My-List Fetch Error:", e.message);
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});