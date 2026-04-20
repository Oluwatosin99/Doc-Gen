import db from '../../db/database'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { type, data, editorEmail } = body
    const editorShort = editorEmail?.split('@')[0] || 'Admin';

    try {
        let table = ''
        let codeCol = ''
        let descCol = ''
        let actionLabel = ''

        // Map the types to the actual table/column names
        if (type === 'company') {
            table = 'Companies'; codeCol = 'COMPANYCODE'; descCol = 'DESCRIPTION'; actionLabel = 'company';
        } else if (type === 'function') {
            table = 'Functions'; codeCol = 'DISCIPLINECODE'; descCol = 'DISCIPLINEDESC'; actionLabel = 'function';
        } else if (type === 'correspondence') {
            table = 'CorrespondenceType'; codeCol = 'CORRESPONDENCECODE'; descCol = 'CODEDESC'; actionLabel = 'correspondence';
        }

        const transaction = db.transaction(() => {
            // A. Check if the code already exists
            const existing = db.prepare(`SELECT ${codeCol} FROM ${table} WHERE ${codeCol} = ?`).get(data.code);

            if (existing) {
                // B. If exists, UPDATE
                db.prepare(`UPDATE ${table} SET ${descCol} = ? WHERE ${codeCol} = ?`)
                    .run(data.description, data.code);
            } else {
                // C. If not exists, INSERT
                db.prepare(`INSERT INTO ${table} (${codeCol}, ${descCol}) VALUES (?, ?)`)
                    .run(data.code, data.description);
            }

            // D. Log to Activity Tracking (using your MAX(ID) logic)
            const lastTrack = db.prepare('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking').get() as { lastId: number };
            const newTrackId = (lastTrack?.lastId || 0) + 1;

            // Match your preferred date format (16/04/26)
            const now = new Date();
            const activityDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`;

            const logMsg = `${existing ? 'Update' : 'Insertion'} of ${actionLabel} [${data.code}] and name [${data.description}] by the admin ~ ${editorShort}`;

            db.prepare('INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) VALUES (?, ?, ?, ?)')
                .run(newTrackId, activityDate, editorShort, logMsg);
        });

        transaction();
        return { success: true };

    } catch (error: any) {
        console.error("Manual Update Error:", error);
        throw createError({ statusCode: 500, statusMessage: error.message });
    }
})