// server/api/admin/activity-logs.get.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async () => {
    try {
        // 1. Swap 'rowid' for your actual 'ID' column
        // 2. We use aliases (as id, as date, etc.) to keep your frontend table working
        const logs = await queryDatabase(`
            SELECT 
                ID as id, 
                DATEOFACTIVITY as date, 
                USERID as username, 
                activityDone as details
            FROM Tbl_ActivityTracking 
            ORDER BY ID DESC
        `);

        return { 
            success: true, 
            data: logs 
        };
    } catch (e: any) {
        console.error("Activity Log Fetch Error (MSSQL):", e.message);
        throw createError({ 
            statusCode: 500, 
            statusMessage: e.message 
        });
    }
});