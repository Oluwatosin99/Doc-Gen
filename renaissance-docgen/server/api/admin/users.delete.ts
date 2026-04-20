import db from '../../db/database'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, username, editorEmail } = body;
    const editorShort = editorEmail.split('@')[0];

    try {
        const transaction = db.transaction(() => {
            // 1. Delete from Admins
            db.prepare('DELETE FROM Tbl_Administrators WHERE ID = ?').run(id);

            // 2. Log deletion in Activity Tracking
            const lastTrack = db.prepare('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking').get() as { lastId: number };
            const newTrackId = (lastTrack?.lastId || 0) + 1;
            const activityDate = new Date().toISOString().slice(2, 10).replace(/-/g, '/');
            const activityText = `Removed administrator access for [${username}] by the admin ~ ${editorShort}`;

            db.prepare('INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) VALUES (?, ?, ?, ?)')
                .run(newTrackId, activityDate, editorShort, activityText);
        });

        transaction();
        return { success: true };
    } catch (e: any) {
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});