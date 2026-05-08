// server/api/check-admin.get.ts
import { queryDatabase } from '../utils/mssql'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const username = query.name as string 

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name required'
        })
    }

    try {
        console.log('🔍 Checking admin for:', username)

        // ✅ Check admin table in MSSQL
        // We use TOP 1 instead of LIMIT 1 for SQL Server
        const adminRows = await queryDatabase(`
            SELECT TOP 1 * FROM Tbl_Administrators 
            WHERE USERNAME = '${username}'
        `)

        const admin = adminRows[0] || null

        console.log('📦 DB result:', admin)

        return {
            success: true,
            isAdmin: !!admin,
            user: admin
        }

    } catch (error: any) {
        console.error('❌ DB error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Database error: ' + error.message
        })
    }
})