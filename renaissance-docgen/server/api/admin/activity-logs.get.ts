import db from '../../db/database'

export default defineEventHandler(async () => {
    try {
        // Updated to use the correct column names from your screenshot
        const logs = db.prepare(`
            SELECT 
                rowid as id, 
                DATEOFACTIVITY as date, 
                USERID as username, 
                activityDone as details
            FROM Tbl_ActivityTracking 
            ORDER BY rowid DESC
        `).all() as any[];

        return { success: true, data: logs };
    } catch (e: any) {
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});