import db from '../db/database'

interface GeneratedDoc {
    id: string;
    title: string;
    type: string;
    function: string;
    author: string;
    date: string;
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { company, title, functionCode, medium, quantity, userEmail } = body;

    // 1. Extract Username and Format UserDetails
    // Result: AFRICA-ME\\Oluwatosin.Dawodu
    const username = userEmail.split('@')[0];
    const userDetails = `AFRICA-ME\\${username}`;

    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1;

    // 2. Format ReqDate: 14-Apr-2026
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const reqDate = `${day}-${monthName}-${year}`;

    // 3. Format ReqTime for DocumentRegister: 15:31:50:300 (24h + Milliseconds)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const reqTimeWithMS = `${hours}:${minutes}:${seconds}:${milliseconds}`;

    // 4. Format Time for NumberPool (Standard AM/PM as per historical data)
    const standardTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const activityDate = now.toISOString().slice(2, 10).replace(/-/g, '/');
    const generatedDocs: GeneratedDoc[] = [];

    const transaction = db.transaction(() => {
        const pool = db.prepare('SELECT LastNo FROM NumberPool WHERE Year = ? AND Month = ? AND Company = ?')
            .get(year, monthNum, company) as { LastNo: number } | undefined;

        let currentNo = pool ? pool.LastNo : 0;
        const startNo = currentNo + 1;


        for (let i = 0; i < quantity; i++) {
            currentNo++;
            const sequenceStr = String(currentNo).padStart(9, '0');
            const docNo = `${company}-${year}-${String(monthNum).padStart(2, '0')}-${sequenceStr}`;

            // APPLYING EDITS TO DocumentRegister ALONE
            db.prepare(`
                INSERT INTO DocumentRegister (DocumentNo, Organisation, Title, ReqDate, ReqTime, UserDetails)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(docNo, company, title, reqDate, reqTimeWithMS, userDetails);

            generatedDocs.push({
                id: docNo,
                title: title,
                type: medium,
                function: functionCode,
                author: username,
                date: reqDate
            });
        }

        // Update NumberPool using the standard format (14-Apr-26 3:31:50 PM)
        const dtTimePool = `${day}-${monthName}-${String(year).slice(-2)} ${standardTime}`;
        if (pool) {
            db.prepare('UPDATE NumberPool SET LastNo = ?, DtTime = ? WHERE Year = ? AND Month = ? AND Company = ?')
                .run(currentNo, dtTimePool, year, monthNum, company);
        } else {
            db.prepare('INSERT INTO NumberPool (Year, Month, Company, LastNo, DtTime) VALUES (?, ?, ?, ?, ?)')
                .run(year, monthNum, company, currentNo, dtTimePool);
        }

        // Activity Tracking remains with short username
        const lastTrack = db.prepare('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking').get() as { lastId: number };
        const newTrackId = (lastTrack?.lastId || 0) + 1;
        const activityText = `Generated ${quantity} Document Number(s) for ${company}`;
        db.prepare('INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) VALUES (?, ?, ?, ?)')
            .run(newTrackId,activityDate, username, activityText);
    });

    transaction();

    return { success: true, documents: generatedDocs };
});