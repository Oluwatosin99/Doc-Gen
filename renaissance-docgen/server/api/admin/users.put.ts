// server/api/admin/users.put.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    const { id, username, enabled, editorEmail } = await readBody(event);
    const editorShort = editorEmail.split('@')[0];
    
    // Create a safe ISO date for MSSQL: 2026-04-24
    const now = new Date();
    const dbDate = now.toISOString().slice(0, 10); 

    try {
        // Handle 'enabled' being a string 'TRUE', a boolean, or a number
        const isEnabled = (enabled === 1 || enabled === true || enabled === 'TRUE') ? 1 : 0;

        // 1. Update Administrator
        await queryDatabase(`
            UPDATE Tbl_Administrators 
            SET USERNAME = '${username}', 
                ENABLED = ${isEnabled} 
            WHERE ID = ${id}
        `);

        // 2. Get next ID for Activity Tracking
        const trackRows = await queryDatabase('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking');
        const nextTrackId = (Number(trackRows[0]?.lastId) || 0) + 1;

        // 3. Insert Audit Log using the safe ISO date
        const activityText = `update of entry for user ${username} by the admin ~ ${editorShort}`;
        
        await queryDatabase(`
            INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) 
            VALUES (${nextTrackId}, '${dbDate}', '${editorShort}', '${activityText}')
        `);

        return { success: true };
    } catch (e: any) { 
        console.error("User Update Error (MSSQL):", e.message);
        throw createError({ statusCode: 500, statusMessage: e.message }); 
    }
});