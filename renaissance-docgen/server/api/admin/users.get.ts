// server/api/admin/users.get.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    try {
        // We use the same Aliases (as id, as username) so your 
        // frontend table components don't need any changes.
        const admins = await queryDatabase(`
            SELECT 
                ID as id, 
                USERNAME as username, 
                ENABLED as enabled, 
                DATEDEFINED as dateDefined
            FROM Tbl_Administrators 
            ORDER BY ID ASC
        `);

        // ✅ FIX: Map through the results to fix the 'enabled' logic
        const formattedAdmins = admins.map(user => ({
            ...user,
            // If your frontend needs the string 'TRUE'/'FALSE':
            enabled: user.enabled === 1 || user.enabled === true ? 'TRUE' : 'FALSE'
            
            // OR if your frontend just needs a true/false boolean:
            // enabled: !!user.enabled 
        }));

        return { 
            success: true, 
            data: formattedAdmins 
        };
    } catch (e: any) {
        console.error("Fetch Administrators Error (MSSQL):", e.message);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch administrators: ' + e.message
        });
    }
});