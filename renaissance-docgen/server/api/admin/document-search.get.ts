// server/api/documents/document-search.get.ts
import { queryDatabase } from '../../utils/mssql'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    
    const company = (query.company as string) || ''
    const year = (query.year as string) || ''
    const docNo = (query.docNo as string) || ''
    const showAll = query.all === 'true'
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const offset = (page - 1) * limit

    try {
        const whereClauses: string[] = []

        // 1. Build dynamic WHERE clauses (MSSQL Syntax)
        if (!showAll) {
            if (company) {
                whereClauses.push(`Organisation = '${company}'`)
            }
            if (year) {
                whereClauses.push(`DocumentNo LIKE '%-${year}-%'`)
            }
            if (docNo) {
                whereClauses.push(`DocumentNo LIKE '%${docNo}'`)
            }
        }

        const whereString = whereClauses.length > 0 
            ? `WHERE ${whereClauses.join(' AND ')}` 
            : ''

        // 2. Total Count
        const countQuery = `SELECT COUNT(*) as total FROM DocumentRegister ${whereString}`
        const countResult = await queryDatabase(countQuery)
        const total = countResult[0]?.total ?? 0

        // 3. Paginated Data (MSSQL OFFSET/FETCH syntax)
        // SQL Server requires an ORDER BY to use OFFSET
        const dataQuery = `
            SELECT 
                UserDetails, 
                ReqTime, 
                ReqDate, 
                Title, 
                Organisation, 
                DocumentNo 
            FROM DocumentRegister 
            ${whereString} 
            ORDER BY TRY_CAST(ReqDate AS DATE) DESC, ReqTime DESC 
            OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
        `
        const records = await queryDatabase(dataQuery)

        return {
            success: true,
            data: records,
            total: total
        }

    } catch (error: any) {
        console.error("Search API Error (MSSQL):", error)
        return {
            success: false,
            message: error.message,
            data: [],
            total: 0
        }
    }
})