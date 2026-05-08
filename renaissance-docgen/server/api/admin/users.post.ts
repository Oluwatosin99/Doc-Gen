// server/api/admin/users.post.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    const { username, enabled, editorEmail } = await readBody(event);
    const editorShort = editorEmail.split('@')[0];
    
    // Create a safe ISO date for MSSQL: 2026-04-24
    const now = new Date();
    const dbDate = now.toISOString().slice(0, 10); 

    try {
        const isEnabled = (enabled === 1 || enabled === true || enabled === 'TRUE') ? 1 : 0;

        // 1. Get the last ID for Tbl_Administrators
        const adminRows = await queryDatabase('SELECT MAX(ID) as lastId FROM Tbl_Administrators');
        const newAdminId = (Number(adminRows[0]?.lastId) || 0) + 1;

        // 2. Insert New Administrator using ISO date for DATEDEFINED
        await queryDatabase(`
            INSERT INTO Tbl_Administrators (ID, USERNAME, ENABLED, DATEDEFINED) 
            VALUES (${newAdminId}, '${username}', ${isEnabled}, '${dbDate}')
        `);

        // 3. Get the last ID for Tbl_ActivityTracking
        const trackRows = await queryDatabase('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking');
        const newTrackId = (Number(trackRows[0]?.lastId) || 0) + 1;

        const activityText = `Insertion of new entry for [${username}] BY THE ADMIN ~ ${editorShort}`;

        // 4. Log Activity using ISO date
        await queryDatabase(`
            INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) 
            VALUES (${newTrackId}, '${dbDate}', '${editorShort}', '${activityText}')
        `);

        return { success: true };
    } catch (e: any) {
        console.error("User Creation Error (MSSQL):", e.message);
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});