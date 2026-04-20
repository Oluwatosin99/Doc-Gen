import db from '../../db/database'

export default defineEventHandler(async (event) => {
    try {
        const companies = db.prepare('SELECT COMPANYCODE, DESCRIPTION FROM Companies ORDER BY DESCRIPTION ASC').all();
        const functions = db.prepare('SELECT DISCIPLINECODE, DISCIPLINEDESC FROM Functions WHERE DISCIPLINECODE != \'-\' ORDER BY DISCIPLINEDESC ASC').all();
        const mediums = db.prepare('SELECT CORRESPONDENCECODE, CODEDESC FROM CorrespondenceType WHERE CORRESPONDENCECODE != \'-\' ORDER BY CODEDESC ASC').all();
        
        return {
            success: true,
            data: {
                companies,
                functions,
                mediums
            }
        }
    } catch (error) {
        console.error("Master Fetch Error:", error);
        return { success: false, data: { companies: [], functions: [], mediums: [] } }
    }
})