// server/api/admin/modify-items.post.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { type, data, editorEmail } = body
    const editorShort = editorEmail?.split('@')[0] || 'Admin';

    // Create a safe ISO date for MSSQL: 2026-04-24
    const now = new Date();
    const dbDate = now.toISOString().slice(0, 10);

    try {
        let table = ''
        let codeCol = ''
        let descCol = ''
        let actionLabel = ''

        // 1. Mapping
        if (type === 'company') {
            table = 'Companies'; codeCol = 'COMPANYCODE'; descCol = 'DESCRIPTION'; actionLabel = 'company';
        } else if (type === 'function') {
            table = 'Functions'; codeCol = 'DISCIPLINECODE'; descCol = 'DISCIPLINEDESC'; actionLabel = 'function';
        } else if (type === 'correspondence') {
            table = 'CorrespondenceType'; codeCol = 'CORRESPONDENCECODE'; descCol = 'CODEDESC'; actionLabel = 'correspondence';
        }

        // 2. Check if the code already exists
        const existingRows = await queryDatabase(`SELECT ${codeCol} FROM ${table} WHERE ${codeCol} = '${data.code}'`);
        const existing = existingRows.length > 0;

        if (existing) {
            // 3. UPDATE
            await queryDatabase(`
                UPDATE ${table} 
                SET ${descCol} = '${data.description}' 
                WHERE ${codeCol} = '${data.code}'
            `);
        } else {
            // 4. INSERT
            await queryDatabase(`
                INSERT INTO ${table} (${codeCol}, ${descCol}) 
                VALUES ('${data.code}', '${data.description}')
            `);
        }

        // 5. Handle Activity Tracking (Manual ID logic)
        const trackRows = await queryDatabase('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking');
        const lastTrackId = trackRows[0]?.lastId || 0;
        const newTrackId = Number(lastTrackId) + 1;

        const logMsg = `${existing ? 'Update' : 'Insertion'} of ${actionLabel} [${data.code}] and name [${data.description}] by the admin ~ ${editorShort}`;

        // 6. Log the action using the safe ISO date (dbDate)
        await queryDatabase(`
            INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) 
            VALUES (${newTrackId}, '${dbDate}', '${editorShort}', '${logMsg}')
        `);

        return { success: true };

    } catch (error: any) {
        console.error("Manual Update Error (MSSQL):", error);
        throw createError({ statusCode: 500, statusMessage: error.message });
    }
})