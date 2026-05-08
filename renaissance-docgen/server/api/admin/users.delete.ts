// server/api/admin/users.delete.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, username, editorEmail } = body;
    const editorShort = editorEmail.split('@')[0];

    // Use ISO format for MSSQL: 2026-04-24
    const now = new Date();
    const dbDate = now.toISOString().slice(0, 10);

    try {
        // 1. Delete the Administrator
        // Note: Ensure ${id} is a number or wrapped in quotes if it's a string
        await queryDatabase(`DELETE FROM Tbl_Administrators WHERE ID = ${id}`);

        // 2. Handle Activity Tracking ID (Manual increment for MSSQL)
        const trackRows = await queryDatabase('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking');
        const lastTrackId = trackRows[0]?.lastId || 0;
        const newTrackId = Number(lastTrackId) + 1;

        const activityText = `Removed administrator access for [${username}] by the admin ~ ${editorShort}`;

        // 3. Insert the deletion log using the safe ISO date
        await queryDatabase(`
            INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) 
            VALUES (${newTrackId}, '${dbDate}', '${editorShort}', '${activityText}')
        `);

        return { success: true };
    } catch (e: any) {
        console.error("User Deletion Error (MSSQL):", e.message);
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Deletion failed: ' + e.message 
        });
    }
});