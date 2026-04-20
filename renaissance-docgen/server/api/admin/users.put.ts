import db from '../../db/database'

export default defineEventHandler(async (event) => {
    const { id, username, enabled, editorEmail } = await readBody(event);
    const editorShort = editorEmail.split('@')[0];
    const activityDate = new Date().toISOString().slice(2, 10).replace(/-/g, '/');

    try {
        const transaction = db.transaction(() => {
            // 1. Update Admin
            db.prepare('UPDATE Tbl_Administrators SET USERNAME = ?, ENABLED = ? WHERE ID = ?')
                .run(username, enabled, id);

            // 2. Audit Log: update of entry for user [NAME] by the admin ~ [NAME]
            const activityText = `update of entry for user ${username} by the admin ~ ${editorShort}`;
            db.prepare('INSERT INTO Tbl_ActivityTracking (DateofActivity, USERiD, ActivityDone) VALUES (?, ?, ?)')
                .run(activityDate, editorShort, activityText);
        });
        transaction();
        return { success: true };
    } catch (e: any) { throw createError({ statusCode: 500, statusMessage: e.message }); }
});