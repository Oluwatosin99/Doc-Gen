// server/api/options/all.get.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    try {
        // We use await because MSSQL is asynchronous (unlike the SQLite file)
        // Promise.all lets all three queries run at the same time for better speed
        const [companies, functions, mediums] = await Promise.all([
            queryDatabase('SELECT COMPANYCODE, DESCRIPTION FROM Companies ORDER BY DESCRIPTION ASC'),
            queryDatabase("SELECT DISCIPLINECODE, DISCIPLINEDESC FROM Functions WHERE DISCIPLINECODE != '-' ORDER BY DISCIPLINEDESC ASC"),
            queryDatabase("SELECT CORRESPONDENCECODE, CODEDESC FROM CorrespondenceType WHERE CORRESPONDENCECODE != '-' ORDER BY CODEDESC ASC")
        ])
        
        return {
            success: true,
            data: {
                companies,
                functions,
                mediums
            }
        }
    } catch (error) {
        console.error("Master Fetch Error (MSSQL):", error);
        return { 
            success: false, 
            data: { companies: [], functions: [], mediums: [] } 
        }
    }
})