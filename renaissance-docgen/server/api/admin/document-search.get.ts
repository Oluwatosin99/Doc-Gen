import db from '../../db/database'

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
        const params: Record<string, any> = { limit, offset }

        // 1. Build dynamic WHERE clauses
        if (!showAll) {
            if (company) {
                whereClauses.push("Organisation = :company")
                params.company = company
            }
            if (year) {
                whereClauses.push("DocumentNo LIKE :year")
                params.year = `%-${year}-%`
            }
            if (docNo) {
                whereClauses.push("DocumentNo LIKE :docNo")
                params.docNo = `%${docNo}`
            }
        }

        // Initialize whereString properly to avoid redlining
        const whereString = whereClauses.length > 0 
            ? `WHERE ${whereClauses.join(' AND ')}` 
            : ''

        // 2. Total Count (Fixed type redlining)
        const countQuery = `SELECT COUNT(*) as total FROM DocumentRegister ${whereString}`
        const countResult = db.prepare(countQuery).get(params) as { total: number } | undefined
        const total = countResult?.total ?? 0

        // 3. Paginated Data
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
            ORDER BY ReqDate DESC, ReqTime DESC 
            LIMIT :limit OFFSET :offset
        `
        const records = db.prepare(dataQuery).all(params)

        return {
            success: true,
            data: records,
            total: total
        }

    } catch (error: any) {
        console.error("Search API Error:", error)
        return {
            success: false,
            message: error.message,
            data: [],
            total: 0
        }
    }
})