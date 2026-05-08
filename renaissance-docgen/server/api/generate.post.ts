// server/api/documents/generate.post.ts
import { queryDatabase } from '../utils/mssql'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { company, title, functionCode, medium, quantity, userEmail } = body;

    const username = userEmail.split('@')[0];
    const userDetails = `AFRICA-ME\\${username}`;

    const now = new Date();
    const year = now.getFullYear();
    const shortYear = String(year).slice(-2);
    const monthNum = now.getMonth() + 1;
    const monthPadded = String(monthNum).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get the current index once to be safe
    const monthIndex = now.getMonth(); 
    
    // Force Uppercase for your DB requirements: APR, MAY, etc.
    const monthName = months[monthIndex]!.toUpperCase(); 

    // --- EXACT FORMATTING FOR DOCUMENTREGISTER ---
    
    // [DocumentRegister] ReqDate: 24-APR-2026
    const reqDateDb = `${day}-${monthName}-${year}`; 

    // [DocumentRegister] ReqTime: 12:23:45.897
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const reqTimeWithMS = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    // --- FORMATTING FOR OTHER TABLES (MSSQL COMPATIBLE) ---

    // [NumberPool] DtTime: 15-Apr-26 11:25:09 AM
    const standardTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const dtTimePool = `${day}-${months[now.getMonth()]}-${shortYear} ${standardTime}`;

    // [ActivityTracking] DateofActivity: 2026-04-24 (ISO is mandatory here to avoid 500 error)
    const activityDateDb = `${year}-${monthPadded}-${day}`;

    const generatedDocs = [];

    try {
        // STEP A: Get LastNo from NumberPool
        const poolRows = await queryDatabase(`
            SELECT LastNo FROM NumberPool 
            WHERE Year = ${year} AND Month = ${monthNum} AND Company = '${company}'
        `);
        
        const pool = poolRows[0];
        let currentNo = pool ? pool.LastNo : 0;

        // STEP B: Insert into DocumentRegister
        for (let i = 0; i < quantity; i++) {
            currentNo++;
            const sequenceStr = String(currentNo).padStart(9, '0');
            const docNo = `${company}-${year}-${monthPadded}-${sequenceStr}`;

            await queryDatabase(`
                INSERT INTO DocumentRegister (DocumentNo, Organisation, Title, ReqDate, ReqTime, UserDetails)
                VALUES ('${docNo}', '${company}', '${title}', '${reqDateDb}', '${reqTimeWithMS}', '${userDetails}')
            `);

            generatedDocs.push({
                id: docNo,
                title: title,
                type: medium,
                function: functionCode,
                author: username,
                date: reqDateDb // Matching the DB format
            });
        }

        // STEP C: Update NumberPool
        if (pool) {
            await queryDatabase(`
                UPDATE NumberPool SET LastNo = ${currentNo}, DtTime = '${dtTimePool}' 
                WHERE Year = ${year} AND Month = ${monthNum} AND Company = '${company}'
            `);
        } else {
            await queryDatabase(`
                INSERT INTO NumberPool (Year, Month, Company, LastNo, DtTime) 
                VALUES (${year}, ${monthNum}, '${company}', ${currentNo}, '${dtTimePool}')
            `);
        }

        // STEP D: Activity Tracking (Uses ISO date to prevent the conversion error)
        const trackRows = await queryDatabase('SELECT MAX(ID) as lastId FROM Tbl_ActivityTracking');
        const nextId = (Number(trackRows[0]?.lastId) || 0) + 1;
        
        await queryDatabase(`
            INSERT INTO Tbl_ActivityTracking (ID, DateofActivity, USERiD, ActivityDone) 
            VALUES (${nextId}, '${activityDateDb}', '${username}', 'Generated ${quantity} Document(s) for ${company}')
        `);

        return { success: true, documents: generatedDocs };

    } catch (e: any) {
        throw createError({ statusCode: 500, statusMessage: e.message });
    }
});