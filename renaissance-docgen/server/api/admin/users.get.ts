import db from '../../db/database'

export default defineEventHandler(async (event) => {
    try {
        const admins = db.prepare(`
            SELECT 
                ID as id, 
                USERNAME as username, 
                ENABLED as enabled, 
                DATEDEFINED as dateDefined
            FROM Tbl_Administrators 
            ORDER BY ID ASC
        `).all();

        return { success: true, data: admins };
    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch administrators: ' + e.message
        });
    }
});