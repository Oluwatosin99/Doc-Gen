import db from '../../db/database'

export default defineEventHandler(async (event) => {
    const { username, enabled, editorEmail } = await readBody(event);
    const editorShort = editorEmail.split('@')[0];
    const dateDefined = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

    try {
        const transaction = db.transaction(() => {
            // 1. Get the last ID from the table
            const lastEntry = db.prepare('SELECT MAX(ID) as lastId FROM Tbl_Administrators').get() as { lastId: number };
            const newId = (lastEntry?.lastId || 0) + 1;

            // 2. Insert with the new ID (8 if last was 7)
            db.prepare('INSERT INTO Tbl_Administrators (ID, USERNAME, ENABLED, DATEDEFINED) VALUES (?, ?, ?, ?)')
                .run(newId, username, enabled, dateDefined);

            // 3. Log Activity with the same ID logic for Tracking table
            const lastTrack = db.prepare('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking').get() as { lastId: number };
            const newTrackId = (lastTrack?.lastId || 0) + 1;

            const activityDate = new Date().toISOString().slice(2, 10).replace(/-/g, '/');
            const activityText = `Insertion of new entry for  [${username}] BY THE ADMIN ~ ${editorShort}`;

            db.prepare('INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) VALUES (?, ?, ?, ?)')
                .run(newTrackId, activityDate, editorShort, activityText);
        });

        transaction();
        return { success: true };
    } catch (e: any) {
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});