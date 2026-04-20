import db from '../../db/database'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const searchRaw = String(query.search || '');

        if (!searchRaw) return { success: true, data: [] };

        // 1. Create versions of the name to catch both yesterday and today
        const searchWithSpaces = searchRaw.replace(/\./g, ' ');
        const searchWithDots = searchRaw.replace(/ /g, '.');

        const userDocs = db.prepare(`
            SELECT 
                DocumentNo, 
                Title, 
                Organisation, 
                ReqDate, 
                ReqTime
            FROM DocumentRegister 
            WHERE UserDetails LIKE ? 
                OR UserDetails LIKE ? 
                OR UserDetails LIKE ?
            ORDER BY rowid DESC
        `).all(`%${searchRaw}%`, `%${searchWithSpaces}%`, `%${searchWithDots}%`) as any[];

        // 2. Map the data correctly
        const formattedData = userDocs.map((item) => {
            return {
                id: item.DocumentNo,
                docNo: item.DocumentNo,
                title: item.Title || 'Untitled',
                organization: item.Organisation || 'REN',
                // Use the exact names from the SELECT above
                timestamp: `${item.ReqDate || ''} ${item.ReqTime || ''}`.trim()
            };
        });

        return { success: true, data: formattedData };
    } catch (e: any) {
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});